import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Play, ChevronRight } from "lucide-react";
import DifficultyBadge from "./DifficultyBadge";
import { createAttempt } from "../services/api";

export default function ProblemCard({ problem }) {
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartPractice = async (e) => {
    e.stopPropagation();
    try {
      setIsStarting(true);
      const newAttempt = await createAttempt(problem.id);
      navigate(`/practice/${newAttempt.id}`);
    } catch (err) {
      console.error("Failed to start attempt:", err);
      setIsStarting(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/problems/${problem.id}`);
  };

  const reqCount =
    problem.requirementsCount ||
    (problem.requirements && problem.requirements.length) ||
    0;

  return (
    <div
      className="card card-clickable"
      onClick={handleCardClick}
      id={`problem-card-${problem.id}`}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        position: "relative",
        padding: "1.75rem"
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1rem"
          }}
        >
          <h2
            style={{
              fontSize: "1.28rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.015em",
              lineHeight: 1.3
            }}
          >
            {problem.title}
          </h2>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.98rem",
            lineHeight: 1.6,
            marginBottom: "1.5rem"
          }}
        >
          {problem.shortDescription || problem.description}
        </p>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "1.1rem",
            borderTop: "1px solid var(--border-subtle)",
            fontSize: "0.88rem",
            color: "var(--text-muted)",
            marginBottom: "1.15rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <CheckCircle2 size={16} color="var(--primary)" />
            <span style={{ fontWeight: 500 }}>{reqCount} Requirements</span>
          </div>

          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "0.88rem"
            }}
          >
            Read Brief <ChevronRight size={15} />
          </span>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: "100%" }}
          onClick={handleStartPractice}
          disabled={isStarting}
          id={`start-practice-btn-${problem.id}`}
        >
          {isStarting ? (
            <>
              <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
              <span>Starting Workspace...</span>
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              <span>Start Practice</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
