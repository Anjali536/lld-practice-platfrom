import React from "react";
import { CheckCircle2, Clock, AlertTriangle, ArrowRight, RefreshCw, Sparkles } from "lucide-react";

export default function EvaluationStatus({ status, onRetry, onViewFeedback }) {
  const isEvaluating = status === "EVALUATING" || status === "SUBMITTED";
  const isCompleted = status === "COMPLETED";
  const isFailed = status === "FAILED";

  const steps = [
    { key: "SUBMITTED", label: "Solution Received" },
    { key: "EVALUATING", label: "Evaluating Architecture" },
    { key: "COMPLETED", label: "Feedback Ready" }
  ];

  return (
    <div
      style={{
        maxWidth: 640,
        margin: "2.5rem auto",
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "2.75rem 2.25rem",
        boxShadow: "var(--shadow-md)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
      }}
    >
      {/* Stepper Timeline */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 480,
          marginBottom: "3rem",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 17,
            left: 36,
            right: 36,
            height: 2,
            background: "var(--border-default)",
            zIndex: 0
          }}
        />

        {steps.map((step, idx) => {
          let stepActive = false;
          let stepDone = false;

          if (isCompleted) {
            stepDone = true;
          } else if (isEvaluating) {
            if (step.key === "SUBMITTED") stepDone = true;
            if (step.key === "EVALUATING") stepActive = true;
          }

          return (
            <div
              key={step.key}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.6rem",
                zIndex: 1
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: stepDone
                    ? "var(--success)"
                    : stepActive
                    ? "var(--primary)"
                    : "var(--bg-subtle)",
                  border: `2px solid ${
                    stepDone
                      ? "var(--success)"
                      : stepActive
                      ? "var(--primary)"
                      : "var(--border-default)"
                  }`,
                  color: stepDone || stepActive ? "#030712" : "var(--text-muted)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  transition: "all 0.3s ease",
                  boxShadow: stepActive ? "0 0 16px rgba(56, 189, 248, 0.4)" : "none"
                }}
              >
                {stepDone ? <CheckCircle2 size={18} /> : idx + 1}
              </div>
              <span
                style={{
                  fontSize: "0.82rem",
                  fontFamily: "var(--font-mono)",
                  color: stepDone || stepActive ? "var(--text-primary)" : "var(--text-muted)",
                  fontWeight: stepDone || stepActive ? 600 : 500
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Status Display: Evaluating */}
      {isEvaluating && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
          <div className="spinner" style={{ width: 52, height: 52, borderWidth: 3.5 }} />
          <div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Evaluating Your Architecture...
            </h2>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem" }}>
              <span className="badge badge-status-evaluating">Status: Reviewing Design</span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.98rem", maxWidth: 480, lineHeight: 1.6 }}>
              Analyzing your solution against the 6 core LLD evaluation dimensions: Requirements, Responsibilities, Encapsulation, Coupling, Extensibility, and Testability.
            </p>
          </div>
        </div>
      )}

      {/* Main Status Display: Completed */}
      {isCompleted && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.35rem" }}>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: "50%",
              background: "var(--success-bg)",
              border: "1px solid var(--success-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--success)",
              boxShadow: "0 0 24px -4px rgba(16, 185, 129, 0.35)"
            }}
          >
            <CheckCircle2 size={34} />
          </div>

          <div>
            <h2 style={{ fontSize: "1.55rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.45rem" }}>
              Evaluation Completed!
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.98rem", maxWidth: 460, lineHeight: 1.6 }}>
              Your design review has been scored and granular architectural feedback across all dimensions is ready.
            </p>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={onViewFeedback}
            id="view-evaluation-feedback-btn"
          >
            <span>Review Feedback</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Main Status Display: Failed */}
      {isFailed && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.35rem" }}>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: "50%",
              background: "var(--danger-bg)",
              border: "1px solid var(--danger-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--danger)",
              boxShadow: "0 0 24px -4px rgba(244, 63, 94, 0.35)"
            }}
          >
            <AlertTriangle size={32} />
          </div>

          <div>
            <h2 style={{ fontSize: "1.55rem", fontWeight: 700, color: "var(--danger)", marginBottom: "0.45rem" }}>
              Evaluation Failed
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.98rem", maxWidth: 420, lineHeight: 1.6 }}>
              We encountered an issue while evaluating this attempt. Please retry submitting your design.
            </p>
          </div>

          <button className="btn btn-secondary" onClick={onRetry} id="retry-failed-eval-btn">
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
}
