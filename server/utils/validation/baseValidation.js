import { body, param, query } from "express-validator";

export const baseValidation = {
  paginationRules: [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ],

  idParam: param("id").isMongoId().withMessage("Invalid ID format"),

  emailField: body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email format"),

  passwordRules: [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      .withMessage("Password must contain at least one letter and one number"),
  ],
};
