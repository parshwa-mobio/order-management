import express from "express";
import { ProductController } from "../controllers/ProductController.js";
import authMiddleware from "../middleware/auth.js";
import rbac from "../middleware/rbac.js";
import { body, param, query } from "express-validator";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();
const productController = new ProductController();

// Validation middleware
const createProductValidation = [
  body("sku").notEmpty().trim().withMessage("SKU is required"),
  body("name").notEmpty().trim().withMessage("Name is required"),
  body("basePrice")
    .isFloat({ min: 0 })
    .withMessage("Valid base price is required"),
  body("category").notEmpty().trim().withMessage("Category is required"),
  body("moq").isInt({ min: 1 }).withMessage("Valid MOQ is required"),
];

const updateProductValidation = [
  body("sku").optional().trim(),
  body("name").optional().trim(),
  body("basePrice").optional().isFloat({ min: 0 }),
  body("category").optional().trim(),
  body("moq").optional().isInt({ min: 1 }),
];

// Routes
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("search").optional().trim(),
    query("category").optional().trim(),
    query("minPrice").optional().isFloat({ min: 0 }),
    query("maxPrice").optional().isFloat({ min: 0 }),
  ],
  asyncHandler(productController.getProducts),
);

router.post(
  "/",
  [authMiddleware, rbac(["admin"]), ...createProductValidation],
  asyncHandler(productController.createProduct),
);

router.put(
  "/:id",
  [
    authMiddleware,
    rbac(["admin"]),
    param("id").isMongoId(),
    ...updateProductValidation,
  ],
  asyncHandler(productController.updateProduct),
);

router.delete(
  "/:id",
  [authMiddleware, rbac(["admin"]), param("id").isMongoId()],
  asyncHandler(productController.deleteProduct),
);

router.get(
  "/moq/:sku",
  [param("sku").notEmpty().trim()],
  asyncHandler(productController.getProductMoq),
);

router.get(
  "/recommendations",
  asyncHandler(productController.getRecommendations),
);
router.get(
  "/count",
  authMiddleware,
  asyncHandler(productController.getProductCount),
);

export default router;
