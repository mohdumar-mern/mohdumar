import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit per IP
  message: "Too many requests from this IP, please try again later.",
});

export default  limiter