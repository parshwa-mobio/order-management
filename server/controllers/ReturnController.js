import { responseHandler } from "../utils/responseHandler.js";
import { logger } from "../utils/logger.js";
import Order from "../models/Order.js";
import ReturnRequest from "../models/ReturnRequest.js";

class ReturnController {
  async createReturn(req, res) {
    try {
      const { orderId, items, reason } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return responseHandler.notFound(res, "Order not found");
      }

      const returnRequest = new ReturnRequest({
        // Changed from Return to ReturnRequest
        orderId,
        items,
        reason,
        requestedBy: req.user.id,
        status: "pending",
      });

      await returnRequest.save();
      return responseHandler.success(res, returnRequest, 201);
    } catch (error) {
      logger.error("Failed to create return request:", error);
      return responseHandler.error(res, "Failed to create return request");
    }
  }

  async getReturns(req, res) {
    try {
      const { status, startDate, endDate } = req.query;
      const query = {};

      if (status) {
        query.status = new RegExp(`^${status}$`, "i"); // Make status case-insensitive
      }
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const returns = await ReturnRequest.find(query)
        .populate("orderId", "orderNumber totalAmount")
        .populate("requestedBy", "name email")
        .sort("-createdAt")
        .lean();

      return responseHandler.success(res, returns);
    } catch (error) {
      logger.error("Failed to fetch returns:", error);
      return responseHandler.error(res, "Failed to fetch returns");
    }
  }

  async updateReturn(req, res) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const returnRequest = await ReturnRequest.findByIdAndUpdate(
        // Changed from Return to ReturnRequest
        id,
        {
          status,
          notes,
          updatedBy: req.user.id,
          updatedAt: new Date(),
        },
        { new: true },
      ).populate("orderId requestedBy");

      if (!returnRequest) {
        return responseHandler.notFound(res, "Return request not found");
      }

      return responseHandler.success(res, returnRequest);
    } catch (error) {
      logger.error("Failed to update return request:", error);
      return responseHandler.error(res, "Failed to update return request");
    }
  }
}

export default ReturnController;
