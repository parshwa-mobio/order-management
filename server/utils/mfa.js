import { authenticator } from "otplib";

// Configure authenticator options
authenticator.options = {
  window: 1,
  step: 30,
};

/**
 * Generate a new MFA secret
 * @returns {string} The generated secret
 */
export const generateMfaSecret = () => {
  return authenticator.generateSecret();
};

/**
 * Verify an MFA token against a secret
 * @param {string} token - The token to verify
 * @param {string} secret - The secret to verify against
 * @returns {boolean} Whether the token is valid
 */
export const verifyMfaToken = (token, secret) => {
  try {
    return authenticator.verify({ token, secret });
  } catch (error) {
    return false;
  }
};

/**
 * Generate a QR code URL for MFA setup
 * @param {string} secret - The MFA secret
 * @param {string} email - The user's email
 * @param {string} issuer - The issuer name (default: 'Order Management System')
 * @returns {string} The QR code URL
 */
export const generateQRCodeUrl = (
  secret,
  email,
  issuer = "Order Management System",
) => {
  return authenticator.keyuri(email, issuer, secret);
};
