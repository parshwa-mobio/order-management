import NodeCache from "node-cache";

const cacheInstance = new NodeCache();

/**
 * Cache middleware for Express routes.
 * @param {number} ttlSeconds - Time to live in seconds
 */
export function cache(ttlSeconds = 60) {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cachedBody = cacheInstance.get(key);

    if (cachedBody) {
      return res.json(cachedBody);
    }

    // Monkey-patch res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      cacheInstance.set(key, body, ttlSeconds);
      return originalJson(body);
    };

    next();
  };
}
