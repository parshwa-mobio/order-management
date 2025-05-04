import express from "express";
import { UserController } from "../controllers/UserController.js";
import authMiddleware from "../middleware/auth.js";
import rbac from "../middleware/rbac.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { cache } from "../utils/cache.js";

const router = express.Router();
const userController = new UserController();

router.get(
  "/me",
  [authMiddleware],
  asyncHandler(userController.getCurrentUser),
);

// Change getAllUsers to getUsers to match the controller method name
router.get(
  "/",
  [authMiddleware, rbac(["admin"]), cache(300)],
  asyncHandler(userController.getUsers),
);

// Add new roles-summary endpoint
router.get(
  "/roles-summary",
  [authMiddleware, rbac(["admin"]), cache(300)],
  asyncHandler(userController.getRolesSummary),
);

// Add soft delete endpoint
router.delete(
  "/:id",
  [authMiddleware, rbac(["admin"])],
  asyncHandler(userController.softDeleteUser),
);

// Add restore user endpoint
router.post(
  "/:id/restore",
  [authMiddleware, rbac(["admin"])],
  asyncHandler(userController.restoreUser),
);

// Add update user endpoint
router.put(
  "/:id",
  [authMiddleware, rbac(["admin"])],
  asyncHandler(userController.updateUser),
);

// Add get user by ID endpoint
router.get(
  "/:id",
  [authMiddleware, rbac(["admin"])],
  asyncHandler(userController.getUserById),
);

export default router;
