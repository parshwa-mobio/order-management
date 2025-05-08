import { responseHandler } from "../utils/responseHandler.js";
import { logger } from "../utils/logger.js";
import { returnService } from "../services/returnService.js";

class ReturnController {
  async createReturn(req, res) {
    try {
      const { orderId, items, reason } = req.body;
      const returnRequest = await returnService.createReturn({
        orderId,
        items,
        reason,
        requestedBy: req.user.id
      });
      
      return responseHandler.success(res, returnRequest, 201);
    } catch (error) {
      logger.error("Failed to create return request:", error);
      if (error.message === "Order not found") {
        return responseHandler.notFound(res, "Order not found");
      }
      return responseHandler.error(res, "Failed to create return request");
    }
  }

  async getReturns(req, res) {
    try {
      const { status, startDate, endDate } = req.query;
      const returns = await returnService.findReturns({ status, startDate, endDate });
      
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
      
      const returnRequest = await returnService.updateReturn(id, {
        status,
        notes,
        updatedBy: req.user.id
      });

      return responseHandler.success(res, returnRequest);
    } catch (error) {
      logger.error("Failed to update return request:", error);
      if (error.message === "Return request not found") {
        return responseHandler.notFound(res, "Return request not found");
      }
      return responseHandler.error(res, "Failed to update return request");
    }
  }
}

export default ReturnController;
