import User from "../models/User.js";
import { performDbOperation, DB_OPERATIONS } from "../utils/db.utils.js";

export class SettingsService {
  async getUserSettings(userId) {
    return performDbOperation(
      User,
      DB_OPERATIONS.FIND_BY_ID,
      userId,
      null,
      { select: 'settings', lean: true }
    );
  }

  async updateUserSettings(userId, settings) {
    return performDbOperation(
      User,
      DB_OPERATIONS.FIND_BY_ID_AND_UPDATE,
      userId,
      { settings },
      { new: true, select: 'settings' }
    );
  }
}

export const settingsService = new SettingsService();