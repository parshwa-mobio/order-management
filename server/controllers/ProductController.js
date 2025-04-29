import Product from "../models/Product.js";
import { responseHandler } from "../utils/responseHandler.js";
import { validationResult } from "express-validator";
import { logger } from "../utils/logger.js";
import { paginationHelper } from "../utils/pagination.js";

export class ProductController {
  constructor() {
    // Bind methods to ensure correct 'this' context
    this.getProducts = this.getProducts.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.getProductMoq = this.getProductMoq.bind(this);
    this.getRecommendations = this.getRecommendations.bind(this);
    this.getProductCount = this.getProductCount.bind(this);
  }

  // Helper methods
  _buildSearchQuery(filters) {
    const query = { isDeleted: false }; // Add this line to exclude deleted products
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

  // API Methods
  async getProducts(req, res) {
    try {
      const pagination = paginationHelper.getPaginationOptions(req.query);
      const query = this._buildSearchQuery(req.query);

      const [products, total] = await Promise.all([
        Product.find(query)
          .sort({ createdAt: -1 })
          .skip(pagination.skip)
          .limit(pagination.limit)
          .lean(),
        Product.countDocuments(query),
      ]);

      return responseHandler.success(res, {
        products,
        pagination: paginationHelper.getPaginationData(
          total,
          pagination.page,
          pagination.limit,
        ),
      });
    } catch (error) {
      logger.error("Failed to fetch products", error);
      return responseHandler.error(res, "Failed to fetch products");
    }
  }

  async createProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responseHandler.badRequest(res, { errors: errors.array() });
      }

      const product = new Product(req.body);
      await product.save();

      logger.info("Product created successfully", { sku: product.sku });
      return responseHandler.success(res, product, 201);
    } catch (error) {
      if (error.code === 11000) {
        return responseHandler.badRequest(res, "SKU already exists");
      }
      logger.error("Failed to create product", error);
      return responseHandler.error(res, "Failed to create product");
    }
  }

  async updateProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responseHandler.badRequest(res, { errors: errors.array() });
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true },
      );

      if (!product) {
        return responseHandler.notFound(res, "Product not found");
      }

      logger.info("Product updated successfully", { sku: product.sku });
      return responseHandler.success(res, product);
    } catch (error) {
      logger.error("Failed to update product", error);
      return responseHandler.error(res, "Failed to update product");
    }
  }

  async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          isDeleted: true,
          deletedAt: new Date(),
        },
        { new: true },
      );

      if (!product) {
        return responseHandler.notFound(res, "Product not found");
      }

      logger.info("Product soft deleted successfully", { sku: product.sku });
      return responseHandler.success(res, {
        message: "Product deleted successfully",
      });
    } catch (error) {
      logger.error("Failed to delete product", error);
      return responseHandler.error(res, "Failed to delete product");
    }
  }

  async getProductMoq(req, res) {
    try {
      const { sku } = req.params;
      const product = await Product.findOne({ sku })
        .select("sku name moq distributorMoq")
        .lean()
        .cache(60);

      if (!product) {
        return responseHandler.notFound(res, "Product not found");
      }

      return responseHandler.success(res, {
        sku: product.sku,
        name: product.name,
        defaultMoq: product.moq,
        distributorMoq: product.distributorMoq,
      });
    } catch (error) {
      logger.error("Failed to fetch product MOQ", error);
      return responseHandler.error(res, "Failed to fetch product MOQ");
    }
  }

  async getRecommendations(req, res) {
    try {
      // Get user's recent orders if authenticated
      let query = { status: "active" };

      if (req.user) {
        // Add personalization logic here based on user's order history
        // This is a simple example - you might want to implement more sophisticated recommendation logic
        query.category = req.user.preferredCategories;
      }

      const recommendations = await Product.find(query)
        .sort("-orderCount") // Assuming we track order count
        .limit(10)
        .lean()
        .cache(300);

      return responseHandler.success(res, recommendations);
    } catch (error) {
      logger.error("Failed to fetch product recommendations", error);
      return responseHandler.error(
        res,
        "Failed to fetch product recommendations",
      );
    }
  }

  async getProductCount(req, res) {
    try {
      const count = await Product.countDocuments({ status: "active" });
      return responseHandler.success(res, { count });
    } catch (error) {
      logger.error("Failed to fetch product count", error);
      return responseHandler.error(res, "Failed to fetch product count");
    }
  }
}
