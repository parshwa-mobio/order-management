import { body } from "express-validator";

export const returnValidation = {
  createReturn: [
    body("orderId").isMongoId().withMessage("Invalid order ID"),
    body("items").isArray().withMessage("Items must be an array"),
    body("items.*.product").isMongoId().withMessage("Invalid product ID"),
    body("items.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
    body("reason").notEmpty().trim().withMessage("Reason is required"),
  ],

  updateReturn: [
    body("status")
      .isIn(["pending", "approved", "rejected", "completed"])
      .withMessage("Invalid status"),
    body("notes").optional().trim(),
  ],
};
