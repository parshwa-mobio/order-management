import express from "express";
import { DocumentController } from "../controllers/DocumentController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();
const documentController = new DocumentController();

router.get(
  "/order/:id",
  [authMiddleware],
  asyncHandler(documentController.getOrderDocuments)
);

export default router;