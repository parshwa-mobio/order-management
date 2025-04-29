import { responseHandler } from "../utils/responseHandler.js";
import { logger } from "../utils/logger.js";
import Order from "../models/Order.js";
import { dpWorldService } from "../services/dpWorldService.js";
import { shipmentService } from "../services/shipmentService.js";

export class ShipmentController {
  async getTracking(req, res) {
    try {
      const { orderId } = req.params;

      const order = await Order.findById(orderId)
        .select("trackingNumber carrier status shipmentDetails")
        .lean();

      if (!order) {
        return responseHandler.notFound(res, "Order not found");
      }

      const trackingNumber =
        order.shipmentDetails?.trackingNumber || order.trackingNumber;
      const trackingInfo = await dpWorldService.getTrackingInfo(trackingNumber);

      // Update order status if needed
      if (trackingInfo.status && trackingInfo.status !== order.status) {
        await Order.findByIdAndUpdate(orderId, {
          status: trackingInfo.status,
          "shipmentDetails.lastUpdate": new Date(),
        });
      }

      return responseHandler.success(res, {
        orderId,
        trackingNumber,
        carrier: order.shipmentDetails?.carrier || order.carrier,
        status: trackingInfo.status || order.status,
        tracking: trackingInfo,
      });
    } catch (error) {
      logger.error("Failed to fetch tracking info:", error);
      return responseHandler.error(res, "Failed to fetch tracking information");
    }
  }

  async getShipmentStatus(req, res) {
    try {
      const { orderId } = req.params;

      const order = await Order.findById(orderId)
        .select("shipmentDetails status")
        .lean();

      if (!order) {
        return responseHandler.notFound(res, "Order not found");
      }

      if (!order.shipmentDetails?.trackingNumber) {
        return responseHandler.badRequest(
          res,
          "No shipment created for this order",
        );
      }

      const shipmentStatus = await shipmentService.getShipmentStatus(
        order.shipmentDetails.trackingNumber,
      );

      // Update order status if needed
      if (shipmentStatus.status !== order.status) {
        await Order.findByIdAndUpdate(orderId, {
          status: shipmentStatus.status,
          "shipmentDetails.lastUpdate": new Date(),
        });
      }

      return responseHandler.success(res, shipmentStatus);
    } catch (error) {
      logger.error("Failed to fetch shipment status", error);
      return responseHandler.error(res, "Failed to fetch shipment status");
    }
  }

  async createShipment(req, res) {
    try {
      const { orderId } = req.params;
      const { carrier, service, address } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return responseHandler.notFound(res, "Order not found");
      }

      if (order.shipmentDetails?.trackingNumber) {
        return responseHandler.badRequest(
          res,
          "Shipment already exists for this order",
        );
      }

      const shipment = await shipmentService.createShipment({
        orderId,
        carrier,
        service,
        address,
        items: order.items,
      });

      await Order.findByIdAndUpdate(orderId, {
        shipmentDetails: {
          trackingNumber: shipment.trackingNumber,
          carrier,
          service,
          createdAt: new Date(),
          lastUpdate: new Date(),
        },
        status: "shipped",
      });

      return responseHandler.success(res, shipment);
    } catch (error) {
      logger.error("Failed to create shipment", error);
      return responseHandler.error(res, "Failed to create shipment");
    }
  }
}
