import express from "express";
import { CategoryController } from "../controllers/CategoryController.js";
import auth from "../middleware/auth.js";
import rbac from "../middleware/rbac.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { categoryValidation } from "../validation/categoryValidation.js";

const router = express.Router();
const categoryController = new CategoryController();

// Get all categories
router.get("/", asyncHandler(categoryController.getCategories));

// Get category by id
router.get("/:id", asyncHandler(categoryController.getCategoryById));

// Create new category
router.post(
  "/",
  [auth, rbac(["admin"]), ...categoryValidation.create],
  asyncHandler(categoryController.createCategory),
);

// Delete category
router.delete(
  "/:id",
  [auth, rbac(["admin"])],
  asyncHandler(categoryController.deleteCategory),
);

// Update category
router.put(
  "/:id",
  [auth, rbac(["admin"]), ...categoryValidation.update],
  asyncHandler(categoryController.updateCategory)
);

export default router;
