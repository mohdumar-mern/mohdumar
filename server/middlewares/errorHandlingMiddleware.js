export const errorHandling = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal server error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Please check the submitted information.";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier.";
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists.";
  } else if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    statusCode = 400;
    message = "Invalid JSON request body.";
  }

  if (statusCode < 400 || statusCode > 599) {
    statusCode = 500;
  }

  if (statusCode >= 500) {
    console.error("Server error:", {
      method: req.method,
      path: req.originalUrl,
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });

    message =
      process.env.NODE_ENV === "development"
        ? err.message || "Internal server error"
        : "Something went wrong. Please try again later.";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && statusCode >= 500
      ? { stack: err.stack }
      : {}),
  });
};

export const pageNotFound = (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found.",
    path: req.originalUrl,
  });
};
