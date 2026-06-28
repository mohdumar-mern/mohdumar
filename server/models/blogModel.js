import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
    coverImage: {
      type: String,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    metaTitle: {
      type: String,
      maxlength: [60, "Meta title cannot exceed 60 characters"],
    },
    metaDescription: {
      type: String,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    readingTime: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto slug generate from title
blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
  next();
});

// Auto reading time calculate
blogSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    const wordsPerMinute = 200;
    const wordCount = this.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

// Auto excerpt generate if not provided
blogSchema.pre("save", function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content
      .replace(/<[^>]*>/g, "")
      .substring(0, 250)
      .trim();
  }
  next();
});

// Index for SEO slug lookup + search
// blogSchema.index({ slug: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ isPublished: 1, publishedAt: -1 });
blogSchema.index({ title: "text", content: "text", tags: "text" });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;