import jwt from "jsonwebtoken";

import Admin from "../models/authModel.js";
import expressAsyncHandler from "express-async-handler";

export const protect = expressAsyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.user = admin; // Attach Admin to request
    next()
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Unauthorized access" });
  }
});

