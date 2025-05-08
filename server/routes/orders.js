import express from "express";
import { OrderController } from "../controllers/OrderController.js";
import authMiddleware from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { cache } from "../utils/cache.js";
import multer from "multer";
import { orderValidation } from "../validation/orderValidation.js";

const router = express.Router();
const orderController = new OrderController();
const upload = multer({ dest: "uploads/" });

// Get all orders
router.get(
  "/",
  [authMiddleware, cache(60)],
  asyncHandler(orderController.getAll.bind(orderController))
);

// Get single order
router.get(
  "/:id",
  [authMiddleware, cache(300)],
  asyncHandler(orderController.getOrderById),
);

// Create new order
router.post(
  "/",
  [authMiddleware, ...orderValidation.createOrder],
  asyncHandler(orderController.createOrder),
);

// Upload bulk orders via Excel
router.post(
  "/bulk",
  [authMiddleware, upload.single("file")],
  asyncHandler(orderController.uploadBulkOrders),
);

// Clone an existing order
router.post(
  "/clone/:id",
  [authMiddleware],
  asyncHandler(orderController.cloneOrder),
);

// Update order
router.put(
  "/:id",
  [authMiddleware, ...orderValidation.updateOrder],
  asyncHandler(orderController.updateOrder),
);

// Delete/Cancel order
router.delete(
  "/:id",
  [authMiddleware],
  asyncHandler(orderController.deleteOrder),
);

// Update order status
router.patch(
  "/:id/status",
  [authMiddleware, ...orderValidation.updateStatus],
  asyncHandler(orderController.updateOrderStatus),
);

// Draft order routes
router.post(
  "/draft",
  [authMiddleware, ...orderValidation.createOrder],
  asyncHandler(orderController.createDraftOrder),
);

router.get(
  "/draft",
  [authMiddleware, cache(300)],
  asyncHandler(orderController.getDraftOrders),
);

router.put(
  "/draft/:id",
  [authMiddleware, ...orderValidation.createOrder],
  asyncHandler(orderController.updateDraftOrder),
);

router.delete(
  "/draft/:id",
  [authMiddleware],
  asyncHandler(orderController.deleteDraftOrder),
);

router.post(
  "/draft/:id/submit",
  [authMiddleware],
  asyncHandler(orderController.submitDraftOrder),
);

router.get(
  "/summary",
  authMiddleware,
  asyncHandler(orderController.getOrderSummary),
);

// Email-based order processing
router.post(
  "/email",
  [authMiddleware, upload.single("attachment")],
  asyncHandler(orderController.processEmailOrder),
);

router.get(
  "/email/:id/status",
  [authMiddleware],
  asyncHandler(orderController.getEmailOrderStatus),
);

export default router;
