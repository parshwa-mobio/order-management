export const responseHandler = {
  success(res, data, status = 200) {
    return res.status(status).json(data);
  },

  error(res, message, status = 500) {
    return res.status(status).json({ message });
  },

  notFound(res, message = "Resource not found") {
    return res.status(404).json({ message });
  },

  badRequest(res, message = "Bad request") {
    return res.status(400).json({ message });
  },

  forbidden(res, message = "Forbidden") {
    return res.status(403).json({ message });
  },
};
