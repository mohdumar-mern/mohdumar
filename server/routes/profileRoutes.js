import express from "express";
const router = express.Router();

import upload from "../middlewares/multerMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js"; // 🔐 import protect middleware

import {
  addProfile,
  getAvatar,
  getProfile,
  getResume,
  getSocialLinks,
  updateProfile,
} from "../controllers/profileController.js";

// @route   POST /api/profile/add
// @desc    Add new profile (Protected)
router.post(
  "/add",
  protect, // ✅ protected
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  addProfile
);

// @route   PUT /api/profile/:id/edit
// @desc    Update existing profile (Protected)
router.put(
  "/:id/edit",
  protect, // ✅ protected
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateProfile
);

// @route   GET /api/profile
// @desc    Get profile (Public)
router.get("/", getProfile);

// @route   GET /api/profile/avatar
// @desc    Get avatar (Public)
router.get("/avatar", getAvatar);

// @route   GET /api/profile/resume
// @desc    Get resume file (Public — no protect here)
router.get("/resume", getResume);

// @route   GET /api/profile/social-links
// @desc    Get social links (Public)
router.get("/social-links", getSocialLinks);

export default router;
