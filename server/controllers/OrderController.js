import Order from "../models/Order.js";
import { BaseController } from "./BaseController.js";
import { responseHandler } from "../utils/responseHandler.js";
import { paginationHelper } from "../utils/pagination.js";
import { validationResult } from "express-validator";
import moment from "moment-timezone";

export default class OrderController extends BaseController {
  constructor() {
    super(Order);
  }

  async createOrder(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responseHandler.badRequest(res, { errors: errors.array() });
      }

      const timezone = req.headers["x-timezone"] || "UTC";

      // Validate order items
      if (!req.body.orderItems?.length) {
        return responseHandler.badRequest(res, {
          message: "Order must contain at least one item",
        });
      }

      // Create new order
      const newOrder = new Order({
        ...req.body,
        createdBy: req.user.id,
        status: "pending",
        createdAt: new Date(),
      });

      await newOrder.save();
      await newOrder.populate([
        { path: "orderItems.product", select: "name sku price" },
        { path: "createdBy", select: "name email" },
      ]);

      return responseHandler.success(res, newOrder, 201);
    } catch (error) {
      console.error("Error creating order:", error);
      return responseHandler.error(res, "Failed to create order");
    }
  }

  async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);

      if (!order) {
        return responseHandler.notFound(res, "Order not found");
      }

      if (order.status !== "draft") {
        return responseHandler.forbidden(
          res,
          "Only draft orders can be edited",
        );
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: new Date() },
        { new: true },
      ).populate("items.product");

      return responseHandler.success(res, updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      return responseHandler.error(res, "Failed to update order");
    }
  }

  async getOrders(req, res) {
    try {
      const { status, dateFrom, dateTo } = req.query;
      const timezone = req.headers["x-timezone"] || "UTC";
      const query = {};

      if (status) query.status = status;
      if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom)
          query.createdAt.$gte = moment.tz(dateFrom, timezone).utc().toDate();
        if (dateTo)
          query.createdAt.$lte = moment.tz(dateTo, timezone).utc().toDate();
      }

      const pagination = paginationHelper.getPaginationOptions(req.query);
      const [orders, total] = await Promise.all([
        Order.find(query)
          .sort("-createdAt")
          .populate({
            path: "user",
            select: "name email",
            strictPopulate: false,
          })
          .populate("orderItems.product", "name sku price")
          .skip(pagination.skip)
          .limit(pagination.limit)
          .lean(),
        Order.countDocuments(query),
      ]);

      return responseHandler.success(res, {
        orders,
        pagination: paginationHelper.getPaginationData(
          total,
          pagination.page,
          pagination.limit,
        ),
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return responseHandler.error(res, "Failed to fetch orders");
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.findByIdAndUpdate(
        id,
        {
          status,
          updatedAt: new Date(),
          $push: {
            statusHistory: {
              status,
              updatedBy: req.user.id,
              updatedAt: new Date(),
            },
          },
        },
        { new: true },
      ).populate("items.product");

      if (!order) {
        return responseHandler.notFound(res);
      }

      return responseHandler.success(res, order);
    } catch (error) {
      console.error("Error updating order status:", error);
      return responseHandler.error(res, "Failed to update order status");
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await Order.findById(req.params.id)
        .populate("user", "name email")
        .populate("orderItems.product", "name sku price")
        .lean();

      if (!order) {
        return responseHandler.notFound(res, "Order not found");
      }

      return responseHandler.success(res, order);
    } catch (error) {
      console.error("Error fetching order:", error);
      return responseHandler.error(res, "Failed to fetch order");
    }
  }

  async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);

      if (!order) {
        return responseHandler.notFound(res, "Order not found");
      }

      if (order.status !== "draft") {
        return responseHandler.forbidden(
          res,
          "Only draft orders can be edited",
        );
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: new Date() },
        { new: true },
      ).populate("items.product");

      return responseHandler.success(res, updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      return responseHandler.error(res, "Failed to update order");
    }
  }

  async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);

      if (!order) {
        return responseHandler.notFound(res, "Order not found");
      }

      if (order.status !== "draft") {
        return responseHandler.forbidden(
          res,
          "Only draft orders can be cancelled",
        );
      }

      // Update to use soft delete
      await Order.findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: req.user.id,
      });

      return responseHandler.success(res, {
        message: "Order deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      return responseHandler.error(res, "Failed to delete order");
    }
  }

  async cloneOrder(req, res) {
    try {
      const { id } = req.params;
      const sourceOrder = await Order.findById(id).populate(
        "orderItems.product",
        "name sku price",
      );

      if (!sourceOrder) {
        return responseHandler.notFound(res, "Source order not found");
      }

      const newOrder = new Order({
        ...sourceOrder.toObject(),
        _id: undefined,
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
        user: req.user.id,
      });

      await newOrder.save();
      return responseHandler.success(res, newOrder, 201);
    } catch (error) {
      console.error("Error cloning order:", error);
      return responseHandler.error(res, "Failed to clone order");
    }
  }

  async uploadBulkOrders(req, res) {
    try {
      if (!req.file) {
        return responseHandler.badRequest(res, "No file uploaded");
      }

      // Process Excel file and create orders
      const orders = await this._processExcelFile(req.file);
      const createdOrders = await Order.insertMany(
        orders.map((order) => ({
          ...order,
          user: req.user.id,
          status: "pending",
        })),
      );

      return responseHandler.success(res, createdOrders, 201);
    } catch (error) {
      console.error("Error processing bulk orders:", error);
      return responseHandler.error(res, "Failed to process bulk orders");
    }
  }

  // Helper method to process Excel file
  async _processExcelFile(file) {
    // Implementation for Excel processing
    // This would use a library like xlsx to process the Excel file
    // and return an array of order objects
    return [];
  }

  async getOrderSummary(req, res) {
    try {
      const { summary } = req.query;

      if (summary !== "admin") {
        return responseHandler.badRequest(res, "Invalid summary type");
      }

      const [
        totalOrders,
        pendingOrders,
        completedOrders,
        activeOrders,
        revenue,
      ] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: "pending" }),
        Order.countDocuments({ status: "completed" }),
        Order.countDocuments({ status: { $in: ["pending", "processing"] } }),
        Order.aggregate([
          { $match: { status: "completed" } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
      ]);

      return responseHandler.success(res, {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
        active: activeOrders,
        revenue: revenue[0]?.total || 0,
        orderGrowth: "0%", // Implement growth calculation if needed
      });
    } catch (error) {
      logger.error("Error fetching order summary:", error);
      return responseHandler.error(res, "Failed to fetch order summary");
    }
  }
}
