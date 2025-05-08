import Order from "../models/Order.js";
import User from "../models/User.js";
import { performDbOperation, DB_OPERATIONS } from "../utils/db.utils.js";

export class SalesService {
  async calculateSalesTargets(user) {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const achieved = await this.getAchievedSales(firstDayOfMonth, lastDayOfMonth, user);
    
    return {
      monthly: {
        target: 100000,
        achieved,
        progress: (achieved / 100000) * 100,
      },
      quarterly: {
        target: 300000,
        achieved: await this.getQuarterlyAchievedSales(user),
        progress: 0,
      },
      yearly: {
        target: 1200000,
        achieved: await this.getYearlyAchievedSales(user),
        progress: 0,
      },
    };
  }

  async generateSalesReports(startDate, endDate, type, user) {
    const query = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
      status: "completed",
    };

    const orders = await performDbOperation(
      Order,
      DB_OPERATIONS.FIND,
      query
    );

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      summary: {
        totalOrders: orders.length,
        totalRevenue,
        averageOrderValue: orders.length ? totalRevenue / orders.length : 0,
      },
      trends: await this.calculateTrends(startDate, endDate),
      topProducts: await this.getTopProducts(startDate, endDate),
      topDistributors: await this.getTopDistributors(startDate, endDate),
    };
  }

  async findDistributor(id) {
    return User.findOne({
      _id: id,
      role: "distributor",
    });
  }

  async getDistributor360Data(distributorId) {
    const [orders, returns, claims] = await Promise.all([
      Order.find({ distributorId }).sort("-createdAt").limit(10),
      // Add returns model query
      // Add claims model query
    ]);

    return {
      overview: {
        totalOrders: await Order.countDocuments({ distributorId }),
        totalRevenue: await this.calculateTotalRevenue(distributorId),
        activeContracts: 0,
        pendingClaims: 0,
      },
      recentActivity: {
        orders: orders,
        returns: returns || [],
        claims: claims || [],
      },
      performance: {
        orderFulfillmentRate: 0,
        returnRate: 0,
        claimResolutionRate: 0,
      },
      financials: {
        currentBalance: 0,
        pendingPayments: 0,
        creditLimit: 0,
      },
    };
  }

  async getAchievedSales(startDate, endDate, user) {
    const query = {
      createdAt: { $gte: startDate, $lte: endDate },
      status: "completed",
    };

    if (user.role === "sales") {
      query.salesRepId = user.id;
    }

    const orders = await performDbOperation(Order, DB_OPERATIONS.FIND, query);
    return orders.reduce((total, order) => total + order.totalAmount, 0);
  }

  async calculateTotalRevenue(distributorId) {
    const orders = await performDbOperation(
      Order,
      DB_OPERATIONS.FIND,
      {
        distributorId,
        status: "completed",
      }
    );
    return orders.reduce((total, order) => total + order.totalAmount, 0);
  }

  async getQuarterlyAchievedSales(user) {
    const currentDate = new Date();
    const firstDayOfQuarter = new Date(
      currentDate.getFullYear(),
      Math.floor(currentDate.getMonth() / 3) * 3,
      1
    );
    const lastDayOfQuarter = new Date(
      currentDate.getFullYear(),
      Math.floor(currentDate.getMonth() / 3) * 3 + 3,
      0
    );
    
    return this.getAchievedSales(firstDayOfQuarter, lastDayOfQuarter, user);
  }

  async getYearlyAchievedSales(user) {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const achieved = await this.getAchievedSales(firstDayOfMonth, lastDayOfMonth, user);
    
    return {
      monthly: {
        target: 100000,
        achieved,
        progress: (achieved / 100000) * 100,
      },
      quarterly: {
        target: 300000,
        achieved: await this.getQuarterlyAchievedSales(user),
        progress: 0,
      },
      yearly: {
        target: 1200000,
        achieved: await this.getYearlyAchievedSales(user),
        progress: 0,
      },
    };
  }
}

export const salesService = new SalesService();