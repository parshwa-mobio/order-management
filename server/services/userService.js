import User from "../models/User.js";
import { DB_OPERATIONS, performDbOperation } from "../utils/db.utils.js";

export class UserService {
  async findUsers(query, pagination) {
    const [users, total] = await Promise.all([
      performDbOperation(
        User,
        DB_OPERATIONS.FIND,
        query,
        {},
        {
          select: "-password -mfaSecret -loginAttempts",
          sort: { createdAt: -1 },
          skip: pagination.skip,
          limit: pagination.limit,
          lean: true,
        }
      ),
      performDbOperation(User, DB_OPERATIONS.COUNT_DOCUMENTS, query),
    ]);
    return { users, total };
  }

  async findById(id, excludeSensitive = true) {
    const options = excludeSensitive
      ? { select: "-password -mfaSecret -loginAttempts", lean: true }
      : { lean: true };

    return performDbOperation(User, DB_OPERATIONS.FIND_BY_ID, id, {}, options);
  }

  async updateUser(id, updates, options = { new: true, runValidators: true }) {
    return performDbOperation(
      User,
      DB_OPERATIONS.FIND_BY_ID_AND_UPDATE,
      id,
      { $set: updates },
      { ...options, select: "-password -mfaSecret -loginAttempts" }
    );
  }

  async createUser(userData) {
    return performDbOperation(User, DB_OPERATIONS.CREATE, userData);
  }

  async getRolesSummary() {
    return performDbOperation(User, DB_OPERATIONS.AGGREGATE, [
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          role: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);
  }

  async softDeleteUser(id, deletedBy) {
    return performDbOperation(User, DB_OPERATIONS.FIND_BY_ID_AND_UPDATE, id, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy,
    });
  }

  async restoreUser(id) {
    return performDbOperation(User, DB_OPERATIONS.FIND_BY_ID_AND_UPDATE, id, {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      $set: { updatedAt: new Date() },
    });
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await performDbOperation(
      User,
      DB_OPERATIONS.FIND_BY_ID,
      userId
    );

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return { success: false, message: "Current password is incorrect" };
    }

    user.password = newPassword;
    await user.save();
    return { success: true };
  }
}

export const userService = new UserService();
