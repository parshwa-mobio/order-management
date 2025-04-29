import { responseHandler } from "../utils/responseHandler.js";
import { logger } from "../utils/logger.js";
import Notification from "../models/Notification.js";

export class NotificationController {
  async getNotifications(req, res) {
    try {
      const { unreadOnly, limit = 50, type } = req.query;
      const query = { userId: req.user.id };

      if (unreadOnly === "true") {
        query.read = false;
      }
      
      if (type) {
        query.type = type;
      }

      const notifications = await Notification.find(query)
        .sort("-createdAt")
        .limit(Number(limit))
        .lean();

      return responseHandler.success(res, notifications);
    } catch (error) {
      logger.error("Failed to fetch notifications:", error);
      return responseHandler.error(res, "Failed to fetch notifications");
    }
  }

  async getNotificationById(req, res) {
    try {
      const notification = await Notification.findOne({
        _id: req.params.id,
        userId: req.user.id
      }).lean();

      if (!notification) {
        return responseHandler.notFound(res, "Notification not found");
      }

      return responseHandler.success(res, notification);
    } catch (error) {
      logger.error("Failed to fetch notification:", error);
      return responseHandler.error(res, "Failed to fetch notification");
    }
  }

  async createNotification(req, res) {
    try {
      const { userId, type, title, message, relatedId, role } = req.body;

      const notification = new Notification({
        userId,
        type,
        title,
        message,
        relatedId,
        role,
        read: false,
      });

      await notification.save();
      return responseHandler.success(res, notification, 201);
    } catch (error) {
      logger.error("Failed to create notification:", error);
      return responseHandler.error(res, "Failed to create notification");
    }
  }

  async updateNotification(req, res) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { 
          $set: { 
            ...req.body,
            updatedAt: new Date()
          } 
        },
        { new: true }
      );

      if (!notification) {
        return responseHandler.notFound(res, "Notification not found");
      }

      return responseHandler.success(res, notification);
    } catch (error) {
      logger.error("Failed to update notification:", error);
      return responseHandler.error(res, "Failed to update notification");
    }
  }

  async deleteNotification(req, res) {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id
      });

      if (!notification) {
        return responseHandler.notFound(res, "Notification not found");
      }

      return responseHandler.success(res, { message: "Notification deleted successfully" });
    } catch (error) {
      logger.error("Failed to delete notification:", error);
      return responseHandler.error(res, "Failed to delete notification");
    }
  }

  async markAsRead(req, res) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { 
          $set: { 
            read: true,
            readAt: new Date(),
            updatedAt: new Date()
          } 
        },
        { new: true }
      );

      if (!notification) {
        return responseHandler.notFound(res, "Notification not found");
      }

      return responseHandler.success(res, notification);
    } catch (error) {
      logger.error("Failed to mark notification as read:", error);
      return responseHandler.error(res, "Failed to mark notification as read");
    }
  }

  async markAllAsRead(req, res) {
    try {
      await Notification.updateMany(
        { userId: req.user.id, read: false },
        { 
          $set: { 
            read: true,
            readAt: new Date(),
            updatedAt: new Date()
          } 
        }
      );

      return responseHandler.success(res, { message: "All notifications marked as read" });
    } catch (error) {
      logger.error("Failed to mark all notifications as read:", error);
      return responseHandler.error(res, "Failed to mark all notifications as read");
    }
  }
}
