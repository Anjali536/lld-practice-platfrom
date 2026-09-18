import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Problems from "./pages/Problems";
import ProblemDetails from "./pages/ProblemDetails";
import Practice from "./pages/Practice";
import SubmissionStatus from "./pages/SubmissionStatus";
import Feedback from "./pages/Feedback";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/problems" replace />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:id" element={<ProblemDetails />} />
            <Route path="/practice/:attemptId" element={<Practice />} />
            <Route path="/submission/:attemptId" element={<SubmissionStatus />} />
            <Route path="/feedback/:submissionId" element={<Feedback />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
