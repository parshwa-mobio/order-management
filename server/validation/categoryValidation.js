import { body } from "express-validator";

export const categoryValidation = {
  create: [
    body("name").notEmpty().trim().withMessage("Category name is required"),
    body("description").optional().trim(),
    body("imageUrl").optional().isURL().withMessage("Invalid image URL"),
  ],

  update: [
    body("name").optional().trim(),
    body("description").optional().trim(),
    body("imageUrl").optional().isURL().withMessage("Invalid image URL"),
  ],
};
