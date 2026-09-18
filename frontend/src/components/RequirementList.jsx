import React from "react";
import { BookOpen, CheckCircle2, ShieldAlert, Sparkles, Layers } from "lucide-react";

export default function RequirementList({ problem, compact = false }) {
  if (!problem) return null;

  const problemText =
    problem.description ||
    problem.fullDescription ||
    problem.shortDescription ||
    "Design a scalable object-oriented solution adhering to solid engineering principles.";

  // Filter functional requirements or take all if category not specified
  const requirements = problem.requirements || [];
  const constraints = problem.constraints || [];
  const considerations = problem.designConsiderations || problem.considerations || [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: compact ? "1.6rem" : "2.2rem"
      }}
    >
      {/* 1. Problem Description */}
      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
            marginBottom: "0.65rem"
          }}
        >
          <BookOpen size={18} color="var(--primary)" />
          <h3
            style={{
              fontSize: compact ? "1.05rem" : "1.15rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em"
            }}
          >
            Problem
          </h3>
        </div>
        <p
          style={{
            fontSize: compact ? "0.95rem" : "1rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            margin: 0
          }}
        >
          {problemText}
        </p>
      </section>

      {/* 2. Key Requirements */}
      {requirements.length > 0 && (
        <section>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.55rem",
              marginBottom: "0.75rem"
            }}
          >
            <CheckCircle2 size={18} color="var(--primary)" />
            <h3
              style={{
                fontSize: compact ? "1.05rem" : "1.15rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em"
              }}
            >
              Requirements
            </h3>
          </div>

          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: compact ? "0.65rem" : "0.85rem",
              margin: 0,
              padding: 0
            }}
          >
            {requirements.map((req, idx) => (
              <li
                key={req.id || idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.65rem",
                  fontSize: compact ? "0.92rem" : "0.96rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.55
                }}
              >
                <span
                  style={{
                    color: "var(--primary)",
                    fontWeight: 700,
                    lineHeight: 1.55,
                    userSelect: "none"
                  }}
                >
                  •
                </span>
                <div>
                  <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                    {req.title}:
                  </strong>{" "}
                  <span>{req.description}</span>
                  {req.category && req.category !== "Functional" && (
                    <span
                      style={{
                        marginLeft: "0.4rem",
                        fontSize: "0.72rem",
                        fontFamily: "var(--font-mono)",
                        color: "var(--accent-indigo)",
                        background: "rgba(129, 140, 248, 0.12)",
                        padding: "1px 6px",
                        borderRadius: "4px"
                      }}
                    >
                      {req.category}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 3. Constraints & Assumptions */}
      {constraints.length > 0 && (
        <section>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.55rem",
              marginBottom: "0.75rem"
            }}
          >
            <ShieldAlert size={18} color="var(--warning)" />
            <h3
              style={{
                fontSize: compact ? "1.05rem" : "1.15rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em"
              }}
            >
              Constraints & Assumptions
            </h3>
          </div>

          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: compact ? "0.55rem" : "0.75rem",
              margin: 0,
              padding: 0
            }}
          >
            {constraints.map((constraint, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.65rem",
                  fontSize: compact ? "0.9rem" : "0.95rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.55
                }}
              >
                <span
                  style={{
                    color: "var(--warning)",
                    fontWeight: 700,
                    lineHeight: 1.55,
                    userSelect: "none"
                  }}
                >
                  •
                </span>
                <span>{constraint}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 4. What to Design (Highlighted Callout) */}
      <section
        style={{
          background: "rgba(56, 189, 248, 0.04)",
          border: "1px solid rgba(56, 189, 248, 0.22)",
          borderRadius: "var(--radius-md)",
          padding: compact ? "1.1rem 1.25rem" : "1.35rem 1.5rem"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
            marginBottom: "0.65rem"
          }}
        >
          <Sparkles size={18} color="var(--primary)" />
          <h4
            style={{
              fontSize: compact ? "1rem" : "1.1rem",
              fontWeight: 700,
              color: "var(--primary)",
              letterSpacing: "-0.01em"
            }}
          >
            What to Design
          </h4>
        </div>

        {considerations.length > 0 ? (
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              margin: 0,
              padding: 0
            }}
          >
            {considerations.map((item, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: compact ? "0.9rem" : "0.94rem",
                  color: "var(--text-primary)",
                  lineHeight: 1.55,
                  paddingLeft: "0.85rem",
                  borderLeft: "2px solid rgba(56, 189, 248, 0.4)"
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p
            style={{
              fontSize: compact ? "0.9rem" : "0.95rem",
              color: "var(--text-primary)",
              lineHeight: 1.6,
              margin: 0
            }}
          >
            Formulate a complete object-oriented architecture covering entity modeling,
            state workflows, clean responsibility boundaries, and design patterns (e.g.,
            Strategy, Factory, Observer) with trade-off analysis.
          </p>
        )}
      </section>
    </div>
  );
}
