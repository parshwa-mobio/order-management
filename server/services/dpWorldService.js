import axios from "axios";
import { logger } from "../utils/logger.js";

class DPWorldService {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.DP_WORLD_API_URL || "https://api.dpworld.com",
      headers: {
        Authorization: `Bearer ${process.env.DP_WORLD_API_KEY || ""}`,
        "Content-Type": "application/json",
      },
    });
  }

  async getTrackingInfo(trackingNumber) {
    try {
      const { data } = await this.client.get(`/tracking/${trackingNumber}`);
      return {
        status: data.status,
        ...data,
      };
    } catch (error) {
      logger.error("DPWorld getTrackingInfo error:", error);
      throw new Error("Failed to fetch tracking information");
    }
  }
}

export const dpWorldService = new DPWorldService();
