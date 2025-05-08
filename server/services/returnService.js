import ReturnRequest from "../models/ReturnRequest.js";
import Order from "../models/Order.js";
import { performDbOperation, DB_OPERATIONS } from "../utils/db.utils.js";
import { logger } from "../utils/logger.js";

export class ReturnService {
  async createReturn(returnData) {
    const order = await performDbOperation(
      Order,
      DB_OPERATIONS.FIND_BY_ID,
      returnData.orderId
    );

    if (!order) {
      throw new Error("Order not found");
    }

    const returnRequest = await performDbOperation(
      ReturnRequest,
      DB_OPERATIONS.CREATE,
      {
        orderId: returnData.orderId,
        items: returnData.items,
        reason: returnData.reason,
        requestedBy: returnData.requestedBy,
        status: "pending",
      }
    );

    logger.info(`Return request created for order ${returnData.orderId}`);
    return returnRequest;
  }

  async findReturns(query = {}) {
    const searchQuery = this._buildSearchQuery(query);
    
    return performDbOperation(
      ReturnRequest,
      DB_OPERATIONS.FIND,
      searchQuery,
      null,
      {
        populate: [
          { path: "orderId", select: "orderNumber totalAmount" },
          { path: "requestedBy", select: "name email" }
        ],
        sort: "-createdAt",
        lean: true
      }
    );
  }

  async updateReturn(id, updates) {
    const returnRequest = await performDbOperation(
      ReturnRequest,
      DB_OPERATIONS.FIND_BY_ID_AND_UPDATE,
      id,
      {
        ...updates,
        updatedAt: new Date(),
      },
      {
        new: true,
        populate: "orderId requestedBy"
      }
    );

    if (!returnRequest) {
      throw new Error("Return request not found");
    }

    logger.info(`Return request ${id} updated with status: ${updates.status}`);
    return returnRequest;
  }

  _buildSearchQuery(query) {
    const searchQuery = {};
    
    if (query.status) {
      searchQuery.status = new RegExp(`^${query.status}$`, "i");
    }
    if (query.startDate || query.endDate) {
      searchQuery.createdAt = {};
      if (query.startDate) searchQuery.createdAt.$gte = new Date(query.startDate);
      if (query.endDate) searchQuery.createdAt.$lte = new Date(query.endDate);
    }

    return searchQuery;
  }
}

export const returnService = new ReturnService();