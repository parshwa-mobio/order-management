import { responseHandler } from "../utils/responseHandler.js";
import { logger } from "../utils/logger.js";
import { erpService } from "../services/erpService.js";
import { cache } from "../utils/cache.js";

export class ERPController {
  async getOrderStatus(req, res) {
    try {
      const { orderIds } = req.query;

      if (!orderIds) {
        return responseHandler.badRequest(res, "Order IDs are required");
      }

      const orderStatuses = await erpService.getOrderStatuses(
        orderIds.split(","),
      );
      return responseHandler.success(res, orderStatuses);
    } catch (error) {
      logger.error("Failed to fetch order statuses", error);
      return responseHandler.error(res, "Failed to fetch order statuses");
    }
  }

  async getContractDetails(req, res) {
    try {
      const { id } = req.params;
      const cachedContract = await cache.get(`contract:${id}`);

      if (cachedContract) {
        return responseHandler.success(res, cachedContract);
      }

      const contract = await erpService.getContract(id);
      await cache.set(`contract:${id}`, contract, 3600); // Cache for 1 hour

      return responseHandler.success(res, contract);
    } catch (error) {
      logger.error("Failed to fetch contract details", error);
      return responseHandler.error(res, "Failed to fetch contract details");
    }
  }

  async getProducts(req, res) {
    try {
      const cachedProducts = await cache.get("erp:products");

      if (cachedProducts) {
        return responseHandler.success(res, cachedProducts);
      }

      const products = await erpService.getProducts();
      await cache.set("erp:products", products, 3600); // Cache for 1 hour

      return responseHandler.success(res, products);
    } catch (error) {
      logger.error("Failed to fetch ERP products", error);
      return responseHandler.error(res, "Failed to fetch ERP products");
    }
  }

  async getOrderStatus(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return responseHandler.badRequest(res, "Order ID is required");
      }

      const status = await erpService.getOrderStatus(id);
      return responseHandler.success(res, status);
    } catch (error) {
      logger.error("Failed to fetch order status from ERP", error);
      return responseHandler.error(res, "Failed to fetch order status");
    }
  }
}
