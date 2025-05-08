import Order from "../models/Order.js";
import moment from "moment-timezone";
import { performDbOperation, DB_OPERATIONS } from "../utils/db.utils.js";

export class OrderService {
  async createOrder(orderData, userId) {
    const order = await performDbOperation(
      Order,
      DB_OPERATIONS.CREATE,
      {
        ...orderData,
        createdBy: userId,
        createdAt: new Date()
      }
    );

    return performDbOperation(
      Order,
      DB_OPERATIONS.FIND_BY_ID,
      order._id,
      null,
      {
        populate: [
          { path: "orderItems.product", select: "name sku price" },
          { path: "createdBy", select: "name email" }
        ]
      }
    );
  }

  async findOrderById(id) {
    return await Order.findById(id);
  }

  async updateOrder(id, updateData) {
    return await Order.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).populate("items.product");
  }

  async getOrders(filters, pagination) {
    const query = this._buildOrderQuery(filters);
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort("-createdAt")
        .populate({
          path: "user",
          select: "name email",
          strictPopulate: false,
        })
        .populate("orderItems.product", "name sku price")
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Order.countDocuments(query),
    ]);
    return { orders, total };
  }

  _buildOrderQuery(filters) {
    const query = {};
    const { status, dateFrom, dateTo, timezone = "UTC" } = filters;

    if (status) query.status = status;
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom)
        query.createdAt.$gte = moment.tz(dateFrom, timezone).utc().toDate();
      if (dateTo)
        query.createdAt.$lte = moment.tz(dateTo, timezone).utc().toDate();
    }

    return query;
  }

  async updateOrderStatus(id, status, userId) {
    return await Order.findByIdAndUpdate(
      id,
      {
        status,
        updatedAt: new Date(),
        $push: {
          statusHistory: {
            status,
            updatedBy: userId,
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    ).populate("items.product");
  }

  async getOrderById(id) {
    return await Order.findById(id)
      .populate({
        path: "user",
        strictPopulate: false,
      })
      .populate("orderItems.product", "name sku price")
      .lean();
  }

  async softDeleteOrder(id, userId) {
    return await Order.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
    });
  }

  async cloneOrder(id, userId) {
    const sourceOrder = await Order.findById(id).populate(
      "orderItems.product",
      "name sku price"
    );

    if (!sourceOrder) return null;

    const newOrder = new Order({
      ...sourceOrder.toObject(),
      _id: undefined,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      user: userId,
    });

    await newOrder.save();
    return newOrder;
  }

  async createBulkOrders(orders, userId) {
    return await Order.insertMany(
      orders.map((order) => ({
        ...order,
        user: userId,
        status: "pending",
      }))
    );
  }

  async getOrderSummary() {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      activeOrders,
      revenue,
    ] = await Promise.all([
      performDbOperation(Order, DB_OPERATIONS.COUNT_DOCUMENTS, {}),
      performDbOperation(Order, DB_OPERATIONS.COUNT_DOCUMENTS, { status: "pending" }),
      performDbOperation(Order, DB_OPERATIONS.COUNT_DOCUMENTS, { status: "completed" }),
      performDbOperation(Order, DB_OPERATIONS.COUNT_DOCUMENTS, { status: { $in: ["pending", "processing"] } }),
      performDbOperation(Order, DB_OPERATIONS.AGGREGATE, [
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ])
    ]);

    return {
      total: totalOrders,
      pending: pendingOrders,
      completed: completedOrders,
      active: activeOrders,
      revenue: revenue[0]?.total || 0,
      orderGrowth: "0%"
    };
  }
}

export const orderService = new OrderService();