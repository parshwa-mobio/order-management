import express from "express";
import ReturnController from "../controllers/ReturnController.js";
import authMiddleware from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { cache } from "../utils/cache.js";
import { returnValidation } from "../validation/returnValidation.js";

const router = express.Router();
const returnController = new ReturnController();

router.post(
  "/",
  [authMiddleware, ...returnValidation.createReturn],
  asyncHandler(returnController.createReturn),
);

router.get(
  "/",
  [authMiddleware, cache(300)],
  asyncHandler(returnController.getReturns),
);

router.put(
  "/:id",
  [authMiddleware, ...returnValidation.updateReturn],
  asyncHandler(returnController.updateReturn),
);

export default router;
