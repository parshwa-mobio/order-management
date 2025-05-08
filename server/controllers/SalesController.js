import { responseHandler } from "../utils/responseHandler.js";
import { logger } from "../utils/logger.js";
import { salesService } from "../services/salesService.js";

export class SalesController {
  async getSalesTargets(req, res) {
    try {
      const targets = await salesService.calculateSalesTargets(req.user);
      return responseHandler.success(res, targets);
    } catch (error) {
      logger.error("Failed to fetch sales targets:", error);
      return responseHandler.error(res, "Failed to fetch sales targets");
    }
  }

  async getSalesReports(req, res) {
    try {
      const { startDate, endDate, type } = req.query;
      const reports = await salesService.generateSalesReports(
        startDate,
        endDate,
        type,
        req.user,
      );
      return responseHandler.success(res, reports);
    } catch (error) {
      logger.error("Failed to generate sales reports:", error);
      return responseHandler.error(res, "Failed to generate sales reports");
    }
  }

  async getDistributor360(req, res) {
    try {
      const { id } = req.params;

      const distributor = await salesService.findDistributor(id);
      if (!distributor) {
        return responseHandler.notFound(res, "Distributor not found");
      }

      const distributorData = await salesService.getDistributor360Data(id);
      return responseHandler.success(res, distributorData);
    } catch (error) {
      logger.error("Failed to fetch distributor 360 view:", error);
      return responseHandler.error(res, "Failed to fetch distributor data");
    }
  }
}
