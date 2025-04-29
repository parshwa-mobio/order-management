import axios from "axios";
import { logger } from "../utils/logger.js";

class ERPService {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.ERP_API_URL || "https://mock-erp-api.local",
      headers: {
        Authorization: `Bearer ${process.env.ERP_API_KEY || ""}`,
        "Content-Type": "application/json",
      },
    });
  }

  async getOrderStatuses(orderIds) {
    // Replace with real ERP API call
    try {
      // Example: GET /orders/status?ids=1,2,3
      const { data } = await this.client.get("/orders/status", {
        params: { ids: orderIds.join(",") },
      });
      return data;
    } catch (error) {
      logger.error("ERP getOrderStatuses error", error);
      throw new Error("Failed to fetch order statuses from ERP");
    }
  }

  async getContract(id) {
    // Replace with real ERP API call
    try {
      const { data } = await this.client.get(`/contract/${id}`);
      return data;
    } catch (error) {
      logger.error("ERP getContract error", error);
      throw new Error("Failed to fetch contract from ERP");
    }
  }

  async getProducts() {
    try {
      const { data } = await this.client.get("/products");
      return data;
    } catch (error) {
      logger.error("ERP getProducts error", error);
      throw new Error("Failed to fetch products from ERP");
    }
  }

  async getOrderStatus(orderId) {
    try {
      const { data } = await this.client.get(`/order/${orderId}/status`);
      return data;
    } catch (error) {
      logger.error("ERP getOrderStatus error", error);
      throw new Error("Failed to fetch order status from ERP");
    }
  }
}

export const erpService = new ERPService();
