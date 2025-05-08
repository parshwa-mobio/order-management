import Product from "../models/Product.js";
import { responseHandler } from "../utils/responseHandler.js";
import { validationResult } from "express-validator";
import { logger } from "../utils/logger.js";
import { paginationHelper } from "../utils/pagination.js";
import { productService } from "../services/productService.js";

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

  async getProducts(req, res) {
    try {
      const pagination = paginationHelper.getPaginationOptions(req.query);
      const { products, total } = await productService.getProducts(req.query, pagination);

      return responseHandler.success(res, {
        products,
        pagination: paginationHelper.getPaginationData(
          total,
          pagination.page,
          pagination.limit
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

      const product = await productService.createProduct(req.body);
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

      const product = await productService.updateProduct(req.params.id, req.body);
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
      const product = await productService.deleteProduct(req.params.id);
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
      const product = await productService.getProductBySkuWithMoq(sku);

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
      const recommendations = await productService.getRecommendations(
        req.user?.id,
        req.user?.preferredCategories
      );

      return responseHandler.success(res, recommendations);
    } catch (error) {
      logger.error("Failed to fetch product recommendations", error);
      return responseHandler.error(res, "Failed to fetch product recommendations");
    }
  }

  async getProductCount(req, res) {
    try {
      const count = await productService.getActiveProductCount();
      return responseHandler.success(res, { count });
    } catch (error) {
      logger.error("Failed to fetch product count", error);
      return responseHandler.error(res, "Failed to fetch product count");
    }
  }
}
