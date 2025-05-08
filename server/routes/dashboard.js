import express from "express";
import { DashboardController } from "../controllers/DashboardController.js";
import auth from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { cache } from "../utils/cache.js";
import { query } from "express-validator";

const router = express.Router();
const dashboardController = new DashboardController();

// Validation middleware
const periodValidation = [
  query("days")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("Days must be between 1 and 365"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50")
];

// Get orders summary
router.get(
  "/orders", 
  [
    auth,
    ...periodValidation,
    cache(300) // 5 minutes cache
  ],
  asyncHandler(dashboardController.getDashboardStats)
);

// Get claims summary
router.get(
  "/claims",
  [
    auth,
    cache(300)
  ],
  asyncHandler(dashboardController.getClaimsSummary)
);

// Get top products
router.get(
  "/top-products",
  [
    auth,
    ...periodValidation,
    query("sortBy")
      .optional()
      .isIn(["quantity", "revenue"])
      .withMessage("Sort by must be either quantity or revenue"),
    cache(300)
  ],
  asyncHandler(dashboardController.getTopProducts)
);

export default router;
