import axios from "axios";
import { logger } from "../utils/logger.js";
import Order from "../models/Order.js";
import { DB_OPERATIONS, performDbOperation } from "../utils/db.utils.js";

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

  // API Operations
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

  async createShipmentAPI({ orderId, carrier, service, address, items }) {
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

  // Database Operations
  async findShipmentByOrderId(orderId) {
    return performDbOperation(
      Order,
      DB_OPERATIONS.FIND_BY_ID,
      orderId,
      {},
      { select: "shipmentDetails status trackingNumber carrier", lean: true }
    );
  }

  async updateShipmentStatus(orderId, status) {
    return performDbOperation(
      Order,
      DB_OPERATIONS.FIND_BY_ID_AND_UPDATE,
      orderId,
      { status, "shipmentDetails.lastUpdate": new Date() },
      { new: true }
    );
  }

  async createShipment(orderId, shipmentData) {
    return performDbOperation(
      Order,
      DB_OPERATIONS.FIND_BY_ID_AND_UPDATE,
      orderId,
      {
        shipmentDetails: {
          ...shipmentData,
          createdAt: new Date(),
          lastUpdate: new Date()
        },
        status: "shipped"
      },
      { new: true }
    );
  }
}

export const shipmentService = new ShipmentService();
