import React, { useState, useEffect } from "react";
import { Terminal, AlertCircle } from "lucide-react";
import ProblemCard from "../components/ProblemCard";
import { getProblems } from "../services/api";

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProblems() {
      try {
        setLoading(true);
        const data = await getProblems();
        setProblems(data);
      } catch (err) {
        setError(err.message || "Failed to load problems.");
      } finally {
        setLoading(false);
      }
    }
    loadProblems();
  }, []);

  return (
    <div className="container" style={{ paddingBottom: "5rem" }}>
      {/* Header section */}
      <div className="page-header">
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
              <Terminal size={15} />
              <span>LOW-LEVEL DESIGN WORKBENCH</span>
            </div>
            <h1 className="page-title">Practice Problems</h1>
            <p className="page-subtitle">
              Master object-oriented design patterns, SOLID principles, and clean class architectures through realistic hands-on engineering challenges.
            </p>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="state-container">
          <div className="spinner" />
          <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}>
            Loading problem catalog...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="state-container">
          <div className="state-icon-wrap" style={{ color: "var(--danger)" }}>
            <AlertCircle size={30} />
          </div>
          <h2 className="state-title">Unable to Load Problems</h2>
          <p className="state-description">{error}</p>
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>
            Retry Loading
          </button>
        </div>
      )}

      {/* Problems Grid */}
      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "1.75rem"
          }}
        >
          {problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      )}
    </div>
  );
}
