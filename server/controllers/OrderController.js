
import { responseHandler } from "../utils/responseHandler.js";
import { paginationHelper } from "../utils/pagination.js";
import { validationResult } from "express-validator";
import { orderService } from "../services/orderService.js";
import { logger } from "../utils/logger.js";

export class OrderController {
  constructor() {
    // Bind all methods to maintain 'this' context
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }
  // Base CRUD operations
  async getAll(req, res) {
    try {
      const pagination = paginationHelper.getPaginationOptions(req.query);
      const filters = {
        orderNumber: req.query.orderNumber,
        dateFrom: req.query.from,
        dateTo: req.query.to,
        status: req.query.status
      };
      const { orders, total } = await orderService.getOrders(filters, pagination);

      return responseHandler.success(res, {
        orders,
        pagination: paginationHelper.getPaginationData(
          total,
          pagination.page,
          pagination.limit
        ),
      });
    } catch (error) {
      logger.error("Error fetching orders:", error);
      return responseHandler.error(res, "Failed to fetch orders");
    }
  }

  async getById(req, res) {
    try {
      const order = await orderService.getOrderById(req.params.id);

      if (!order) {
        return responseHandler.notFound(res, "Order not found");
      }

      return responseHandler.success(res, order);
    } catch (error) {
      logger.error("Error fetching order:", error);
      return responseHandler.error(res, "Failed to fetch order");
    }
  }

  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responseHandler.badRequest(res, { errors: errors.array() });
      }

      if (!req.body.orderItems?.length) {
        return responseHandler.badRequest(res, {
          message: "Order must contain at least one item",
        });
      }

      const order = await orderService.createOrder(req.body, req.user.id);
      return responseHandler.success(res, order, 201);
    } catch (error) {
      logger.error("Error creating order:", error);
      return responseHandler.error(res, "Failed to create order");
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const order = await orderService.findOrderById(id);

      if (!order) {
        return responseHandler.notFound(res, "Order not found");
      }

      if (order.status !== "draft") {
        return responseHandler.forbidden(res, "Only draft orders can be edited");
      }

      const updatedOrder = await orderService.updateOrder(id, req.body);
      return responseHandler.success(res, updatedOrder);
    } catch (error) {
      logger.error("Error updating order:", error);
      return responseHandler.error(res, "Failed to update order");
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const order = await orderService.findOrderById(id);

      if (!order) {
        return responseHandler.notFound(res, "Order not found");
      }

      if (order.status !== "draft") {
        return responseHandler.forbidden(res, "Only draft orders can be cancelled");
      }

      await orderService.softDeleteOrder(id, req.user.id);
      return responseHandler.success(res, {
        message: "Order deleted successfully",
      });
    } catch (error) {
      logger.error("Error deleting order:", error);
      return responseHandler.error(res, "Failed to delete order");
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await orderService.updateOrderStatus(id, status, req.user.id);

      if (!order) {
        return responseHandler.notFound(res);
      }

      return responseHandler.success(res, order);
    } catch (error) {
      logger.error("Error updating order status:", error);
      return responseHandler.error(res, "Failed to update order status");
    }
  }

  async cloneOrder(req, res) {
    try {
      const { id } = req.params;
      const newOrder = await orderService.cloneOrder(id, req.user.id);

      if (!newOrder) {
        return responseHandler.notFound(res, "Source order not found");
      }

      return responseHandler.success(res, newOrder, 201);
    } catch (error) {
      logger.error("Error cloning order:", error);
      return responseHandler.error(res, "Failed to clone order");
    }
  }

  async uploadBulkOrders(req, res) {
    try {
      if (!req.file) {
        return responseHandler.badRequest(res, "No file uploaded");
      }

      const orders = await this._processExcelFile(req.file);
      const createdOrders = await orderService.createBulkOrders(orders, req.user.id);

      return responseHandler.success(res, createdOrders, 201);
    } catch (error) {
      logger.error("Error processing bulk orders:", error);
      return responseHandler.error(res, "Failed to process bulk orders");
    }
  }

  async getOrderSummary(req, res) {
    try {
      const { summary } = req.query;

      if (summary !== "admin") {
        return responseHandler.badRequest(res, "Invalid summary type");
      }

      const summaryData = await orderService.getOrderSummary();
      return responseHandler.success(res, summaryData);
    } catch (error) {
      logger.error("Error fetching order summary:", error);
      return responseHandler.error(res, "Failed to fetch order summary");
    }
  }

  // Private helper methods
  async _processExcelFile(file) {
    return [];
  }
}

export default OrderController;
