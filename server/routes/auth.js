import express from "express";
import { AuthController } from "../controllers/authController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { loginRateLimiter } from "../middleware/rateLimitMiddleware.js";
import { authValidation } from "../validation/authValidation.js";

const router = express.Router();
const authController = new AuthController();

router.post(
  "/login",
  loginRateLimiter,
  [...authValidation.login],
  asyncHandler(authController.login),
);

router.post(
  "/register",
  [...authValidation.register],
  asyncHandler(authController.register),
);

router.post(
  "/mfa",
  [...authValidation.mfa],
  asyncHandler(authController.verifyMfa),
);

export default router;
