import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, RefreshCw, Eye, ArrowRight } from "lucide-react";
import { retryAttempt, getSubmissionByAttempt } from "../services/api";

export default function AttemptCard({ attempt }) {
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    try {
      setIsRetrying(true);
      const newAttempt = await retryAttempt(attempt.problemId);
      navigate(`/practice/${newAttempt.id}`);
    } catch (err) {
      console.error("Retry failed:", err);
      setIsRetrying(false);
    }
  };

  const handleViewFeedback = async () => {
    if (attempt.status === "COMPLETED") {
      let subId = attempt.submissionId;
      if (!subId) {
        try {
          const sub = await getSubmissionByAttempt(attempt.id);
          subId = sub?._id || sub?.id;
        } catch {}
      }
      if (subId) {
        navigate(`/feedback/${subId}`);
        return;
      }
    }
    navigate(`/practice/${attempt.id}`);
  };

  // Status badge styling
  let statusBadge = "badge-status-completed";
  let statusLabel = "Completed";

  if (attempt.status === "IN_PROGRESS") {
    statusBadge = "badge-status-in-progress";
    statusLabel = "In Progress";
  } else if (attempt.status === "SUBMITTED" || attempt.status === "EVALUATING") {
    statusBadge = "badge-status-evaluating";
    statusLabel = attempt.status === "EVALUATING" ? "Evaluating" : "Submitted";
  } else if (attempt.status === "FAILED") {
    statusBadge = "badge-status-failed";
    statusLabel = "Failed";
  }

  const formattedDate = attempt.createdAt
    ? new Date(attempt.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "Recently";

  return (
    <div
      className="card"
      id={`attempt-card-${attempt.id}`}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "1.35rem",
        padding: "1.75rem"
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.015em", lineHeight: 1.3 }}>
              {attempt.problemTitle || "System Design Problem"}
            </h3>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.82rem",
                color: "var(--primary)",
                fontWeight: 600,
                marginTop: "0.2rem",
                display: "inline-block"
              }}
            >
              Attempt #{attempt.attemptNumber}
            </span>
          </div>

          <span className={`badge ${statusBadge}`}>{statusLabel}</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            marginTop: "0.4rem"
          }}
        >
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>

        {/* Evaluation summary preview */}
        {attempt.summaryScores && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.1rem",
              background: "var(--bg-panel)",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-subtle)",
              marginTop: "1.1rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              flexWrap: "wrap"
            }}
          >
            <div>
              <span style={{ color: "var(--text-muted)" }}>Responsibilities: </span>
              <strong style={{ color: "var(--text-primary)" }}>
                {attempt.summaryScores.responsibilities}/5
              </strong>
            </div>

            <div>
              <span style={{ color: "var(--text-muted)" }}>Extensibility: </span>
              <strong style={{ color: "var(--text-primary)" }}>
                {attempt.summaryScores.extensibility}/5
              </strong>
            </div>

            {attempt.summaryScores.overall && (
              <div style={{ marginLeft: "auto" }}>
                <span style={{ color: "var(--text-muted)" }}>Overall: </span>
                <strong style={{ color: "var(--primary)" }}>{attempt.summaryScores.overall}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          paddingTop: "1rem",
          borderTop: "1px solid var(--border-subtle)"
        }}
      >
        {attempt.status === "COMPLETED" ? (
          <button
            className="btn btn-outline btn-sm"
            onClick={handleViewFeedback}
            style={{ flex: 1 }}
            id={`view-feedback-btn-${attempt.id}`}
          >
            <Eye size={15} />
            <span>View Feedback</span>
          </button>
        ) : (
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleViewFeedback}
            style={{ flex: 1 }}
            id={`resume-practice-btn-${attempt.id}`}
          >
            <ArrowRight size={15} />
            <span>{attempt.status === "IN_PROGRESS" ? "Resume Practice" : "Check Status"}</span>
          </button>
        )}

        <button
          className="btn btn-secondary btn-sm"
          onClick={handleRetry}
          disabled={isRetrying}
          id={`retry-attempt-btn-${attempt.id}`}
        >
          {isRetrying ? (
            <div className="spinner" style={{ width: 13, height: 13, borderWidth: 2 }} />
          ) : (
            <RefreshCw size={14} />
          )}
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
