import { body } from "express-validator";

export const authValidation = {
  login: [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],

  register: [
    body("name").notEmpty().trim().withMessage("Name is required"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      .withMessage("Password must contain at least one letter and one number"),
    body("role")
      .isIn(["distributor", "dealer", "sales", "exportTeam", "admin"])
      .withMessage("Invalid role"),
  ],

  mfa: [
    body("email").isEmail().normalizeEmail(),
    body("code").isLength({ min: 6, max: 6 }).isNumeric(),
  ],
};
