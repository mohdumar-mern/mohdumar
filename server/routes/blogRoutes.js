import express from "express";
import { body } from "express-validator";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  getAdminBlogs,
  updateBlog,
  deleteBlog,
  getTags,
} from "../controllers/blogController.js";

const router = express.Router();

// Validation rules
const blogValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("content").trim().notEmpty().withMessage("Content is required"),

  body("metaTitle")
    .optional()
    .isLength({ max: 60 })
    .withMessage("Meta title cannot exceed 60 characters"),

  body("metaDescription")
    .optional()
    .isLength({ max: 160 })
    .withMessage("Meta description cannot exceed 160 characters"),
];

// Public Routes
router.get("/", getBlogs);
router.get("/tags", getTags);
router.get("/:slug", getBlogBySlug);

// Protected Routes
router.post("/", protect, blogValidation, createBlog);
router.get("/admin/all", protect, getAdminBlogs);

router.put("/:id", protect, blogValidation, updateBlog);
router.delete("/:id", protect, deleteBlog);

export default router;
