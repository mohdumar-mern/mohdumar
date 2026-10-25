import jwt from "jsonwebtoken";
import Admin from "../models/authModel.js";
import expressAsyncHandler from "express-async-handler";

export const protect = expressAsyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in.",
    });
  }

  if (!process.env.JWT_SECRET) {
    const error = new Error("JWT_SECRET is not configured.");
    error.statusCode = 500;
    throw error;
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }

  if (!decoded || typeof decoded !== "object" || !decoded.id) {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token.",
    });
  }

  const admin = await Admin.findById(decoded.id).select("-password");

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: "Admin account not found. Please log in again.",
    });
  }

  req.user = admin;

  next();
});
