import React from "react";
import { Sparkles, AlertCircle } from "lucide-react";

export default function CriterionCard({ criterion }) {
  const { name, score, evidence, concern, suggestion, confidence } = criterion;

  // Rating color helper
  let scoreColor = "var(--success)";
  let scoreBg = "var(--success-bg)";
  let scoreBorder = "var(--success-border)";

  if (score < 3) {
    scoreColor = "var(--danger)";
    scoreBg = "var(--danger-bg)";
    scoreBorder = "var(--danger-border)";
  } else if (score === 3) {
    scoreColor = "var(--warning)";
    scoreBg = "var(--warning-bg)";
    scoreBorder = "var(--warning-border)";
  }

  const confidencePercent = confidence ? Math.round(confidence * 100) : 88;

  return (
    <div className="criterion-card" id={`criterion-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}>
      <div className="criterion-top">
        <div>
          <h4 className="criterion-name">{name}</h4>
          <span
            style={{
              fontSize: "0.78rem",
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              marginTop: "0.25rem"
            }}
          >
            Confidence: <strong style={{ color: "var(--text-secondary)" }}>{confidencePercent}%</strong>
          </span>
        </div>

        <div
          className="criterion-score-badge"
          style={{
            background: scoreBg,
            color: scoreColor,
            border: `1px solid ${scoreBorder}`
          }}
        >
          {score} / 5
        </div>
      </div>

      {/* Evidence Block */}
      <div className="criterion-block">
        <span className="criterion-block-label" style={{ color: "var(--primary)" }}>
          Evidence
        </span>
        <p className="criterion-block-text">{evidence}</p>
      </div>

      {/* Concern Block */}
      {concern && (
        <div className="criterion-block">
          <span className="criterion-block-label" style={{ color: "var(--warning)" }}>
            Concern
          </span>
          <p className="criterion-block-text">{concern}</p>
        </div>
      )}

      {/* Suggestion Block */}
      {suggestion && (
        <div
          className="criterion-block"
          style={{
            background: "rgba(56, 189, 248, 0.05)",
            borderLeft: "3px solid var(--primary)",
            padding: "0.75rem 1rem",
            borderRadius: "0 var(--radius-sm) var(--radius-sm) 0"
          }}
        >
          <span
            className="criterion-block-label"
            style={{
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              marginBottom: "0.25rem"
            }}
          >
            <Sparkles size={13} />
            Suggestion
          </span>
          <p className="criterion-block-text" style={{ color: "var(--text-primary)" }}>
            {suggestion}
          </p>
        </div>
      )}
    </div>
  );
}
