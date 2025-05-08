class UserUtils {
  static sanitizeUser(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      distributorCode: user.distributorCode,
      mfaEnabled: user.mfaEnabled,
    };
  }

  static buildUserPayload(user) {
    return {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
  }
}

export const userUtils = new UserUtils();