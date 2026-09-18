/**
 * Centralized error handling middleware.
 * Formats all exceptions into a consistent { success: false, message } contract
 * and protects against leaking sensitive internal traces.
 */
export function errorMiddleware(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose CastError (invalid ObjectId format)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ID format: "${err.value}" is not a valid ObjectId.`;
  }

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = `Validation Error: ${errors.join(", ")}`;
  }

  // MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    message = "A record with matching unique values already exists.";
  }

  if (process.env.NODE_ENV !== "test" && statusCode === 500) {
    console.error(`[Unhandled Server Error] ${req.method} ${req.url}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    message
  });
}

/**
 * 404 Handler for undefined API routes
 */
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `API endpoint "${req.method} ${req.originalUrl}" does not exist.`
  });
}
