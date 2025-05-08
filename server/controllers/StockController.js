import { responseHandler } from "../utils/responseHandler.js";
import { logger } from "../utils/logger.js";
import { stockService } from "../services/stockService.js";

export class StockController {
  async getLowStock(req, res) {
    try {
      const { role } = req.query;

      if (role !== "admin") {
        return responseHandler.forbidden(res, "Unauthorized access");
      }

      const lowStockProducts = await stockService.getLowStockProducts();
      return responseHandler.success(res, lowStockProducts);
    } catch (error) {
      logger.error("Failed to fetch low stock products:", error);
      return responseHandler.error(res, "Failed to fetch low stock products");
    }
  }
}
