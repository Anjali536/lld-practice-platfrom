import React, { useState } from "react";
import { Plus, Trash2, GitFork, ArrowRight } from "lucide-react";

const COMMON_RELATIONSHIP_TYPES = [
  "contains",
  "has-a",
  "inherits from",
  "implements",
  "uses",
  "assigned to",
  "notifies",
  "creates"
];

export default function RelationshipEditor({
  relationships = [],
  availableClasses = [],
  onChange
}) {
  const [fromClass, setFromClass] = useState("");
  const [relationType, setRelationType] = useState("contains");
  const [toClass, setToClass] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    const from = fromClass.trim();
    const to = toClass.trim();
    const type = relationType.trim();

    if (!from || !to) return;

    const newRel = {
      id: `rel-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      from,
      type: type || "associates with",
      to
    };

    onChange([...relationships, newRel]);
    setFromClass("");
    setToClass("");
  };

  const handleRemove = (id) => {
    onChange(relationships.filter((r) => r.id !== id));
  };

  // Extract class names list
  const classNames = availableClasses
    .map((c) => (typeof c === "string" ? c : c.name))
    .filter(Boolean);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          {relationships.length === 0
            ? "Express structural and behavioral relationships between your classes."
            : `${relationships.length} relationship${relationships.length > 1 ? "s" : ""} defined`}
        </span>
      </div>

      {/* Add relationship form */}
      <form
        onSubmit={handleAdd}
        style={{
          background: "var(--bg-panel)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          padding: "1.1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          flexWrap: "wrap"
        }}
        id="add-relationship-form"
      >
        {/* From Class */}
        <div style={{ flex: "1 1 180px" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.76rem",
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
              marginBottom: "0.25rem",
              fontWeight: 600
            }}
          >
            SOURCE CLASS
          </label>
          <input
            type="text"
            list="class-options-from"
            placeholder="e.g., ParkingLot"
            value={fromClass}
            onChange={(e) => setFromClass(e.target.value)}
            required
            id="input-rel-from"
            style={{
              width: "100%",
              background: "var(--bg-input)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-sm)",
              padding: "0.55rem 0.75rem",
              fontSize: "0.92rem",
              fontFamily: "var(--font-mono)",
              color: "var(--text-primary)"
            }}
          />
          <datalist id="class-options-from">
            {classNames.map((name, i) => (
              <option key={i} value={name} />
            ))}
          </datalist>
        </div>

        {/* Relationship Type */}
        <div style={{ flex: "1 1 160px" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.76rem",
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
              marginBottom: "0.25rem",
              fontWeight: 600
            }}
          >
            RELATIONSHIP
          </label>
          <input
            type="text"
            list="relation-type-options"
            placeholder="contains"
            value={relationType}
            onChange={(e) => setRelationType(e.target.value)}
            required
            id="input-rel-type"
            style={{
              width: "100%",
              background: "var(--bg-input)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-sm)",
              padding: "0.55rem 0.75rem",
              fontSize: "0.92rem",
              color: "var(--primary)"
            }}
          />
          <datalist id="relation-type-options">
            {COMMON_RELATIONSHIP_TYPES.map((t, i) => (
              <option key={i} value={t} />
            ))}
          </datalist>
        </div>

        {/* To Class */}
        <div style={{ flex: "1 1 180px" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.76rem",
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
              marginBottom: "0.25rem",
              fontWeight: 600
            }}
          >
            TARGET CLASS
          </label>
          <input
            type="text"
            list="class-options-to"
            placeholder="e.g., ParkingFloor"
            value={toClass}
            onChange={(e) => setToClass(e.target.value)}
            required
            id="input-rel-to"
            style={{
              width: "100%",
              background: "var(--bg-input)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-sm)",
              padding: "0.55rem 0.75rem",
              fontSize: "0.92rem",
              fontFamily: "var(--font-mono)",
              color: "var(--text-primary)"
            }}
          />
          <datalist id="class-options-to">
            {classNames.map((name, i) => (
              <option key={i} value={name} />
            ))}
          </datalist>
        </div>

        {/* Submit button */}
        <div style={{ alignSelf: "flex-end" }}>
          <button
            type="submit"
            className="btn btn-secondary btn-sm"
            disabled={!fromClass.trim() || !toClass.trim()}
            id="add-relationship-btn"
            style={{ height: "36px", display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            <Plus size={14} color="var(--primary)" />
            <span>Add</span>
          </button>
        </div>
      </form>

      {/* Relationships list */}
      {relationships.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {relationships.map((rel) => (
            <div
              key={rel.id}
              style={{
                background: "var(--bg-panel)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                padding: "0.65rem 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem"
              }}
              className="relationship-row-item"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.95rem",
                  flexWrap: "wrap"
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    background: "rgba(255, 255, 255, 0.04)",
                    padding: "3px 8px",
                    borderRadius: "4px"
                  }}
                >
                  {rel.from}
                </span>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    color: "var(--primary)",
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-mono)"
                  }}
                >
                  ── <span style={{ fontStyle: "italic" }}>{rel.type}</span> ──►
                </span>

                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    background: "rgba(255, 255, 255, 0.04)",
                    padding: "3px 8px",
                    borderRadius: "4px"
                  }}
                >
                  {rel.to}
                </span>
              </div>

              <button
                type="button"
                className="btn-ghost"
                onClick={() => handleRemove(rel.id)}
                style={{ padding: "4px", borderRadius: "4px", color: "var(--danger)" }}
                title="Remove relationship"
                aria-label={`Remove relationship between ${rel.from} and ${rel.to}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: "1.25rem",
            background: "var(--bg-panel)",
            border: "1px dashed var(--border-default)",
            borderRadius: "var(--radius-sm)",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "0.88rem"
          }}
        >
          No relationships added yet. Connect your defined classes above.
        </div>
      )}
    </div>
  );
}
