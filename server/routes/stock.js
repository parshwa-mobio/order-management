import express from "express";
import { StockController } from "../controllers/StockController.js";
import authMiddleware from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();
const stockController = new StockController();

router.get("/low", authMiddleware, asyncHandler(stockController.getLowStock));

export default router;
