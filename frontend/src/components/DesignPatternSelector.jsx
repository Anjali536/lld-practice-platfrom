import React, { useState } from "react";
import { Cpu, Check, Plus, X, Sparkles } from "lucide-react";

const SUGGESTED_PATTERNS = [
  "Strategy",
  "Factory Method",
  "Observer",
  "Singleton",
  "State",
  "Command",
  "Decorator",
  "Adapter",
  "Template Method",
  "Composite"
];

export default function DesignPatternSelector({ patterns = [], onChange }) {
  const [customPatternInput, setCustomPatternInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const isSelected = (name) => patterns.some((p) => p.name.toLowerCase() === name.toLowerCase());

  const handleTogglePattern = (name) => {
    if (isSelected(name)) {
      onChange(patterns.filter((p) => p.name.toLowerCase() !== name.toLowerCase()));
    } else {
      onChange([...patterns, { name, reason: "" }]);
    }
  };

  const handleReasonChange = (name, reason) => {
    onChange(
      patterns.map((p) => (p.name.toLowerCase() === name.toLowerCase() ? { ...p, reason } : p))
    );
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const trimmed = customPatternInput.trim();
    if (!trimmed) return;
    if (!isSelected(trimmed)) {
      onChange([...patterns, { name: trimmed, reason: "" }]);
    }
    setCustomPatternInput("");
    setShowCustomInput(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Pattern chips list */}
      <div>
        <span
          style={{
            display: "block",
            fontSize: "0.84rem",
            color: "var(--text-secondary)",
            marginBottom: "0.6rem"
          }}
        >
          Select design patterns, abstractions, or behavioral interfaces used in your architecture:
        </span>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {SUGGESTED_PATTERNS.map((name) => {
            const selected = isSelected(name);

            return (
              <button
                type="button"
                key={name}
                onClick={() => handleTogglePattern(name)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "9999px",
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: selected ? 600 : 500,
                  background: selected ? "var(--primary-muted)" : "var(--bg-panel)",
                  color: selected ? "var(--primary)" : "var(--text-secondary)",
                  border: `1px solid ${selected ? "var(--border-highlight)" : "var(--border-subtle)"}`,
                  cursor: "pointer",
                  transition: "all var(--transition-fast)"
                }}
                className="pattern-chip-btn"
              >
                {selected && <Check size={13} />}
                <span>{name}</span>
              </button>
            );
          })}

          {/* Custom pattern trigger */}
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.4rem 0.85rem",
                borderRadius: "9999px",
                fontSize: "0.85rem",
                fontFamily: "var(--font-mono)",
                background: "transparent",
                color: "var(--text-muted)",
                border: "1px dashed var(--border-default)",
                cursor: "pointer"
              }}
            >
              <Plus size={13} />
              <span>Other Pattern</span>
            </button>
          ) : (
            <form
              onSubmit={handleAddCustom}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
            >
              <input
                type="text"
                placeholder="Pattern name"
                value={customPatternInput}
                onChange={(e) => setCustomPatternInput(e.target.value)}
                autoFocus
                style={{
                  background: "var(--bg-input)",
                  border: "1px solid var(--primary)",
                  borderRadius: "9999px",
                  padding: "0.35rem 0.75rem",
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-primary)",
                  width: "140px"
                }}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ padding: "0.35rem 0.65rem", borderRadius: "9999px" }}
              >
                <Check size={12} />
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowCustomInput(false)}
                style={{ padding: "4px" }}
              >
                <X size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Rationale for selected patterns */}
      {patterns.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.25rem" }}>
          <span
            style={{
              fontSize: "0.82rem",
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              fontWeight: 600
            }}
          >
            Pattern Justification & Usage (Optional)
          </span>

          {patterns.map((p) => (
            <div
              key={p.name}
              style={{
                background: "var(--bg-panel)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                padding: "0.75rem 1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    color: "var(--primary)"
                  }}
                >
                  {p.name} Pattern
                </span>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => handleTogglePattern(p.name)}
                  style={{ padding: "2px", color: "var(--text-muted)" }}
                  title="Remove pattern"
                >
                  <X size={14} />
                </button>
              </div>

              <input
                type="text"
                placeholder={`Why are you choosing ${p.name}? (e.g., dynamic fee computation, decoupling spot allocation)`}
                value={p.reason || ""}
                onChange={(e) => handleReasonChange(p.name, e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.9rem",
                  color: "var(--text-primary)"
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
