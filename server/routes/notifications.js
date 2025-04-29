import express from "express";
import { NotificationController } from "../controllers/NotificationController.js";
import authMiddleware from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { notificationValidation } from "../validation/notificationValidation.js";
import { cache } from "../utils/cache.js";

const router = express.Router();
const notificationController = new NotificationController();

// Get all notifications with optional filters
router.get(
  "/",
  [authMiddleware, cache(60)],
  asyncHandler(notificationController.getNotifications)
);

// Get single notification
router.get(
  "/:id",
  [authMiddleware],
  asyncHandler(notificationController.getNotificationById)
);

// Create new notification
router.post(
  "/",
  [authMiddleware, ...notificationValidation.create],
  asyncHandler(notificationController.createNotification)
);

// Update notification
router.put(
  "/:id",
  [authMiddleware, ...notificationValidation.update],
  asyncHandler(notificationController.updateNotification)
);

// Delete notification
router.delete(
  "/:id",
  [authMiddleware],
  asyncHandler(notificationController.deleteNotification)
);

// Mark notification as read
router.patch(
  "/:id/read",
  [authMiddleware],
  asyncHandler(notificationController.markAsRead)
);

// Mark all notifications as read
router.patch(
  "/read-all",
  [authMiddleware],
  asyncHandler(notificationController.markAllAsRead)
);

export default router;
