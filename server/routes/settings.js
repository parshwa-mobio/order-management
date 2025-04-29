import express from 'express';
import { SettingsController } from '../controllers/SettingsController.js';
import authMiddleware from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { settingsValidation } from '../validation/settingsValidation.js';

const router = express.Router();
const settingsController = new SettingsController();

router.get('/', authMiddleware, asyncHandler(settingsController.getSettings));
router.put('/', [authMiddleware, settingsValidation.updateSettings], asyncHandler(settingsController.updateSettings));

export default router;