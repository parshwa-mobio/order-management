import { responseHandler } from "../utils/responseHandler.js";
import { logger } from "../utils/logger.js";
import { categoryService } from "../services/categoryService.js";

export class CategoryController {
  async getCategories(req, res) {
    try {
      const categories = await categoryService.findCategories();
      return responseHandler.success(res, categories);
    } catch (error) {
      logger.error("Failed to fetch categories:", error);
      return responseHandler.error(res, "Failed to fetch categories");
    }
  }

  async getCategoryById(req, res) {
    try {
      const category = await categoryService.findById(req.params.id);

      if (!category) {
        return responseHandler.notFound(res, "Category not found");
      }

      return responseHandler.success(res, category);
    } catch (error) {
      logger.error("Failed to fetch category:", error);
      return responseHandler.error(res, "Failed to fetch category");
    }
  }

  async createCategory(req, res) {
    try {
      const category = await categoryService.createCategory(req.body, req.user.id);
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
      const category = await categoryService.deleteCategory(req.params.id, req.user.id);

      if (!category) {
        return responseHandler.notFound(res, "Category not found");
      }

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
      const category = await categoryService.updateCategory(req.params.id, req.body, req.user.id);

      if (!category) {
        return responseHandler.notFound(res, "Category not found");
      }

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
