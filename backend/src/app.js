import express from "express";
import cors from "cors";
import problemRoutes from "./routes/problem.routes.js";
import attemptRoutes from "./routes/attempt.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import evaluationRoutes from "./routes/evaluation.routes.js";
import { errorMiddleware, notFoundHandler } from "./middleware/error.middleware.js";

const app = express();

// Enable CORS for frontend client
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true
  })
);

// Body parser
app.use(express.json({ limit: "1mb" }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// Mount domain routes
app.use("/api/problems", problemRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/evaluations", evaluationRoutes);

// 404 handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorMiddleware);

export default app;
