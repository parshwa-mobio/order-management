/**
 * Wrapper for async route handlers to handle errors
 * @param {Function} fn The async route handler function
 * @returns {Function} Wrapped route handler with error handling
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error("Route Handler Error:", error);
    next(error);
  });
};
