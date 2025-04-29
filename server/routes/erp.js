import express from "express";
import { ERPController } from "../controllers/ERPController.js";
import authMiddleware from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { cache } from "../utils/cache.js";

const router = express.Router();
const erpController = new ERPController();

// Get contract details
router.get(
  "/contracts/:id",
  [authMiddleware, cache(300)],
  asyncHandler(erpController.getContractDetails),
);

// Get all products from ERP
router.get(
  "/products",
  [authMiddleware, cache(300)],
  asyncHandler(erpController.getProducts),
);

// Get order status from ERP
router.get(
  "/order/:id/status",
  [authMiddleware],
  asyncHandler(erpController.getOrderStatus),
);

export default router;
