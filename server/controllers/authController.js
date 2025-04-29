import jwt from "jsonwebtoken";
import mongoose from "mongoose"; // Add this import
import User from "../models/User.js";
import { logger } from "../utils/logger.js";
import { responseHandler } from "../utils/responseHandler.js";
import { verifyMfaToken } from "../utils/mfa.js";

export class AuthController {
  constructor({
    userModel = User,
    loggerUtil = logger,
    responseUtil = responseHandler,
  } = {}) {
    this.User = userModel;
    this.logger = loggerUtil;
    this.response = responseUtil;

    // Bind methods to ensure 'this' context is correct
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.verifyMfa = this.verifyMfa.bind(this);
  }

  // Private method to generate JWT token
  #generateToken(userId, role) {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
  }

  // Private method to build user payload
  #buildUserPayload(user) {
    return {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await this.User.findOne({ email }).select("+password");
      if (!user || !(await user.comparePassword(password))) {
        this.logger.info(`Invalid login attempt: ${email}`);
        // Fix: Change unauthorized to error with 401 status
        return this.response.error(res, "Invalid credentials", 401);
      }

      const token = this.#generateToken(user._id, user.role);

      if (user.mfaEnabled) {
        this.logger.info(`MFA required for user: ${email}`);
        return this.response.success(res, {
          mfaRequired: true,
          tempToken: token,
          userId: user._id,
        });
      }

      this.logger.info(`Successful login: ${email}`);
      return this.response.success(res, {
        token,
        role: user.role,
        user: this.#buildUserPayload(user),
      });
    } catch (err) {
      this.logger.error("Login failed:", err);
      return this.response.error(res, "An error occurred during login");
    }
  }

  async register(req, res) {
    const { email, password, name, role } = req.body;

    try {
      const existing = await this.User.findOne({ email });
      if (existing) {
        this.logger.info(`Registration attempt with existing email: ${email}`);
        return this.response.badRequest(res, "Email already registered");
      }

      const newUser = new this.User({
        email,
        password,
        name,
        role: role || "dealer",
        userId: new mongoose.Types.ObjectId().toString(),
      });

      await newUser.save();

      const token = this.#generateToken(newUser._id, newUser.role);
      this.logger.info(`New user registered: ${email}`);

      return this.response.success(
        res,
        {
          token,
          user: this.#buildUserPayload(newUser),
        },
        201,
      );
    } catch (err) {
      console.log({ err }); // Add this line to log the error to the consol
      this.logger.error("Registration failed:", err);
      return this.response.error(res, "An error occurred during registration");
    }
  }

  async verifyMfa(req, res) {
    const { userId, token } = req.body;

    try {
      const user = await this.User.findById(userId);
      if (!user) {
        this.logger.info(`Invalid MFA verification for userId: ${userId}`);
        return this.response.unauthorized(res, "Invalid user");
      }

      const valid = verifyMfaToken(token, user.mfaSecret);
      if (!valid) {
        this.logger.info(`Invalid MFA token for user: ${user.email}`);
        return this.response.unauthorized(res, "Invalid MFA token");
      }

      const authToken = this.#generateToken(user._id, user.role);
      this.logger.info(`MFA verified: ${user.email}`);

      return this.response.success(res, {
        token: authToken,
        user: this.#buildUserPayload(user),
      });
    } catch (err) {
      this.logger.error("MFA verification failed:", err);
      return this.response.error(
        res,
        "An error occurred during MFA verification",
      );
    }
  }
}
