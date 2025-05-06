import express from "express";
import { ShipmentController } from "../controllers/ShipmentController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import authMiddleware from "../middleware/auth.js";
import { cache } from "../utils/cache.js";

const router = express.Router();
const shipmentController = new ShipmentController();

// Get shipment details and tracking info
router.get(
  "/:orderId",
  [
    authMiddleware,
    cache(60), // Short cache due to live nature
  ],
  asyncHandler(shipmentController.getShipmentByOrderId)
);

export default router;
