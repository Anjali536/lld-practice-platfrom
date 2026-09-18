import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Send,
  CheckCircle2,
  AlertCircle,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";
import RequirementList from "../components/RequirementList";
import SolutionForm from "../components/SolutionForm";
import ConfirmationModal from "../components/ConfirmationModal";
import DifficultyBadge from "../components/DifficultyBadge";
import { getAttempt, getProblemById, saveDraft, submitSolution } from "../services/api";

export default function Practice() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [problem, setProblem] = useState(null);
  const [formData, setFormData] = useState({
    assumptions: "",
    coreClasses: "",
    responsibilities: "",
    relationships: "",
    designPatterns: "",
    edgeCases: "",
    explanation: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leftPaneVisible, setLeftPaneVisible] = useState(true);

  const autoSaveTimerRef = useRef(null);

  // Helper to extract clean 7-field string payload for backend compatibility
  const extractCanonicalPayload = (data) => ({
    assumptions: data.assumptions || "",
    coreClasses: data.coreClasses || "",
    responsibilities: data.responsibilities || "",
    relationships: data.relationships || "",
    designPatterns: data.designPatterns || "",
    edgeCases: data.edgeCases || "",
    explanation: data.explanation || ""
  });

  // Initial load of attempt and associated problem
  useEffect(() => {
    async function loadAttemptData() {
      try {
        setLoading(true);
        setError(null);
        const att = await getAttempt(attemptId);
        setAttempt(att);

        if (att.solution) {
          setFormData(att.solution);
        }
        if (att.updatedAt) {
          setLastSavedTime(new Date(att.updatedAt));
        }

        const prob = await getProblemById(att.problemId);
        setProblem(prob);
      } catch (err) {
        setError(err.message || "Failed to load attempt.");
      } finally {
        setLoading(false);
      }
    }
    loadAttemptData();
  }, [attemptId]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!attempt || loading) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        const payload = extractCanonicalPayload(formData);
        await saveDraft(attemptId, payload);
        setLastSavedTime(new Date());
      } catch (err) {
        console.warn("Auto-save silent error:", err);
      }
    }, 2500);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [formData, attemptId, attempt, loading]);

  const handleManualSave = async () => {
    try {
      setIsSaving(true);
      const payload = extractCanonicalPayload(formData);
      await saveDraft(attemptId, payload);
      setLastSavedTime(new Date());
    } catch (err) {
      alert("Error saving draft: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenSubmitModal = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setIsSubmitting(true);
      const payload = extractCanonicalPayload(formData);
      await submitSolution(attemptId, payload);
      setIsConfirmModalOpen(false);
      navigate(`/submission/${attemptId}`);
    } catch (err) {
      alert("Failed to submit solution: " + err.message);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container state-container">
        <div className="spinner" />
        <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}>
          Initializing practice workspace...
        </p>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="container state-container">
        <div className="state-icon-wrap" style={{ color: "var(--danger)" }}>
          <AlertCircle size={32} />
        </div>
        <h2 className="state-title">Attempt Not Found</h2>
        <p className="state-description">
          The requested practice attempt "{attemptId}" does not exist or was deleted.
        </p>
        <Link to="/problems" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Problems</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="workspace-container">
      {/* Top Workspace Toolbar */}
      <div className="workspace-toolbar">
        <div className="workspace-toolbar-left">
          <Link
            to="/problems"
            className="btn-ghost"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.45rem 0.75rem",
              fontSize: "0.9rem",
              fontWeight: 500
            }}
            title="Return to problems catalog"
          >
            <ArrowLeft size={16} />
            <span>Problems</span>
          </Link>

          <div style={{ height: 20, width: 1, background: "var(--border-default)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)" }}>
              {attempt.problemTitle}
            </span>
            <span
              style={{
                fontSize: "0.78rem",
                fontFamily: "var(--font-mono)",
                background: "rgba(56, 189, 248, 0.12)",
                color: "var(--primary)",
                padding: "3px 8px",
                borderRadius: "4px",
                border: "1px solid rgba(56, 189, 248, 0.25)",
                fontWeight: 600
              }}
            >
              Attempt #{attempt.attemptNumber}
            </span>
            {problem && <DifficultyBadge difficulty={problem.difficulty} />}
          </div>
        </div>

        <div className="workspace-toolbar-right">
          {/* Toggle left requirements panel */}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setLeftPaneVisible(!leftPaneVisible)}
            title={leftPaneVisible ? "Collapse specifications panel" : "Expand specifications panel"}
            style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}
          >
            {leftPaneVisible ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
            <span style={{ fontSize: "0.88rem" }}>
              {leftPaneVisible ? "Hide Specs" : "Show Specs"}
            </span>
          </button>

          {/* Last saved indicator */}
          <div className="save-indicator saved">
            <CheckCircle2 size={14} />
            <span>
              {lastSavedTime
                ? `Saved ${lastSavedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
                : "Draft ready"}
            </span>
          </div>

          {/* Manual save button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleManualSave}
            disabled={isSaving}
            id="save-draft-btn"
          >
            {isSaving ? (
              <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
            ) : (
              <Save size={15} />
            )}
            <span>Save Draft</span>
          </button>

          {/* Submit button */}
          <button
            className="btn btn-primary btn-sm"
            onClick={handleOpenSubmitModal}
            id="submit-solution-btn"
          >
            <Send size={15} />
            <span>Submit Solution</span>
          </button>
        </div>
      </div>

      {/* Split Workspace Layout */}
      <div
        className="workspace-split"
        style={{
          gridTemplateColumns: leftPaneVisible ? "440px 1fr" : "0px 1fr"
        }}
      >
        {/* Left Pane: Problem Requirements & Constraints */}
        {leftPaneVisible && (
          <aside className="workspace-left">
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                Problem Specifications
              </h2>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Reference functional requirements and design constraints while formulating your solution.
              </p>
            </div>

            <RequirementList problem={problem} compact={true} />
          </aside>
        )}

        {/* Right Pane: Solution Structured Form */}
        <main className="workspace-right">
          <div style={{ maxWidth: 880, margin: "0 auto 2rem" }}>
            <h1 style={{ fontSize: "1.65rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              Design Workspace
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.98rem", marginTop: "0.35rem", lineHeight: 1.6 }}>
              Detail your architectural decisions across each low-level design dimension. Your draft automatically saves locally.
            </p>
          </div>

          <SolutionForm formData={formData} onChange={setFormData} />
        </main>
      </div>

      {/* Confirmation & Validation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        solutionData={formData}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
