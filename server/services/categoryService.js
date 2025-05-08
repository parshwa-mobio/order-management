import Category from "../models/Category.js";
import { DB_OPERATIONS, performDbOperation } from "../utils/db.utils.js";

export class CategoryService {
  async findCategories() {
    return performDbOperation(
      Category,
      DB_OPERATIONS.FIND,
      { isDeleted: false },
      null,
      {
        populate: [
          { path: "createdBy", select: "name email" },
          { path: "updatedBy", select: "name email" }
        ],
        sort: { name: 1 },
        lean: true
      }
    );
  }

  async findById(id) {
    return performDbOperation(
      Category,
      DB_OPERATIONS.FIND_ONE,
      { _id: id, isDeleted: false },
      null,
      {
        populate: [
          { path: "createdBy", select: "name email" },
          { path: "updatedBy", select: "name email" }
        ],
        lean: true
      }
    );
  }

  async createCategory(categoryData, userId) {
    return performDbOperation(
      Category,
      DB_OPERATIONS.CREATE,
      { ...categoryData, createdBy: userId }
    );
  }

  async deleteCategory(id, userId) {
    return performDbOperation(
      Category,
      DB_OPERATIONS.FIND_BY_ID_AND_UPDATE,
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId
      },
      { new: true }
    );
  }

  async updateCategory(id, categoryData, userId) {
    return performDbOperation(
      Category,
      DB_OPERATIONS.FIND_BY_ID_AND_UPDATE,
      id,
      {
        ...categoryData,
        updatedBy: userId,
        updatedAt: new Date()
      },
      { new: true }
    );
  }
}

export const categoryService = new CategoryService();