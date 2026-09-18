import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container state-container" style={{ padding: "6rem 1.5rem" }}>
      <div className="state-icon-wrap" style={{ color: "var(--warning)" }}>
        <AlertCircle size={32} />
      </div>
      <h1 className="state-title">Page Not Found</h1>
      <p className="state-description">
        The route you navigated to doesn't exist or has moved. Use the options below to return to your practice session.
      </p>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <Link to="/problems" className="btn btn-primary">
          <Home size={16} />
          <span>Go to Problems</span>
        </Link>
        <Link to="/history" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Attempt History</span>
        </Link>
      </div>
    </div>
  );
}
