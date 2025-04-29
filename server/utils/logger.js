export const logger = {
  info(message, meta = {}) {
    console.log(
      JSON.stringify({
        level: "info",
        timestamp: new Date().toISOString(),
        message,
        ...meta,
      }),
    );
  },

  error(message, error, meta = {}) {
    console.error(
      JSON.stringify({
        level: "error",
        timestamp: new Date().toISOString(),
        message,
        error: error.message,
        stack: error.stack,
        ...meta,
      }),
    );
  },
};
