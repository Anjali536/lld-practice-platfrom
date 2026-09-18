import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Play, AlertCircle, Layers } from "lucide-react";
import DifficultyBadge from "../components/DifficultyBadge";
import RequirementList from "../components/RequirementList";
import { getProblemById, createAttempt } from "../services/api";

export default function ProblemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        setError(null);
        const data = await getProblemById(id);
        setProblem(data);
      } catch (err) {
        setError(err.message || "Problem not found.");
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  const handleStartPractice = async () => {
    if (!problem) return;
    try {
      setIsStarting(true);
      const newAttempt = await createAttempt(problem.id);
      navigate(`/practice/${newAttempt.id}`);
    } catch (err) {
      console.error("Failed to start attempt:", err);
      setIsStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="container state-container">
        <div className="spinner" />
        <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}>
          Loading problem specification...
        </p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="container state-container">
        <div className="state-icon-wrap" style={{ color: "var(--danger)" }}>
          <AlertCircle size={32} />
        </div>
        <h2 className="state-title">Problem Not Found</h2>
        <p className="state-description">
          The requested problem "{id}" could not be located.
        </p>
        <Link to="/problems" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Problem List</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: "5.5rem" }}>
      {/* Top back navigation */}
      <div style={{ paddingTop: "1.75rem", marginBottom: "1.25rem" }}>
        <Link
          to="/problems"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            color: "var(--text-secondary)",
            fontSize: "0.95rem",
            fontWeight: 500,
            transition: "color var(--transition-fast)"
          }}
          className="btn-ghost"
        >
          <ArrowLeft size={16} />
          <span>Back to Problems</span>
        </Link>
      </div>

      {/* Hero header */}
      <div className="page-header" style={{ paddingTop: "0.25rem" }}>
        <div className="page-title-row">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "0.6rem" }}>
              <h1 className="page-title">{problem.title}</h1>
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>
            <p className="page-subtitle" style={{ maxWidth: 760 }}>
              {problem.fullDescription || problem.shortDescription || problem.description}
            </p>
          </div>

          <div>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleStartPractice}
              disabled={isStarting}
              id="details-start-practice-btn"
            >
              {isStarting ? (
                <>
                  <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  <span>Preparing Workspace...</span>
                </>
              ) : (
                <>
                  <Play size={18} fill="currentColor" />
                  <span>Start Practice Attempt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Problem Specifications */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "2.25rem 2.5rem",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <RequirementList problem={problem} compact={false} />
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          marginTop: "2.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.75rem 2.25rem",
          background: "var(--bg-subtle)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          flexWrap: "wrap",
          gap: "1.25rem"
        }}
      >
        <div>
          <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Ready to design the solution?
          </h4>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            Draft your assumptions, class relationships, and design pattern choices in the focused workspace.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleStartPractice}
          disabled={isStarting}
        >
          <Play size={16} fill="currentColor" />
          <span>Begin Design</span>
        </button>
      </div>
    </div>
  );
}
