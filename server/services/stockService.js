import Product from "../models/Product.js";
import { DB_OPERATIONS, performDbOperation } from "../utils/db.utils.js";

export class StockService {
  async getLowStockProducts() {
    return performDbOperation(
      Product,
      DB_OPERATIONS.FIND,
      {
        stockLevel: { $lte: "$reorderPoint" },
        status: "active",
      },
      {},
      {
        select: "name sku stockLevel reorderPoint category",
        sort: { stockLevel: 1 },
        lean: true,
      }
    );
  }
}

export const stockService = new StockService();