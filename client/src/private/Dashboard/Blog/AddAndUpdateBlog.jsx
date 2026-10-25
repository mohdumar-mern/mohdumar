import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import TipTapEditor from "../../../components/Editor/TipTapEditor";
import Input from "../../../components/UI/Input/Input";
import { createBlog,
    updateBlog,
    fetchAdminBlogs,
    clearBlogStatus,
 } from "../../../features/blog/blogSlice";

const AddAndUpdateBlog = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { blogs, loading, error, message } = useSelector((state) => state.blog);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
    coverImage: "",
    isPublished: false,
  });

  // Load existing blog for edit
  useEffect(() => {
    if (isEdit) {
      dispatch(fetchAdminBlogs());
    }
  }, [isEdit, dispatch]);

  useEffect(() => {
    if (isEdit && blogs.length > 0) {
      const blog = blogs.find((b) => b._id === id);
      if (blog) {
        setFormData({
          title: blog.title || "",
          content: blog.content || "",
          excerpt: blog.excerpt || "",
          tags: blog.tags?.join(", ") || "",
          metaTitle: blog.metaTitle || "",
          metaDescription: blog.metaDescription || "",
          coverImage: blog.coverImage || "",
          isPublished: blog.isPublished || false,
        });
      }
    }
  }, [isEdit, blogs, id]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearBlogStatus());
      navigate("/dashboard/blogs");
    }
    if (error) {
      toast.error(error);
      dispatch(clearBlogStatus());
    }
  }, [message, error, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (isEdit) {
      dispatch(updateBlog({ id, data: payload }));
    } else {
      dispatch(createBlog(payload));
    }
  };

  return (
    <>
      <Helmet>
        <title>{isEdit ? "Edit Blog" : "Add Blog"} | Dashboard</title>
      </Helmet>

      <div className="max-w-4xl mx-auto p-6 font-mono">
        <h1 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest">
          {isEdit ? "// Edit_Blog" : "// New_Blog"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Input
            label="Title"
            name="title"
            placeholder="Blog title..."
            value={formData.title}
            onChange={handleChange}
          />

          {/* Cover Image */}
          <Input
            label="Cover Image URL"
            name="coverImage"
            placeholder="https://..."
            value={formData.coverImage}
            onChange={handleChange}
          />

          {/* Tags */}
          <Input
            label="Tags (comma separated)"
            name="tags"
            placeholder="react, nodejs, cicd"
            value={formData.tags}
            onChange={handleChange}
          />

          {/* Content - TipTap */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Content
            </label>
            <TipTapEditor
              content={formData.content}
              onChange={(html) =>
                setFormData((prev) => ({ ...prev, content: html }))
              }
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Excerpt (optional - auto generated if empty)
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Short description..."
              rows={3}
              className="w-full px-4 py-3 bg-[#0a0f17] border border-cyan-500/15 text-cyan-100 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-cyan-400/60 resize-none"
            />
          </div>

          {/* SEO Fields */}
          <div className="border border-cyan-500/20 p-4 space-y-4">
            <p className="text-xs text-cyan-400 uppercase tracking-widest">
              // SEO Settings
            </p>
            <Input
              label="Meta Title (max 60 chars)"
              name="metaTitle"
              placeholder="SEO title..."
              value={formData.metaTitle}
              onChange={handleChange}
            />
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                Meta Description (max 160 chars)
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                placeholder="SEO description..."
                rows={2}
                maxLength={160}
                className="w-full px-4 py-3 bg-[#0a0f17] border border-cyan-500/15 text-cyan-100 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-cyan-400/60 resize-none"
              />
              <p className="text-xs text-gray-600 mt-1">
                {formData.metaDescription.length}/160
              </p>
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isPublished"
              id="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-4 h-4 accent-cyan-400"
            />
            <label
              htmlFor="isPublished"
              className="text-sm text-gray-400 font-mono"
            >
              Publish this blog
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-400 text-black font-bold uppercase tracking-widest text-sm py-3 px-8 hover:bg-cyan-300 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Update Blog" : "Publish Blog"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddAndUpdateBlog;