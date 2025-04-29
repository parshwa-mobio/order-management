import { body } from "express-validator";

export const orderValidation = {
  createOrder: [
    body("orderItems").isArray().withMessage("Order items must be an array"),
    body("orderItems.*.product").isMongoId().withMessage("Invalid product ID"),
    body("orderItems.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ],

  updateOrder: [
    body("orderItems").isArray().withMessage("Order items must be an array"),
    body("orderItems.*.product").isMongoId().withMessage("Invalid product ID"),
    body("orderItems.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ],

  updateStatus: [
    body("status")
      .isIn([
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ])
      .withMessage("Invalid status"),
  ],
};
