import Category from "../models/Category.js";
import { responseHandler } from "../utils/responseHandler.js";
import { logger } from "../utils/logger.js";

export class CategoryController {
  async getCategories(req, res) {
    try {
      const categories = await Category.find({ isDeleted: false })
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .sort("name")
        .lean();

      return responseHandler.success(res, categories);
    } catch (error) {
      logger.error("Failed to fetch categories:", error);
      return responseHandler.error(res, "Failed to fetch categories");
    }
  }

  async createCategory(req, res) {
    try {
      const category = new Category({
        ...req.body,
        createdBy: req.user.id,
      });
      await category.save();

      logger.info("Category created successfully", { name: category.name });
      return responseHandler.success(res, category, 201);
    } catch (error) {
      if (error.code === 11000) {
        return responseHandler.badRequest(res, "Category already exists");
      }
      logger.error("Failed to create category", error);
      return responseHandler.error(res, "Failed to create category");
    }
  }

  async deleteCategory(req, res) {
    try {
      const category = await Category.findById(req.params.id);

      if (!category) {
        return responseHandler.notFound(res, "Category not found");
      }

      // Soft delete
      category.isDeleted = true;
      category.deletedAt = new Date();
      category.deletedBy = req.user.id;
      await category.save();

      logger.info("Category deleted successfully", { name: category.name });
      return responseHandler.success(res, {
        message: "Category deleted successfully",
      });
    } catch (error) {
      logger.error("Failed to delete category", error);
      return responseHandler.error(res, "Failed to delete category");
    }
  }

  async updateCategory(req, res) {
    try {
      const category = await Category.findById(req.params.id);

      if (!category) {
        return responseHandler.notFound(res, "Category not found");
      }

      Object.assign(category, req.body);
      category.updatedBy = req.user.id;
      category.updatedAt = new Date();

      await category.save();

      logger.info("Category updated successfully", { name: category.name });
      return responseHandler.success(res, category);
    } catch (error) {
      if (error.code === 11000) {
        return responseHandler.badRequest(res, "Category name already exists");
      }
      logger.error("Failed to update category", error);
      return responseHandler.error(res, "Failed to update category");
    }
  }
}
