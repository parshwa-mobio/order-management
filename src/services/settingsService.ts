import { SystemSettings } from "../types/settings";
import axios from "axios";

export class SettingsError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "SettingsError";
  }
}

export const settingsService = {
  async saveSettings(settings: SystemSettings): Promise<void> {
    try {
      await axios.put("http://localhost:5000/api/settings", settings);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new SettingsError(
          error.response?.data?.message ?? "Failed to save settings",
          error.response?.data?.code,
        );
      }
      throw new SettingsError("An unexpected error occurred");
    }
  },
};
