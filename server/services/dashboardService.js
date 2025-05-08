import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { performDbOperation, DB_OPERATIONS } from "../utils/db.utils.js";

export class DashboardService {
  async getDashboardStats(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const [
      totalOrders,
      pendingOrders,
      totalProducts,
      totalUsers,
      recentOrders,
      revenue
    ] = await Promise.all([
      this.getTotalOrders(),
      this.getPendingOrders(),
      this.getTotalProducts(),
      this.getTotalUsers(),
      this.getRecentOrders(),
      this.getRevenue(startDate)
    ]);

    return {
      summary: {
        totalOrders,
        pendingOrders,
        totalProducts,
        totalUsers,
        revenue: revenue[0]?.total || 0
      },
      recentOrders,
      period: {
        start: startDate,
        end: new Date()
      }
    };
  }

  async getRevenueStats() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthlyRevenue = await this.getMonthlyRevenue(startOfMonth, endOfMonth);

    return {
      monthlyRevenue,
      startDate: startOfMonth,
      endDate: endOfMonth
    };
  }

  async getTopProducts(limit = 5, days = 30, sortBy = "quantity") {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const topProducts = await this.aggregateTopProducts(startDate, limit, sortBy);

    return {
      products: topProducts,
      period: {
        start: startDate,
        end: new Date()
      }
    };
  }

  // Private helper methods for database operations
  // Optimize database operations using performDbOperation utility
  async getTotalOrders() {
    return performDbOperation(Order, DB_OPERATIONS.COUNT_DOCUMENTS, { isDeleted: false });
  }

  async getPendingOrders() {
    return performDbOperation(Order, DB_OPERATIONS.COUNT_DOCUMENTS, { status: "pending", isDeleted: false });
  }

  async getTotalProducts() {
    return performDbOperation(Product, DB_OPERATIONS.COUNT_DOCUMENTS, { isDeleted: false });
  }

  async getTotalUsers() {
    return performDbOperation(User, DB_OPERATIONS.COUNT_DOCUMENTS, { role: "user", isDeleted: false });
  }

  async getRecentOrders() {
    return performDbOperation(
      Order,
      DB_OPERATIONS.FIND,
      { isDeleted: false },
      null,
      {
        sort: "-createdAt",
        limit: 5,
        populate: { path: "orderItems.product", select: "name price" },
        lean: true
      }
    );
  }

  async getRevenue(startDate) {
    return performDbOperation(
      Order,
      DB_OPERATIONS.AGGREGATE,
      [
        { 
          $match: { 
            status: "completed",
            isDeleted: false,
            createdAt: { $gte: startDate }
          }
        },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]
    );
  }

  async getMonthlyRevenue(startOfMonth, endOfMonth) {
    return Order.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  async aggregateTopProducts(startDate, limit, sortBy) {
    return Order.aggregate([
      { 
        $match: { 
          status: "completed",
          isDeleted: false,
          createdAt: { $gte: startDate }
        }
      },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          totalQuantity: { $sum: "$orderItems.quantity" },
          totalRevenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } },
          averagePrice: { $avg: "$orderItems.price" },
          orderCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          name: "$productDetails.name",
          sku: "$productDetails.sku",
          category: "$productDetails.category",
          totalQuantity: 1,
          totalRevenue: 1,
          averagePrice: 1,
          orderCount: 1
        }
      },
      { 
        $sort: sortBy === "revenue" 
          ? { totalRevenue: -1 } 
          : { totalQuantity: -1 } 
      },
      { $limit: parseInt(limit) }
    ]);
  }
}

export const dashboardService = new DashboardService();