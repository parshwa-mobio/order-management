import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error("Error:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  if (err.name === "MongoServerError" && err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate key error",
      field: Object.keys(err.keyValue)[0],
    });
  }

  // Default error
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
