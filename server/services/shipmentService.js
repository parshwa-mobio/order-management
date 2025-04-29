import axios from "axios";
import { logger } from "../utils/logger.js";

class ShipmentService {
  constructor() {
    this.client = axios.create({
      baseURL:
        process.env.SHIPMENT_API_URL || "https://mock-shipment-api.local",
      headers: {
        Authorization: `Bearer ${process.env.SHIPMENT_API_KEY || ""}`,
        "Content-Type": "application/json",
      },
    });
  }

  async getShipmentStatus(trackingNumber) {
    try {
      // Example: GET /shipment/status/:trackingNumber
      const { data } = await this.client.get(
        `/shipment/status/${trackingNumber}`,
      );
      return data;
    } catch (error) {
      logger.error("Shipment getShipmentStatus error", error);
      throw new Error("Failed to fetch shipment status");
    }
  }

  async createShipment({ orderId, carrier, service, address, items }) {
    try {
      // Example: POST /shipment/create
      const { data } = await this.client.post("/shipment/create", {
        orderId,
        carrier,
        service,
        address,
        items,
      });
      return data;
    } catch (error) {
      logger.error("Shipment createShipment error", error);
      throw new Error("Failed to create shipment");
    }
  }
}

export const shipmentService = new ShipmentService();
