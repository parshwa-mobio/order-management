import { body } from "express-validator";

export const notificationValidation = {
  create: [
    body("type")
      .isIn(["order", "system", "alert"])
      .withMessage("Invalid notification type"),
    body("message").notEmpty().withMessage("Message is required").trim(),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority level"),
    body("recipients")
      .optional()
      .isArray()
      .withMessage("Recipients must be an array"),
    body("recipients.*")
      .optional()
      .isMongoId()
      .withMessage("Invalid recipient ID"),
  ],

  update: [
    body("read")
      .optional()
      .isBoolean()
      .withMessage("Read status must be boolean"),
  ],
};
