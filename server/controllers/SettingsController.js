import { responseHandler } from "../utils/responseHandler.js";
import { logger } from "../utils/logger.js";
import User from "../models/User.js";

export class SettingsController {
  async getSettings(req, res) {
    try {
      const user = await User.findById(req.user.id)
        .select('settings')
        .lean();

      if (!user) {
        return responseHandler.notFound(res, 'User not found');
      }

      return responseHandler.success(res, user.settings || {});
    } catch (error) {
      logger.error('Failed to fetch settings:', error);
      return responseHandler.error(res, 'Failed to fetch settings');
    }
  }

  async updateSettings(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: { settings: req.body } },
        { new: true }
      ).select('settings');

      if (!user) {
        return responseHandler.notFound(res, 'User not found');
      }

      return responseHandler.success(res, user.settings);
    } catch (error) {
      logger.error('Failed to update settings:', error);
      return responseHandler.error(res, 'Failed to update settings');
    }
  }
}