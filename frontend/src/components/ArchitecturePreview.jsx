import React, { useState } from "react";
import { Eye, EyeOff, Layers, ArrowRight, Sparkles, Box } from "lucide-react";

export default function ArchitecturePreview({
  classes = [],
  relationships = [],
  patterns = []
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (classes.length === 0 && relationships.length === 0 && patterns.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        background: "var(--bg-panel)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        padding: "1.4rem 1.6rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}
      id="architecture-preview-container"
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
          <Layers size={18} color="var(--primary)" />
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Architecture Preview
          </h3>
          <span
            style={{
              fontSize: "0.74rem",
              fontFamily: "var(--font-mono)",
              background: "rgba(56, 189, 248, 0.12)",
              color: "var(--primary)",
              padding: "2px 7px",
              borderRadius: "4px"
            }}
          >
            Live Diagram
          </span>
        </div>

        <button
          type="button"
          className="btn-ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.84rem" }}
        >
          {isExpanded ? <EyeOff size={15} /> : <Eye size={15} />}
          <span>{isExpanded ? "Collapse" : "Expand"}</span>
        </button>
      </div>

      {isExpanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Selected Patterns Strip */}
          {patterns.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                flexWrap: "wrap",
                padding: "0.6rem 0.85rem",
                background: "rgba(56, 189, 248, 0.04)",
                border: "1px solid rgba(56, 189, 248, 0.15)",
                borderRadius: "var(--radius-sm)"
              }}
            >
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Patterns:
              </span>
              {patterns.map((p) => (
                <span
                  key={p.name}
                  style={{
                    fontSize: "0.8rem",
                    fontFamily: "var(--font-mono)",
                    color: "var(--primary)",
                    background: "rgba(56, 189, 248, 0.1)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    border: "1px solid rgba(56, 189, 248, 0.25)"
                  }}
                >
                  {p.name}
                </span>
              ))}
            </div>
          )}

          {/* Classes Visual Cards */}
          {classes.length > 0 && (
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: "0.65rem",
                  fontWeight: 600
                }}
              >
                Entities & Classes ({classes.length})
              </span>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "0.85rem"
                }}
              >
                {classes.map((cls) => {
                  const methods = Array.isArray(cls.methods) ? cls.methods : [];

                  return (
                    <div
                      key={cls.id || cls.name}
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-default)",
                        borderRadius: "var(--radius-sm)",
                        overflow: "hidden"
                      }}
                    >
                      {/* Class Header */}
                      <div
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          borderBottom: "1px solid var(--border-subtle)",
                          padding: "0.55rem 0.75rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem"
                        }}
                      >
                        <Box size={14} color="var(--primary)" />
                        <span
                          style={{
                            fontSize: "0.92rem",
                            fontWeight: 700,
                            fontFamily: "var(--font-mono)",
                            color: "var(--text-primary)"
                          }}
                        >
                          {cls.name}
                        </span>
                      </div>

                      {/* Class Body */}
                      <div style={{ padding: "0.65rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {cls.responsibility && (
                          <p
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-secondary)",
                              lineHeight: 1.4,
                              margin: 0
                            }}
                          >
                            {cls.responsibility}
                          </p>
                        )}

                        {methods.length > 0 && (
                          <div
                            style={{
                              borderTop: "1px dashed var(--border-subtle)",
                              paddingTop: "0.4rem",
                              marginTop: "0.2rem",
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.2rem"
                            }}
                          >
                            {methods.slice(0, 4).map((m, i) => (
                              <span
                                key={i}
                                style={{
                                  fontSize: "0.76rem",
                                  fontFamily: "var(--font-mono)",
                                  color: "var(--text-muted)",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap"
                                }}
                              >
                                + {m}
                              </span>
                            ))}
                            {methods.length > 4 && (
                              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                                + {methods.length - 4} more methods
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Relationships Visual Connections */}
          {relationships.length > 0 && (
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: "0.55rem",
                  fontWeight: 600
                }}
              >
                Relationships ({relationships.length})
              </span>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.6rem"
                }}
              >
                {relationships.map((rel, idx) => (
                  <div
                    key={rel.id || idx}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-sm)",
                      padding: "0.4rem 0.75rem",
                      fontSize: "0.85rem",
                      fontFamily: "var(--font-mono)"
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{rel.from}</span>
                    <span style={{ color: "var(--primary)", fontSize: "0.78rem" }}>── {rel.type} ──►</span>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{rel.to}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
