import Product from "../models/Product.js";
import { performDbOperation, DB_OPERATIONS } from "../utils/db.utils.js";

export class ProductService {
  _buildSearchQuery(filters) {
    const query = { isDeleted: false };
    const { search, category, minPrice, maxPrice, status } = filters;

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { sku: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }
    if (category) query.category = category;
    if (status) query.status = status;
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    return query;
  }

  async getProducts(filters, pagination) {
    const query = this._buildSearchQuery(filters);
    return performDbOperation(
      Product,
      DB_OPERATIONS.FIND,
      query,
      null,
      {
        sort: { createdAt: -1 },
        skip: pagination.skip,
        limit: pagination.limit,
        lean: true,
        count: true
      }
    );
  }

  async createProduct(productData) {
    return performDbOperation(
      Product,
      DB_OPERATIONS.CREATE,
      productData
    );
  }

  async updateProduct(id, updateData) {
    return performDbOperation(
      Product,
      DB_OPERATIONS.FIND_BY_ID_AND_UPDATE,
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async deleteProduct(id) {
    return performDbOperation(
      Product,
      DB_OPERATIONS.FIND_BY_ID_AND_UPDATE,
      id,
      {
        isDeleted: true,
        deletedAt: new Date()
      },
      { new: true }
    );
  }

  async getProductBySkuWithMoq(sku) {
    return performDbOperation(
      Product,
      DB_OPERATIONS.FIND_ONE,
      { sku },
      null,
      {
        select: "sku name moq distributorMoq",
        lean: true,
        cache: 60
      }
    );
  }

  async getRecommendations(userId, preferredCategories) {
    const query = { status: "active" };
    if (preferredCategories) {
      query.category = preferredCategories;
    }
    return performDbOperation(
      Product,
      DB_OPERATIONS.FIND,
      query,
      null,
      {
        sort: "-orderCount",
        limit: 10,
        lean: true,
        cache: 300
      }
    );
  }

  async getActiveProductCount() {
    return performDbOperation(
      Product,
      DB_OPERATIONS.COUNT_DOCUMENTS,
      { status: "active" }
    );
  }
}

export const productService = new ProductService();