import jwt from "jsonwebtoken";
import { responseHandler } from "../utils/responseHandler.js";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return responseHandler.unauthorized(res, "No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return responseHandler.unauthorized(res, "Invalid token");
    }

    req.user = user;
    next();
  } catch (error) {
    return responseHandler.unauthorized(res, "Invalid token");
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return responseHandler.forbidden(res, "Access denied");
    }
    next();
  };
};
