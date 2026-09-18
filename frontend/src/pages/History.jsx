import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { History as HistoryIcon, PlusCircle, AlertCircle, Sparkles } from "lucide-react";
import AttemptCard from "../components/AttemptCard";
import { getAttempts } from "../services/api";

export default function History() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAttempts();
        setAttempts(data);
      } catch (err) {
        setError(err.message || "Failed to load attempt history.");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  return (
    <div className="container" style={{ paddingBottom: "5.5rem" }}>
      {/* Header */}
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
              <HistoryIcon size={15} />
              <span>PRACTICE ARCHIVE</span>
            </div>
            <h1 className="page-title">Attempt History</h1>
            <p className="page-subtitle">
              Track your iterative low-level design progress, review past evaluation feedback, and retry problems with improved architectures.
            </p>
          </div>

          <div>
            <Link to="/problems" className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Practice New Problem</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="state-container">
          <div className="spinner" />
          <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}>
            Retrieving attempt records...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="state-container">
          <div className="state-icon-wrap" style={{ color: "var(--danger)" }}>
            <AlertCircle size={30} />
          </div>
          <h2 className="state-title">History Error</h2>
          <p className="state-description">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && attempts.length === 0 && (
        <div className="state-container" style={{ maxWidth: 460 }}>
          <div className="state-icon-wrap">
            <Sparkles size={30} />
          </div>
          <h2 className="state-title">No Practice Attempts Yet</h2>
          <p className="state-description">
            You haven't initiated any practice attempts. Select a problem from the catalog to start crafting your first LLD solution.
          </p>
          <Link to="/problems" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
            <span>Explore Problems</span>
          </Link>
        </div>
      )}

      {/* Attempts Grid */}
      {!loading && !error && attempts.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "1.75rem"
          }}
        >
          {attempts.map((attempt) => (
            <AttemptCard key={attempt.id} attempt={attempt} />
          ))}
        </div>
      )}
    </div>
  );
}
