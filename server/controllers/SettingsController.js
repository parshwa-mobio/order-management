import { responseHandler } from "../utils/responseHandler.js";
import { logger } from "../utils/logger.js";
import { settingsService } from "../services/settingsService.js";

export class SettingsController {
  async getSettings(req, res) {
    try {
      const user = await settingsService.getUserSettings(req.user.id);

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
      const user = await settingsService.updateUserSettings(req.user.id, req.body);

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