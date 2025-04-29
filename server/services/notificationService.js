import nodemailer from "nodemailer";
import sendgrid from "@sendgrid/mail";
import { promisify } from "util";
import { readFile } from "fs";
import path from "path";
import Notification from "../models/Notification.js";
import { logger } from "../utils/logger.js";

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
        pool: true, // Use pooled connections
        maxConnections: 5,
        maxMessages: 100,
        rateDelta: 1000,
        rateLimit: 5, // Limit to 5 emails per second
      });

      // Verify connection configuration on startup
      this.transporter
        .verify()
        .then(() => console.log("SMTP connection verified"))
        .catch((err) => console.error("SMTP verification failed:", err));
    }
  }

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

      // Replace template variables
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

  async createNotification(data) {
    try {
      const notification = new Notification({
        user: data.userId,
        type: data.type,
        message: data.message,
        priority: data.priority || "low",
      });

      await notification.save();

      // Send email for high priority notifications
      if (data.priority === "high" && data.email) {
        await this.sendEmail(
          data.email,
          "High Priority Notification",
          data.message,
          data.message,
        );
      }

      return notification;
    } catch (error) {
      logger.error("Failed to create notification", error);
      throw error;
    }
  }

  async getUserNotifications(userId, query = {}) {
    const filter = { user: userId };

    if (query.type) filter.type = query.type;
    if (query.read !== undefined) filter.read = query.read;

    return Notification.find(filter).sort({ createdAt: -1 }).lean();
  }

  async markAsRead(notificationId, userId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      {
        read: true,
        readAt: new Date(),
      },
      { new: true },
    );
  }

  async markAllAsRead(userId) {
    return Notification.updateMany(
      { user: userId, read: false },
      {
        read: true,
        readAt: new Date(),
      },
    );
  }

  async deleteNotification(notificationId, userId) {
    return Notification.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });
  }
}

export const notificationService = new NotificationService();
