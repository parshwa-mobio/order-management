import { responseHandler } from "../utils/responseHandler.js";
import { logger } from "../utils/logger.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export class SalesController {
  async getSalesTargets(req, res) {
    try {
      // Get sales targets based on user role and permissions
      const targets = await this._calculateSalesTargets(req.user);
      return responseHandler.success(res, targets);
    } catch (error) {
      logger.error("Failed to fetch sales targets:", error);
      return responseHandler.error(res, "Failed to fetch sales targets");
    }
  }

  async getSalesReports(req, res) {
    try {
      const { startDate, endDate, type } = req.query;
      const reports = await this._generateSalesReports(
        startDate,
        endDate,
        type,
        req.user,
      );
      return responseHandler.success(res, reports);
    } catch (error) {
      logger.error("Failed to generate sales reports:", error);
      return responseHandler.error(res, "Failed to generate sales reports");
    }
  }

  async getDistributor360(req, res) {
    try {
      const { id } = req.params;

      // Check if distributor exists
      const distributor = await User.findOne({
        _id: id,
        role: "distributor",
      });

      if (!distributor) {
        return responseHandler.notFound(res, "Distributor not found");
      }

      // Get comprehensive distributor data
      const distributorData = await this._getDistributor360Data(id);
      return responseHandler.success(res, distributorData);
    } catch (error) {
      logger.error("Failed to fetch distributor 360 view:", error);
      return responseHandler.error(res, "Failed to fetch distributor data");
    }
  }

  // Private helper methods
  async _calculateSalesTargets(user) {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    return {
      monthly: {
        target: 100000,
        achieved: await this._getAchievedSales(
          firstDayOfMonth,
          lastDayOfMonth,
          user,
        ),
        progress: 0, // Calculate based on achieved/target
      },
      quarterly: {
        target: 300000,
        achieved: 0,
        progress: 0,
      },
      yearly: {
        target: 1200000,
        achieved: 0,
        progress: 0,
      },
    };
  }

  async _generateSalesReports(startDate, endDate, type, user) {
    const query = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
      status: "completed",
    };

    const orders = await Order.find(query)
      .populate("user", "name email")
      .lean();

    return {
      summary: {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        averageOrderValue: orders.length
          ? orders.reduce((sum, order) => sum + order.totalAmount, 0) /
            orders.length
          : 0,
      },
      trends: {
        daily: [], // Calculate daily trends
        weekly: [], // Calculate weekly trends
        monthly: [], // Calculate monthly trends
      },
      topProducts: [], // Calculate top selling products
      topDistributors: [], // Calculate top performing distributors
    };
  }

  async _getDistributor360Data(distributorId) {
    const [orders, returns, claims] = await Promise.all([
      Order.find({ distributorId }).sort("-createdAt").limit(10),
      // Add returns model query
      // Add claims model query
    ]);

    return {
      overview: {
        totalOrders: await Order.countDocuments({ distributorId }),
        totalRevenue: await this._calculateTotalRevenue(distributorId),
        activeContracts: 0, // Query from contracts model
        pendingClaims: 0, // Query from claims model
      },
      recentActivity: {
        orders: orders,
        returns: returns || [],
        claims: claims || [],
      },
      performance: {
        orderFulfillmentRate: 0, // Calculate from orders
        returnRate: 0, // Calculate from returns
        claimResolutionRate: 0, // Calculate from claims
      },
      financials: {
        currentBalance: 0,
        pendingPayments: 0,
        creditLimit: 0,
      },
    };
  }

  async _getAchievedSales(startDate, endDate, user) {
    const query = {
      createdAt: { $gte: startDate, $lte: endDate },
      status: "completed",
    };

    if (user.role === "sales") {
      query.salesRepId = user.id;
    }

    const orders = await Order.find(query);
    return orders.reduce((total, order) => total + order.totalAmount, 0);
  }

  async _calculateTotalRevenue(distributorId) {
    const orders = await Order.find({
      distributorId,
      status: "completed",
    });
    return orders.reduce((total, order) => total + order.totalAmount, 0);
  }
}
