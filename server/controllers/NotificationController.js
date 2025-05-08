import { responseHandler } from "../utils/responseHandler.js";
import { logger } from "../utils/logger.js";
import { notificationService } from "../services/notificationService.js";

export class NotificationController {
  constructor() {
    // Bind all methods to the instance
    this.getNotifications = this.getNotifications.bind(this);
    this.getNotificationById = this.getNotificationById.bind(this);
    this.createNotification = this.createNotification.bind(this);
    this.updateNotification = this.updateNotification.bind(this);
    this.deleteNotification = this.deleteNotification.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
    this.markAllAsRead = this.markAllAsRead.bind(this);
  }

  async getNotifications(req, res) {
    try {
      const notifications = await notificationService.getNotifications(req.user.id, req.query);
      return responseHandler.success(res, notifications);
    } catch (error) {
      logger.error("Failed to fetch notifications:", error);
      return responseHandler.error(res, "Failed to fetch notifications");
    }
  }

  async getNotificationById(req, res) {
    try {
      const notification = await notificationService.getNotificationById(req.params.id, req.user.id);

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
      const notification = await notificationService.createNotification(req.body);
      return responseHandler.success(res, notification, 201);
    } catch (error) {
      logger.error("Failed to create notification:", error);
      return responseHandler.error(res, "Failed to create notification");
    }
  }

  async updateNotification(req, res) {
    try {
      const notification = await notificationService.updateNotification(
        req.params.id,
        req.user.id,
        req.body
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
      const notification = await notificationService.deleteNotification(req.params.id, req.user.id);

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
      const notification = await notificationService.markAsRead(req.params.id, req.user.id);

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
      await notificationService.markAllAsRead(req.user.id);
      return responseHandler.success(res, { message: "All notifications marked as read" });
    } catch (error) {
      logger.error("Failed to mark all notifications as read:", error);
      return responseHandler.error(res, "Failed to mark all notifications as read");
    }
  }
}
