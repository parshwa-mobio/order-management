import Order from "../models/Order.js";
import { DB_OPERATIONS, performDbOperation } from "../utils/db.utils.js";

export class DocumentService {
  async getOrderDocuments(orderId) {
    const order = await performDbOperation(
      Order,
      DB_OPERATIONS.FIND_BY_ID,
      orderId,
      null,
      {
        populate: [
          { path: "createdBy", select: "name email" },
          { path: "orderItems.product", select: "name sku price" }
        ],
        lean: true
      }
    );

    if (!order) return null;

    const documents = [
      {
        id: `${order._id}-invoice`,
        name: `Invoice-${order.orderNumber || order._id}`,
        url: `/api/documents/download/invoice/${order._id}`,
        type: "invoice"
      }
    ];

    if (order.status === "shipped") {
      documents.push({
        id: `${order._id}-shipping`,
        name: `Shipping Label-${order.orderNumber || order._id}`,
        url: `/api/documents/download/shipping/${order._id}`,
        type: "shipping"
      });
    }

    return documents;
  }
}

export const documentService = new DocumentService();