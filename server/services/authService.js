import jwt from "jsonwebtoken";
import { authenticator } from "otplib";
import { promisify } from "util";
import bcrypt from "bcryptjs";

class AuthService {
  constructor() {
    this.jwtSign = promisify(jwt.sign);
    this.jwtVerify = promisify(jwt.verify);
    this.setupAuthenticator();
  }

  setupAuthenticator() {
    authenticator.options = {
      window: 1,
      step: 30,
    };
  }

  async generateToken(user) {
    const jwtOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    };
    if (
      process.env.JWT_AUDIENCE &&
      typeof process.env.JWT_AUDIENCE === "string"
    ) {
      jwtOptions.audience = process.env.JWT_AUDIENCE;
    }
    if (process.env.JWT_ISSUER && typeof process.env.JWT_ISSUER === "string") {
      jwtOptions.issuer = process.env.JWT_ISSUER;
    }
    return this.jwtSign(
      {
        userId: user._id,
        role: user.role,
        version: user.tokenVersion,
      },
      process.env.JWT_SECRET,
      jwtOptions,
    );
  }

  async verifyMfaToken(secret, token) {
    return authenticator.verify({ token, secret });
  }

  async generateMfaSecret() {
    return authenticator.generateSecret();
  }

  sanitizeUser(user) {
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

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}

export const authService = new AuthService();
