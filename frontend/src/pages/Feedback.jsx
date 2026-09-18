import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  History,
  AlertCircle,
  Sparkles,
  BarChart3
} from "lucide-react";
import FeedbackCard from "../components/FeedbackCard";
import CriterionCard from "../components/CriterionCard";
import { getEvaluation, retryAttempt, getProblemById } from "../services/api";

export default function Feedback() {
  const { submissionId } = useParams();
  const navigate = useNavigate();

  const [evaluation, setEvaluation] = useState(null);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    async function loadFeedbackData() {
      try {
        setLoading(true);
        setError(null);
        const evalData = await getEvaluation(submissionId);
        setEvaluation(evalData);

        if (evalData.problemId) {
          const prob = await getProblemById(evalData.problemId);
          setProblem(prob);
        }
      } catch (err) {
        setError(err.message || "Failed to load evaluation feedback.");
      } finally {
        setLoading(false);
      }
    }

    loadFeedbackData();
  }, [submissionId]);

  const handleRetry = async () => {
    if (!evaluation?.problemId) return;
    try {
      setIsRetrying(true);
      const newAttempt = await retryAttempt(evaluation.problemId);
      navigate(`/practice/${newAttempt.id}`);
    } catch (err) {
      alert("Failed to start retry attempt: " + err.message);
      setIsRetrying(false);
    }
  };

  if (loading) {
    return (
      <div className="container state-container">
        <div className="spinner" />
        <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}>
          Generating architectural evaluation report...
        </p>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="container state-container">
        <div className="state-icon-wrap" style={{ color: "var(--danger)" }}>
          <AlertCircle size={32} />
        </div>
        <h2 className="state-title">Feedback Unavailable</h2>
        <p className="state-description">{error || "Could not find evaluation details."}</p>
        <Link to="/problems" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Problems</span>
        </Link>
      </div>
    );
  }

  // Calculate aggregate score
  const totalScore = evaluation.criteria?.reduce((acc, c) => acc + c.score, 0) || 0;
  const maxScore = (evaluation.criteria?.length || 6) * 5;
  const scorePercent = Math.round((totalScore / maxScore) * 100);

  return (
    <div className="container" style={{ paddingBottom: "5.5rem" }}>
      {/* Top Navigation */}
      <div
        style={{
          paddingTop: "1.75rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Link
          to="/history"
          className="btn-ghost"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            fontSize: "0.95rem",
            fontWeight: 500
          }}
        >
          <History size={17} />
          <span>View Attempt History</span>
        </Link>

        <button
          className="btn btn-primary btn-sm"
          onClick={handleRetry}
          disabled={isRetrying}
          id="feedback-try-again-btn"
        >
          {isRetrying ? (
            <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
          ) : (
            <RefreshCw size={15} />
          )}
          <span>Try Again</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="page-header" style={{ paddingTop: "0.5rem" }}>
        <div className="page-title-row">
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                color: "var(--primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.84rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                marginBottom: "0.5rem"
              }}
            >
              <Sparkles size={15} />
              <span>ARCHITECTURAL EVALUATION REPORT</span>
            </div>
            <h1 className="page-title">
              {problem?.title || "Low-Level Design"} Feedback
            </h1>
            <p className="page-subtitle">
              Detailed assessment of your object-oriented structure, responsibility allocation, and design pattern execution.
            </p>
          </div>

          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-lg)",
              padding: "1.25rem 2rem",
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.78rem",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  fontWeight: 600
                }}
              >
                Overall Score
              </span>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  color: "var(--primary)",
                  lineHeight: 1.1,
                  marginTop: "0.2rem"
                }}
              >
                {totalScore} <span style={{ fontSize: "1.05rem", color: "var(--text-muted)", fontWeight: 500 }}>/ {maxScore}</span>
              </div>
            </div>

            <div
              style={{
                background: "var(--primary-muted)",
                color: "var(--primary)",
                border: "1px solid rgba(56, 189, 248, 0.35)",
                padding: "0.45rem 0.85rem",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "0.98rem"
              }}
            >
              {scorePercent}%
            </div>
          </div>
        </div>
      </div>

      {/* Overall Summary & Strengths / Improvements */}
      <section style={{ marginBottom: "3rem" }}>
        <FeedbackCard
          overallSummary={evaluation.overallSummary}
          strengths={evaluation.strengths}
          improvements={evaluation.improvements}
        />
      </section>

      {/* Granular Evaluation Breakdown by Criteria */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
          <BarChart3 size={22} color="var(--primary)" />
          <h2 style={{ fontSize: "1.45rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.015em" }}>
            Evaluation Breakdown
          </h2>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.98rem", marginBottom: "1.5rem" }}>
          Each criterion is judged against industry-standard Low-Level Design principles with supporting evidence from your submission.
        </p>

        <div className="feedback-grid">
          {evaluation.criteria?.map((criterion, idx) => (
            <CriterionCard key={criterion.name || idx} criterion={criterion} />
          ))}
        </div>
      </section>

      {/* Bottom Actions Bar */}
      <div
        style={{
          marginTop: "3.75rem",
          padding: "2.25rem",
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Ready to iterate and refine your design?
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.96rem", marginTop: "0.3rem" }}>
            Create a fresh attempt to incorporate the suggestions while preserving this feedback in history.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/history" className="btn btn-secondary">
            <History size={16} />
            <span>Attempt History</span>
          </Link>

          <button
            className="btn btn-primary"
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
            ) : (
              <RefreshCw size={16} />
            )}
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
