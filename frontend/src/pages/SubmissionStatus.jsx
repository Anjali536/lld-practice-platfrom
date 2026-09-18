import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import EvaluationStatus from "../components/EvaluationStatus";
import { getAttempt, getSubmissionByAttempt, retryAttempt } from "../services/api";

export default function SubmissionStatus() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [status, setStatus] = useState("SUBMITTED"); // SUBMITTED | EVALUATING | COMPLETED | FAILED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let pollInterval = null;

    async function pollStatus() {
      try {
        const att = await getAttempt(attemptId);
        if (!isMounted) return;

        setAttempt(att);
        setStatus(att.status);

        // Fetch associated submission record
        try {
          const sub = await getSubmissionByAttempt(attemptId);
          if (isMounted && sub) {
            setSubmission({
              ...sub,
              submissionId: sub._id || sub.id
            });
          }
        } catch {
          // Submission might still be initializing
        }

        setLoading(false);

        // Terminate polling once a terminal status is reached
        if (att.status === "COMPLETED" || att.status === "FAILED") {
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load submission status.");
          setLoading(false);
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
        }
      }
    }

    // Initial check
    pollStatus();

    // Polling interval: 1.5s
    pollInterval = setInterval(pollStatus, 1500);

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [attemptId]);

  const handleRetry = async () => {
    if (!attempt) return;
    try {
      const newAttempt = await retryAttempt(attempt.problemId);
      navigate(`/practice/${newAttempt.id}`);
    } catch (err) {
      alert("Failed to create retry attempt: " + err.message);
    }
  };

  const handleViewFeedback = async () => {
    let subId = submission?.submissionId || submission?._id || attempt?.submissionId;
    if (!subId) {
      try {
        const sub = await getSubmissionByAttempt(attemptId);
        subId = sub?._id || sub?.id;
      } catch {}
    }

    if (subId) {
      navigate(`/feedback/${subId}`);
    }
  };

  if (loading) {
    return (
      <div className="container state-container">
        <div className="spinner" />
        <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}>
          Connecting to evaluation runner...
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
        <h2 className="state-title">Submission Error</h2>
        <p className="state-description">{error || "Could not locate submission."}</p>
        <Link to="/problems" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Problems</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: "5rem" }}>
      {/* Back breadcrumb */}
      <div style={{ paddingTop: "1.75rem", marginBottom: "0.75rem" }}>
        <Link
          to={`/practice/${attemptId}`}
          className="btn-ghost"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            fontSize: "0.92rem",
            fontWeight: 500
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Practice Workspace</span>
        </Link>
      </div>

      <div className="page-header" style={{ textAlign: "center", paddingTop: "0.5rem" }}>
        <h1 className="page-title">{attempt.problemTitle}</h1>
        <p className="page-subtitle" style={{ margin: "0.5rem auto 0" }}>
          Attempt #{attempt.attemptNumber} • Automated Architecture Evaluation
        </p>
      </div>

      {/* Main Stepper and Status Widget */}
      <EvaluationStatus
        status={status}
        onRetry={handleRetry}
        onViewFeedback={handleViewFeedback}
      />
    </div>
  );
}
