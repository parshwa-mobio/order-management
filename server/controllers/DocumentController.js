import { responseHandler } from "../utils/responseHandler.js";
import { documentService } from "../services/documentService.js";
import { logger } from "../utils/logger.js";

export class DocumentController {
  async getOrderDocuments(req, res) {
    try {
      const documents = await documentService.getOrderDocuments(req.params.id);

      if (!documents) {
        return responseHandler.notFound(res, "Order not found");
      }

      return responseHandler.success(res, documents);
    } catch (error) {
      logger.error("Error fetching order documents:", error);
      return responseHandler.error(res, "Failed to fetch order documents");
    }
  }
}