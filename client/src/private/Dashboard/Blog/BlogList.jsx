import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";

import { fetchAdminBlogs,deleteBlog, clearBlogStatus } from "../../../features/blog/blogSlice";
import TableSkeleton from "../../../components/UI/Skeleton/TableSkeleton";

const BlogList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, loading, error, message } = useSelector((state) => state.blog);

  console.log("blog",blogs)

  useEffect(() => {
    dispatch(fetchAdminBlogs());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearBlogStatus());
    }
    if (error) {
      toast.error(error);
      dispatch(clearBlogStatus());
    }
  }, [message, error, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this blog?")) {
      dispatch(deleteBlog(id));
    }
  };

  return (
    <>
      <Helmet>
        <title>Blogs | Dashboard</title>
      </Helmet>

      <div className="font-mono p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white uppercase tracking-widest">
            // Blogs
          </h1>
          <button
            onClick={() => navigate("/dashboard/blogs/add")}
            className="flex items-center gap-2 bg-cyan-400 text-black font-bold text-xs uppercase tracking-widest px-4 py-2 hover:bg-cyan-300 transition"
          >
            <Plus className="w-4 h-4" />
            New Blog
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-cyan-500/20 text-gray-500 uppercase text-xs tracking-widest">
                  <th className="py-3 pr-4">Title</th>
                  <th className="py-3 pr-4">Tags</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Views</th>
                  <th className="py-3 pr-4">Reading Time</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs?.map((blog) => (
                  <tr
                    key={blog._id}
                    className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition"
                  >
                    <td className="py-3 pr-4 text-gray-300 max-w-xs truncate">
                      {blog.title}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          blog.isPublished
                            ? "bg-green-500/10 text-green-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-400">{blog.views}</td>
                    <td className="py-3 pr-4 text-gray-400">
                      {blog.readingTime} min
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/blog/${blog.slug}`)
                          }
                          className="text-gray-400 hover:text-cyan-400 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/dashboard/blogs/${blog._id}/edit`)
                          }
                          className="text-gray-400 hover:text-cyan-400 transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-gray-400 hover:text-pink-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {blogs?.length === 0 && (
              <p className="text-center text-gray-600 py-10">
                No blogs yet. Create your first blog!
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BlogList;