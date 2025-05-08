import { logger } from "./logger.js";

export const handleApiError = (error, operation) => {
  logger.error(`Failed to ${operation}:`, error);
  throw new Error(`Failed to ${operation}`);
};