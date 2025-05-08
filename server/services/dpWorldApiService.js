import { createApiClient } from "../utils/apiClient.js";
import { handleApiError } from "../utils/errorHandler.js";

class DPWorldApiService {
  constructor() {
    this.client = createApiClient(
      process.env.DP_WORLD_API_URL,
      process.env.DP_WORLD_API_KEY
    );
  }

  async trackShipment(trackingNumber) {
    try {
      const { data } = await this.client.get(`/tracking/${trackingNumber}`);
      return data;
    } catch (error) {
      handleApiError(error, "track shipment");
    }
  }

  async getShipmentStatus(shipmentId) {
    try {
      const { data } = await this.client.get(`/shipments/${shipmentId}/status`);
      return data;
    } catch (error) {
      logger.error("Failed to get shipment status:", error);
      throw new Error("Failed to get shipment status");
    }
  }

  async createShipment(shipmentData) {
    try {
      const { data } = await this.client.post("/shipments", shipmentData);
      return data;
    } catch (error) {
      logger.error("Failed to create shipment:", error);
      throw new Error("Failed to create shipment");
    }
  }
}

export const dpWorldApiService = new DPWorldApiService();