import express from "express";
import { SalesController } from "../controllers/SalesController.js";
import authMiddleware from "../middleware/auth.js";
import rbac from "../middleware/rbac.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { cache } from "../utils/cache.js";

const router = express.Router();
const salesController = new SalesController();

// Get sales targets
router.get(
  "/targets",
  [authMiddleware, rbac(["admin", "sales"]), cache(300)],
  asyncHandler(salesController.getSalesTargets),
);

// Get sales reports
router.get(
  "/reports",
  [authMiddleware, rbac(["admin", "sales"]), cache(300)],
  asyncHandler(salesController.getSalesReports),
);

// Get distributor 360 view
router.get(
  "/distributor/:id/360",
  [authMiddleware, rbac(["admin", "sales"]), cache(300)],
  asyncHandler(salesController.getDistributor360),
);

export default router;
