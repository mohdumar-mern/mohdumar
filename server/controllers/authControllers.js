import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Auth from "../models/authModel.js";

// ✅ Register Admin
export const register = expressAsyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const username = req.body.username?.trim();
  const email = req.body.email?.toLowerCase().trim();
  const password = req.body.password?.trim();

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await Auth.findOne({ $or: [{ email }, { username }] }).lean();
  if (existingUser) {
    return res.status(409).json({ message: "Username or email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = await Auth.create({ username, email, password: hashedPassword });

  res.status(201).json({
    message: "Admin registered successfully",
    admin: {
      id: newAdmin._id,
      username: newAdmin.username,
      email: newAdmin.email,
    },
  });
});

// ✅ Login Admin
export const login = expressAsyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const email = req.body.email?.toLowerCase().trim();
  const password = req.body.password?.trim();

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const admin = await Auth.findOne({ email }).select("+password");
  if (!admin) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment");
    return res.status(500).json({ message: "Internal server error" });
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({
    message: "Login successful",
    token,
    admin: {
      id: admin._id,
      username: admin.username,
      email: admin.email,
    },
  });
});
