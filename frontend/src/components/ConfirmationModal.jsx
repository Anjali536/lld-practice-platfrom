import React from "react";
import { AlertCircle, CheckCircle, Send, X } from "lucide-react";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  solutionData,
  isSubmitting
}) {
  if (!isOpen) return null;

  const sections = [
    { key: "assumptions", title: "Assumptions", required: true },
    { key: "coreClasses", title: "Core Classes", required: true },
    { key: "responsibilities", title: "Responsibilities", required: true },
    { key: "relationships", title: "Relationships", required: false },
    { key: "designPatterns", title: "Design Patterns", required: false },
    { key: "edgeCases", title: "Edge Cases", required: false },
    { key: "explanation", title: "Explanation", required: true }
  ];

  const fieldStatus = sections.map((sec) => {
    const val = (solutionData[sec.key] || "").trim();
    return {
      ...sec,
      filled: val.length > 0,
      charCount: val.length
    };
  });

  const missingRequired = fieldStatus.filter((s) => s.required && !s.filled);
  const totalFilled = fieldStatus.filter((s) => s.filled).length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h3 className="modal-title">Confirm Solution Submission</h3>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: "6px", borderRadius: "4px" }}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ lineHeight: 1.6, margin: 0 }}>
            You are about to submit your design for automated LLD evaluation.
            Please review the completeness of your solution sections:
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.65rem",
              background: "var(--bg-panel)",
              padding: "1rem 1.15rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)"
            }}
          >
            {fieldStatus.map((sec) => (
              <div
                key={sec.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.55rem",
                  fontSize: "0.9rem",
                  color: sec.filled ? "var(--text-primary)" : "var(--text-muted)"
                }}
              >
                {sec.filled ? (
                  <CheckCircle size={15} color="var(--success)" />
                ) : (
                  <AlertCircle
                    size={15}
                    color={sec.required ? "var(--danger)" : "var(--warning)"}
                  />
                )}
                <span>{sec.title}</span>
                {sec.required && !sec.filled && (
                  <span style={{ color: "var(--danger)", fontSize: "0.74rem", fontWeight: 700 }}>
                    *Req
                  </span>
                )}
              </div>
            ))}
          </div>

          {missingRequired.length > 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.65rem",
                padding: "0.85rem 1.15rem",
                borderRadius: "var(--radius-sm)",
                background: "var(--danger-bg)",
                border: "1px solid var(--danger-border)",
                color: "var(--danger)",
                fontSize: "0.92rem",
                lineHeight: 1.5
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Missing required fields: </strong>
                {missingRequired.map((m) => m.title).join(", ")}. Please complete these before submitting.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                fontSize: "0.94rem",
                color: "var(--text-secondary)"
              }}
            >
              <CheckCircle size={17} color="var(--success)" />
              <span>{totalFilled} of 7 sections documented. Ready for architectural review!</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Keep Editing
          </button>

          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={missingRequired.length > 0 || isSubmitting}
            id="modal-confirm-submit-btn"
          >
            {isSubmitting ? (
              <>
                <div className="spinner" style={{ width: 15, height: 15, borderWidth: 2 }} />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Submit For Evaluation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
