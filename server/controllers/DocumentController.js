import Order from "../models/Order.js";
import { responseHandler } from "../utils/responseHandler.js";

export class DocumentController {
  async getOrderDocuments(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id)
        .populate("createdBy", "name email")  // Changed from user to createdBy
        .populate("orderItems.product", "name sku price")
        .lean();

      if (!order) {
        return responseHandler.notFound(res, "Order not found");
      }

      // Generate document list based on order status and type
      const documents = [
        {
          id: `${order._id}-invoice`,
          name: `Invoice-${order.orderNumber || order._id}`,
          url: `/api/documents/download/invoice/${order._id}`,
          type: "invoice"
        }
      ];

      // Add additional documents based on order status
      if (order.status === "shipped") {
        documents.push({
          id: `${order._id}-shipping`,
          name: `Shipping Label-${order.orderNumber || order._id}`,
          url: `/api/documents/download/shipping/${order._id}`,
          type: "shipping"
        });
      }

      return responseHandler.success(res, documents);
    } catch (error) {
      console.error("Error fetching order documents:", error);
      return responseHandler.error(res, "Failed to fetch order documents");
    }
  }
}