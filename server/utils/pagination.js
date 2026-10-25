const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export const getPagination = (query = {}) => {
  const rawPage = query.page ?? DEFAULT_PAGE;
  const rawLimit = query.limit ?? DEFAULT_LIMIT;

  const page = Number(rawPage);
  const limit = Number(rawLimit);

  if (rawPage === "" || !Number.isSafeInteger(page) || page < 1) {
    const error = new Error("Page must be a positive integer.");
    error.statusCode = 400;
    throw error;
  }

  if (
    rawLimit === "" ||
    !Number.isSafeInteger(limit) ||
    limit < 1 ||
    limit > MAX_LIMIT
  ) {
    const error = new Error(`Limit must be between 1 and ${MAX_LIMIT}.`);
    error.statusCode = 400;
    throw error;
  }

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

export const getPaginationMeta = ({ page, limit, total }) => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1 && totalPages > 0,
  };
};
