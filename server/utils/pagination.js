export const paginationHelper = {
  getPaginationOptions(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 50;

    return {
      skip: (page - 1) * limit,
      limit,
      page,
    };
  },

  getPaginationData(total, page, limit) {
    return {
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  },
};
