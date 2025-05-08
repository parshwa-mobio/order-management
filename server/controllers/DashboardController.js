import { responseHandler } from "../utils/responseHandler.js";
import { logger } from "../utils/logger.js";
import { dashboardService } from "../services/dashboardService.js";

export class DashboardController {
  async getDashboardStats(req, res) {
    try {
      const { days = 30 } = req.query;
      const stats = await dashboardService.getDashboardStats(days);
      return responseHandler.success(res, stats);
    } catch (error) {
      logger.error("Error fetching dashboard stats:", error);
      return responseHandler.error(res, "Failed to fetch dashboard statistics");
    }
  }

  async getRevenueStats(req, res) {
    try {
      const stats = await dashboardService.getRevenueStats();
      return responseHandler.success(res, stats);
    } catch (error) {
      logger.error("Error fetching revenue stats:", error);
      return responseHandler.error(res, "Failed to fetch revenue statistics");
    }
  }

  async getTopProducts(req, res) {
    try {
      const { limit = 5, days = 30, sortBy = "quantity" } = req.query;
      const topProducts = await dashboardService.getTopProducts(limit, days, sortBy);
      return responseHandler.success(res, topProducts);
    } catch (error) {
      logger.error("Error fetching top products:", error);
      return responseHandler.error(res, "Failed to fetch top products");
    }
  }
}