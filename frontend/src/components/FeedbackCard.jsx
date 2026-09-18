import React from "react";
import { CheckCircle2, Award, Target } from "lucide-react";

export default function FeedbackCard({ overallSummary, strengths, improvements }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.75rem"
      }}
    >
      {/* Overall Summary Card */}
      <div
        className="card"
        style={{
          background: "linear-gradient(145deg, var(--bg-card) 0%, rgba(14, 22, 38, 0.95) 100%)",
          borderLeft: "4px solid var(--primary)",
          padding: "1.75rem 2rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.75rem" }}>
          <Award size={22} color="var(--primary)" />
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Overall Summary
          </h3>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.02rem", lineHeight: 1.65, margin: 0 }}>
          {overallSummary}
        </p>
      </div>

      {/* Strengths & Improvements Dual Column */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "1.5rem"
        }}
      >
        {/* Strengths */}
        <div
          className="card"
          style={{
            borderLeft: "3px solid var(--success)",
            background: "var(--bg-panel)",
            padding: "1.75rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "1.1rem" }}>
            <CheckCircle2 size={20} color="var(--success)" />
            <h4 style={{ fontSize: "1.12rem", fontWeight: 600, color: "var(--text-primary)" }}>
              Key Strengths
            </h4>
          </div>

          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.85rem", margin: 0, padding: 0 }}>
            {strengths?.map((str, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.65rem",
                  fontSize: "0.95rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.55
                }}
              >
                <span style={{ color: "var(--success)", fontWeight: 700, marginTop: "0.1rem" }}>
                  ✓
                </span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div
          className="card"
          style={{
            borderLeft: "3px solid var(--warning)",
            background: "var(--bg-panel)",
            padding: "1.75rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "1.1rem" }}>
            <Target size={20} color="var(--warning)" />
            <h4 style={{ fontSize: "1.12rem", fontWeight: 600, color: "var(--text-primary)" }}>
              Areas to Improve
            </h4>
          </div>

          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.85rem", margin: 0, padding: 0 }}>
            {improvements?.map((imp, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.65rem",
                  fontSize: "0.95rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.55
                }}
              >
                <span style={{ color: "var(--warning)", fontWeight: 700, marginTop: "0.1rem" }}>
                  •
                </span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
