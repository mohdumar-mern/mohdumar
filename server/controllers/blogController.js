import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Blog from "../models/blogModel.js";

// ✅ Create Blog (Protected)
export const createBlog = expressAsyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    title,
    content,
    excerpt,
    tags,
    metaTitle,
    metaDescription,
    coverImage,
    isPublished,
  } = req.body;

  const blog = new Blog({
    title,
    content,
    excerpt,
    tags,
    metaTitle,
    metaDescription,
    coverImage,
    isPublished,
    publishedAt: isPublished ? new Date() : null,
  });

  const saved = await blog.save();
  res.status(201).json({ message: "Blog created successfully", blog: saved });
});

// ✅ Get All Blogs (Public) with Pagination + Filter
export const getBlogs = expressAsyncHandler(async (req, res) => {
  const { page = 1, limit = 10, tag, search } = req.query;

  const query = { isPublished: true };

  if (tag) query.tags = tag;

  if (search) {
    query.$text = { $search: search };
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { publishedAt: -1 },
    select:
      "title slug excerpt tags coverImage readingTime views publishedAt createdAt",
  };

  const blogs = await Blog.find(query)
    .select(options.select)
    .sort(options.sort)
    .skip((options.page - 1) * options.limit)
    .limit(options.limit);

  const total = await Blog.countDocuments(query);

  res.status(200).json({
    blogs,
    pagination: {
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    },
  });
});

// ✅ Get Single Blog by Slug (Public) + increment views
export const getBlogBySlug = expressAsyncHandler(async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug, isPublished: true },
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  res.status(200).json({ blog });
});

// ✅ Get All Blogs for Admin (Protected)
export const getAdminBlogs = expressAsyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Blog.countDocuments();

  res.status(200).json({
    blogs,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
});

// ✅ Update Blog (Protected)
export const updateBlog = expressAsyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const { isPublished } = req.body;

  if (isPublished && !blog.isPublished) {
    req.body.publishedAt = new Date();
  }

  const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ message: "Blog updated successfully", blog: updated });
});

// ✅ Delete Blog (Protected)
export const deleteBlog = expressAsyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  res.status(200).json({ message: "Blog deleted successfully" });
});

// ✅ Get All Tags (Public)
export const getTags = expressAsyncHandler(async (req, res) => {
  const tags = await Blog.distinct("tags", { isPublished: true });
  res.status(200).json({ tags });
});
