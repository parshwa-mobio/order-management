import { responseHandler } from "../utils/responseHandler.js";

export const checkHierarchicalAccess = async (req, res, next) => {
  try {
    const user = req.user;
    const targetUserId = req.params.userId || req.body.userId;

    if (!targetUserId || user.role === "admin") {
      return next();
    }

    if (user.role === "distributor") {
      const targetUser = await User.findById(targetUserId);
      if (
        !targetUser ||
        targetUser.parentDistributor.toString() !== user._id.toString()
      ) {
        return responseHandler.forbidden(
          res,
          "Access denied: User not in your hierarchy",
        );
      }
    }

    if (user.role === "dealer") {
      if (targetUserId !== user._id.toString()) {
        return responseHandler.forbidden(
          res,
          "Access denied: Can only access own data",
        );
      }
    }

    next();
  } catch (error) {
    return responseHandler.error(res, "Failed to verify hierarchical access");
  }
};
