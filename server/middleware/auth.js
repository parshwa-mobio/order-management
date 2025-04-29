import jwt from "jsonwebtoken";
import { responseHandler } from "../utils/responseHandler.js";
import User from "../models/User.js";
import { logger } from "../utils/logger.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return responseHandler.error(res, "No token provided", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      tokenVersion: decoded.version,
    }).select("-password -mfaSecret");

    if (!user) {
      return responseHandler.error(res, "User not found", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);

    if (error.name === "JsonWebTokenError") {
      return responseHandler.error(res, "Invalid token", 401);
    }

    if (error.name === "TokenExpiredError") {
      return responseHandler.error(res, "Token expired", 401);
    }

    return responseHandler.error(res, "Authentication failed", 401);
  }
};

export default authMiddleware;
