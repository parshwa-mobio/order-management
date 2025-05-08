import nodemailer from "nodemailer";
import sendgrid from "@sendgrid/mail";
import { promisify } from "util";
import { readFile } from "fs";
import path from "path";
import Notification from "../models/Notification.js";
import { logger } from "../utils/logger.js";
import { performDbOperation, DB_OPERATIONS } from "../utils/db.utils.js";

const readFileAsync = promisify(readFile);

class NotificationService {
  constructor() {
    this.emailProvider = process.env.EMAIL_PROVIDER || "nodemailer";

    if (this.emailProvider === "sendgrid") {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    } else {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateDelta: 1000,
        rateLimit: 5,
      });

      this.transporter
        .verify()
        .then(() => logger.info("SMTP connection verified"))
        .catch((err) => logger.error("SMTP verification failed:", err));
    }
  }

  // Email related methods
  async sendEmail(to, subject, html, text) {
    try {
      if (this.emailProvider === "sendgrid") {
        await sendgrid.send({
          to,
          from: process.env.EMAIL_FROM,
          subject,
          html,
          text,
        });
      } else {
        await this.transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to,
          subject,
          html,
          text,
          headers: {
            "X-Priority": "high",
            "X-MSMail-Priority": "High",
            Importance: "high",
          },
        });
      }

      logger.info("Email sent successfully", { to, subject });
    } catch (error) {
      logger.error("Failed to send email", error, { to, subject });
      throw error;
    }
  }

  async sendTemplateEmail(to, templateName, data) {
    try {
      const templatePath = path.join(
        __dirname,
        "../templates",
        `${templateName}.html`,
      );
      let template = await readFileAsync(templatePath, "utf8");

      Object.entries(data).forEach(([key, value]) => {
        template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
      });

      return await this.sendEmail(
        to,
        data.subject,
        template,
        this.stripHtml(template),
      );
    } catch (error) {
      logger.error("Template email error:", {
        error: error.message,
        template: templateName,
        to,
        timestamp: new Date().toISOString(),
      });
      return false;
    }
  }

  async sendOrderStatusUpdate(order, status) {
    const template = await this.getEmailTemplate("orderStatus", {
      orderNumber: order.orderNumber,
      status,
      customerName: order.customer.name,
    });

    await this.sendEmail(
      order.customer.email,
      `Order Status Update - ${order.orderNumber}`,
      template.html,
      template.text,
    );
  }

  stripHtml(html) {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  async sendBatch(emails) {
    return Promise.all(
      emails.map((email) =>
        this.sendEmail(email.to, email.subject, email.html, email.text),
      ),
    );
  }

  // Notification DB operations
  async getNotifications(userId, options = {}) {
    const { unreadOnly, limit = 50, type } = options;
    const query = { userId };

    if (unreadOnly === "true") {
      query.read = false;
    }
    
    if (type) {
      query.type = type;
    }

    return performDbOperation(
      Notification,
      DB_OPERATIONS.FIND,
      query,
      null,
      {
        sort: "-createdAt",
        limit: Number(limit),
        lean: true
      }
    );
  }

  async createNotification(data) {
    try {
      const notification = await performDbOperation(
        Notification,
        DB_OPERATIONS.CREATE,
        {
          user: data.userId,
          type: data.type,
          message: data.message,
          priority: data.priority || "low",
          read: false
        }
      );

      if (data.priority === "high" && data.email) {
        await this.sendEmail(
          data.email,
          "High Priority Notification",
          data.message,
          data.message
        );
      }

      return notification;
    } catch (error) {
      logger.error("Failed to create notification", error);
      throw error;
    }
  }

  async updateNotification(id, userId, updates) {
    return await Notification.findOneAndUpdate(
      { _id: id, userId },
      { 
        $set: { 
          ...updates,
          updatedAt: new Date()
        } 
      },
      { new: true }
    );
  }

  async deleteNotification(id, userId) {
    return await Notification.findOneAndDelete({
      _id: id,
      userId
    });
  }

  async markAsRead(id, userId) {
    return await Notification.findOneAndUpdate(
      { _id: id, userId },
      { 
        $set: { 
          read: true,
          readAt: new Date(),
          updatedAt: new Date()
        } 
      },
      { new: true }
    );
  }

  async markAllAsRead(userId) {
    return await Notification.updateMany(
      { userId, read: false },
      { 
        $set: { 
          read: true,
          readAt: new Date(),
          updatedAt: new Date()
        } 
      }
    );
  }
}

export const notificationService = new NotificationService();