import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layers, History, BookOpen } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const isProblemsActive =
    location.pathname === "/" ||
    location.pathname.startsWith("/problems") ||
    location.pathname.startsWith("/practice");

  const isHistoryActive = location.pathname === "/history";

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/problems" className="brand">
          <div className="brand-icon">
            <Layers size={18} strokeWidth={2.5} />
          </div>
          <span>LLD Studio</span>
          <span className="brand-badge">MVP</span>
        </Link>

        <nav className="nav-links">
          <Link
            to="/problems"
            className={`nav-item ${isProblemsActive ? "active" : ""}`}
            id="nav-problems-btn"
          >
            <BookOpen size={16} />
            <span>Problems</span>
          </Link>

          <Link
            to="/history"
            className={`nav-item ${isHistoryActive ? "active" : ""}`}
            id="nav-history-btn"
          >
            <History size={16} />
            <span>Attempt History</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
