import { responseHandler } from "../utils/responseHandler.js";
import { validationResult } from "express-validator";
import { logger } from "../utils/logger.js";
import { paginationHelper } from "../utils/pagination.js"; // Fixed import path
import User from "../models/User.js";

export class UserController {
  // Private helper methods
  _buildSearchQuery(role, search) {
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { companyName: new RegExp(search, "i") },
      ];
    }
    return query;
  }

  _sanitizeUpdates(body) {
    const allowedUpdates = ["name", "email", "companyName", "phoneNumber"];
    return Object.keys(body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = body[key];
        return obj;
      }, {});
  }

  _validateRequest(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw { status: 400, errors: errors.array() };
    }
  }

  _removeSensitiveData(user) {
    const userObj = user.toObject ? user.toObject() : user;
    const sensitiveFields = ["password", "mfaSecret", "loginAttempts"];
    sensitiveFields.forEach((field) => delete userObj[field]);
    return userObj;
  }

  // Public methods
  async getUsers(req, res) {
    try {
      const { role, search } = req.query;
      const pagination = paginationHelper.getPaginationOptions(req.query);
      const query = this._buildSearchQuery(role, search);

      const [users, total] = await Promise.all([
        User.find(query)
          .select("-password -mfaSecret -loginAttempts")
          .sort({ createdAt: -1 })
          .skip(pagination.skip)
          .limit(pagination.limit)
          .lean(),
        User.countDocuments(query),
      ]);

      return responseHandler.success(res, {
        users,
        pagination: paginationHelper.getPaginationData(
          total,
          pagination.page,
          pagination.limit
        ),
      });
    } catch (error) {
      logger.error("Failed to fetch users", error);
      return responseHandler.error(res, "Failed to fetch users");
    }
  }

  async getUserById(req, res) {
    try {
      this._validateRequest(req);

      const user = await User.findById(req.params.id)
        .select("-password -mfaSecret -loginAttempts")
        .lean();

      if (!user) {
        return responseHandler.notFound(res, "User not found");
      }

      if (req.user.role === "sales" && user.role !== "distributor") {
        return responseHandler.forbidden(res, "Access denied");
      }

      return responseHandler.success(res, user);
    } catch (error) {
      if (error.status === 400) {
        return responseHandler.badRequest(res, { errors: error.errors });
      }
      logger.error("Failed to fetch user", error);
      return responseHandler.error(res, "Failed to fetch user");
    }
  }

  async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.id)
        .select("-password -mfaSecret -loginAttempts")
        .lean();

      if (!user) {
        return responseHandler.notFound(res, "User not found");
      }

      return responseHandler.success(res, user);
    } catch (error) {
      logger.error("Failed to fetch profile", error);
      return responseHandler.error(res, "Failed to fetch profile");
    }
  }

  async updateProfile(req, res) {
    try {
      this._validateRequest(req);

      const updates = this._sanitizeUpdates(req.body);
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updates },
        { new: true, runValidators: true }
      ).select("-password -mfaSecret -loginAttempts");

      if (!user) {
        return responseHandler.notFound(res, "User not found");
      }

      return responseHandler.success(res, user);
    } catch (error) {
      if (error.status === 400) {
        return responseHandler.badRequest(res, { errors: error.errors });
      }
      logger.error("Failed to update profile", error);
      return responseHandler.error(res, "Failed to update profile");
    }
  }

  async changePassword(req, res) {
    try {
      this._validateRequest(req);

      const user = await User.findById(req.user.id);
      if (!user) {
        return responseHandler.notFound(res, "User not found");
      }

      const isMatch = await user.comparePassword(req.body.currentPassword);
      if (!isMatch) {
        return responseHandler.badRequest(res, "Current password is incorrect");
      }

      user.password = req.body.newPassword;
      await user.save();

      logger.info("Password changed successfully", { userId: user.id });
      return responseHandler.success(res, {
        message: "Password updated successfully",
      });
    } catch (error) {
      if (error.status === 400) {
        return responseHandler.badRequest(res, { errors: error.errors });
      }
      logger.error("Failed to change password", error);
      return responseHandler.error(res, "Failed to change password");
    }
  }

  async createUser(req, res) {
    try {
      this._validateRequest(req);

      const user = new User(req.body);
      await user.save();

      const userResponse = this._removeSensitiveData(user);
      logger.info("User created successfully", { userId: user.id });
      return responseHandler.success(res, userResponse, 201);
    } catch (error) {
      if (error.code === 11000) {
        return responseHandler.badRequest(res, "Email already exists");
      }
      if (error.status === 400) {
        return responseHandler.badRequest(res, { errors: error.errors });
      }
      logger.error("Failed to create user", error);
      return responseHandler.error(res, "Failed to create user");
    }
  }

  async getRolesSummary(req, res) {
    try {
      const roleSummary = await User.aggregate([
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

      return responseHandler.success(res, {
        summary: roleSummary,
        total: roleSummary.reduce((acc, curr) => acc + curr.count, 0),
      });
    } catch (error) {
      logger.error("Failed to fetch roles summary", error);
      return responseHandler.error(res, "Failed to fetch roles summary");
    }
  }

  async softDeleteUser(req, res) {
    try {
      this._validateRequest(req);

      const user = await User.findById(req.params.id);
      if (!user) {
        return responseHandler.notFound(res, "User not found");
      }

      // Prevent deleting own account
      if (user.id === req.user.id) {
        return responseHandler.forbidden(res, "Cannot delete your own account");
      }

      await User.findByIdAndUpdate(req.params.id, {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: req.user.id,
      });

      logger.info("User soft deleted successfully", { userId: user.id });
      return responseHandler.success(res, {
        message: "User deleted successfully",
      });
    } catch (error) {
      if (error.status === 400) {
        return responseHandler.badRequest(res, { errors: error.errors });
      }
      logger.error("Failed to delete user", error);
      return responseHandler.error(res, "Failed to delete user");
    }
  }

  async restoreUser(req, res) {
    try {
      this._validateRequest(req);

      const user = await User.findById(req.params.id);
      if (!user) {
        return responseHandler.notFound(res, "User not found");
      }

      if (!user.isDeleted) {
        return responseHandler.badRequest(res, "User is not deleted");
      }

      await User.findByIdAndUpdate(req.params.id, {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        $set: { updatedAt: new Date() },
      });

      logger.info("User restored successfully", { userId: user.id });
      return responseHandler.success(res, {
        message: "User restored successfully",
      });
    } catch (error) {
      if (error.status === 400) {
        return responseHandler.badRequest(res, { errors: error.errors });
      }
      logger.error("Failed to restore user", error);
      return responseHandler.error(res, "Failed to restore user");
    }
  }

  constructor() {
    // Bind the methods to preserve 'this' context
    this.getUsers = this.getUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.createUser = this.createUser.bind(this);
    this.getRolesSummary = this.getRolesSummary.bind(this);
    this.softDeleteUser = this.softDeleteUser.bind(this);
    this.restoreUser = this.restoreUser.bind(this);
  }
}
