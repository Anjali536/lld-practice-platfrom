import React, { useState } from "react";
import { Plus, Edit3, Trash2, Box, Check, X, Code2 } from "lucide-react";

export default function ClassCardList({ classes = [], onChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formName, setFormName] = useState("");
  const [formResp, setFormResp] = useState("");
  const [formMethods, setFormMethods] = useState("");

  const handleStartAdd = () => {
    setEditingId(null);
    setFormName("");
    setFormResp("");
    setFormMethods("");
    setIsEditing(true);
  };

  const handleStartEdit = (cls) => {
    setEditingId(cls.id);
    setFormName(cls.name || "");
    setFormResp(cls.responsibility || "");
    setFormMethods(
      Array.isArray(cls.methods) ? cls.methods.join(", ") : cls.methods || ""
    );
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const trimmedName = formName.trim();
    if (!trimmedName) return;

    const methodsArray = formMethods
      .split(/[,;\n]/)
      .map((m) => m.trim())
      .filter(Boolean);

    if (editingId) {
      // Update existing class
      const updated = classes.map((c) =>
        c.id === editingId
          ? {
              ...c,
              name: trimmedName,
              responsibility: formResp.trim(),
              methods: methodsArray
            }
          : c
      );
      onChange(updated);
    } else {
      // Add new class
      const newClass = {
        id: `cls-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: trimmedName,
        responsibility: formResp.trim(),
        methods: methodsArray
      };
      onChange([...classes, newClass]);
    }

    setIsEditing(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const updated = classes.filter((c) => c.id !== id);
    onChange(updated);
    if (editingId === id) {
      setIsEditing(false);
      setEditingId(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Top action row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          {classes.length === 0
            ? "Define the core entities, objects, and services for your system."
            : `${classes.length} class${classes.length > 1 ? "es" : ""} defined`}
        </span>

        {!isEditing && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleStartAdd}
            id="add-class-btn"
            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Plus size={15} color="var(--primary)" />
            <span>Add Class</span>
          </button>
        )}
      </div>

      {/* Inline Form when adding or editing */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          style={{
            background: "var(--bg-panel)",
            border: "1px solid var(--border-highlight)",
            borderRadius: "var(--radius-md)",
            padding: "1.4rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            boxShadow: "var(--shadow-sm)"
          }}
          id="class-editor-form"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Box size={17} color="var(--primary)" />
              <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {editingId ? "Edit Class" : "Define New Class"}
              </h4>
            </div>
            <button
              type="button"
              className="btn-ghost"
              onClick={handleCancel}
              style={{ padding: "4px", borderRadius: "4px" }}
              aria-label="Cancel editing"
            >
              <X size={17} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "1rem" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                  marginBottom: "0.35rem",
                  fontWeight: 600
                }}
              >
                CLASS NAME *
              </label>
              <input
                type="text"
                placeholder="e.g., ParkingLot, CompactSpot"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                autoFocus
                id="input-class-name"
                style={{
                  width: "100%",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.6rem 0.85rem",
                  fontSize: "0.95rem",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-primary)"
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                  marginBottom: "0.35rem",
                  fontWeight: 600
                }}
              >
                PRIMARY RESPONSIBILITY
              </label>
              <input
                type="text"
                placeholder="e.g., Coordinates floor allocation and gate entry operations"
                value={formResp}
                onChange={(e) => setFormResp(e.target.value)}
                id="input-class-responsibility"
                style={{
                  width: "100%",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.6rem 0.85rem",
                  fontSize: "0.95rem",
                  color: "var(--text-primary)"
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontFamily: "var(--font-mono)",
                color: "var(--text-muted)",
                marginBottom: "0.35rem",
                fontWeight: 600
              }}
            >
              KEY METHODS (COMMA-SEPARATED)
            </label>
            <input
              type="text"
              placeholder="e.g., parkVehicle(Vehicle), removeVehicle(Ticket), findAvailableSpot(SpotType)"
              value={formMethods}
              onChange={(e) => setFormMethods(e.target.value)}
              id="input-class-methods"
              style={{
                width: "100%",
                background: "var(--bg-input)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-sm)",
                padding: "0.6rem 0.85rem",
                fontSize: "0.92rem",
                fontFamily: "var(--font-mono)",
                color: "var(--text-primary)"
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={!formName.trim()}
              id="save-class-submit-btn"
            >
              <Check size={14} />
              <span>{editingId ? "Update Class" : "Save Class"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Class Cards Grid */}
      {classes.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem"
          }}
        >
          {classes.map((cls) => {
            const methods = Array.isArray(cls.methods) ? cls.methods : [];

            return (
              <div
                key={cls.id}
                style={{
                  background: "var(--bg-panel)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.2rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "0.85rem",
                  transition: "all var(--transition-fast)"
                }}
                className="class-card-item"
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      marginBottom: "0.4rem",
                      borderBottom: "1px solid var(--border-subtle)",
                      paddingBottom: "0.6rem"
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                        color: "var(--primary)",
                        letterSpacing: "-0.01em"
                      }}
                    >
                      {cls.name}
                    </span>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => handleStartEdit(cls)}
                        style={{ padding: "4px", borderRadius: "4px" }}
                        title="Edit class"
                        aria-label={`Edit ${cls.name}`}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => handleDelete(cls.id)}
                        style={{ padding: "4px", borderRadius: "4px", color: "var(--danger)" }}
                        title="Remove class"
                        aria-label={`Delete ${cls.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {cls.responsibility && (
                    <p
                      style={{
                        fontSize: "0.88rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                        margin: "0 0 0.65rem 0"
                      }}
                    >
                      {cls.responsibility}
                    </p>
                  )}

                  {methods.length > 0 && (
                    <div>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontFamily: "var(--font-mono)",
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          display: "block",
                          marginBottom: "0.3rem",
                          fontWeight: 600
                        }}
                      >
                        Methods
                      </span>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.25rem"
                        }}
                      >
                        {methods.map((method, mIdx) => (
                          <div
                            key={mIdx}
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.82rem",
                              color: "var(--text-primary)",
                              background: "rgba(255, 255, 255, 0.03)",
                              padding: "2px 6px",
                              borderRadius: "3px",
                              display: "inline-block"
                            }}
                          >
                            + {method}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !isEditing && (
          <div
            style={{
              padding: "2rem",
              background: "var(--bg-panel)",
              border: "1px dashed var(--border-default)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: "0.75rem"
            }}
          >
            <Box size={28} color="var(--text-muted)" />
            <div>
              <h4 style={{ fontSize: "0.98rem", fontWeight: 600, color: "var(--text-primary)" }}>
                No Classes Added Yet
              </h4>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                Add the key classes, interfaces, and entities that structure your solution.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleStartAdd}
              style={{ marginTop: "0.25rem" }}
            >
              <Plus size={14} color="var(--primary)" />
              <span>Add First Class</span>
            </button>
          </div>
        )
      )}
    </div>
  );
}
