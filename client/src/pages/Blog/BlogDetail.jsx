import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Clock, Eye } from "lucide-react";
import { fetchBlogBySlug, clearBlog } from "../../features/blog/blogSlice";
import Container from "../../components/UI/Container/Container";

const BlogDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog, loading } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchBlogBySlug(slug));
    return () => dispatch(clearBlog());
  }, [dispatch, slug]);

  if (loading) {
    return (
      <Container>
        <div className="max-w-3xl mx-auto py-10 font-mono animate-pulse">
          <div className="h-8 bg-gray-800 rounded mb-4 w-3/4" />
          <div className="h-4 bg-gray-800 rounded mb-2 w-full" />
          <div className="h-4 bg-gray-800 rounded mb-2 w-5/6" />
          <div className="h-4 bg-gray-800 rounded w-4/6" />
        </div>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container>
        <div className="text-center py-20 font-mono">
          <p className="text-gray-600">Blog not found.</p>
          <button
            onClick={() => navigate("/blog")}
            className="mt-4 text-cyan-400 hover:underline text-sm"
          >
            ← Back to Blog
          </button>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.metaTitle || blog.title} | Mohd Umar</title>
        <meta name="description" content={blog.metaDescription || blog.excerpt} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://mohdumar.online/blog/${blog.slug}`} />
        <meta property="og:title" content={blog.metaTitle || blog.title} />
        <meta property="og:description" content={blog.metaDescription || blog.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://mohdumar.online/blog/${blog.slug}`} />
        {blog.coverImage && <meta property="og:image" content={blog.coverImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.metaTitle || blog.title} />
        <meta name="twitter:description" content={blog.metaDescription || blog.excerpt} />
        {blog.coverImage && <meta name="twitter:image" content={blog.coverImage} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog.title,
            description: blog.excerpt,
            author: {
              "@type": "Person",
              name: "Mohd Umar",
              url: "https://mohdumar.online",
            },
            datePublished: blog.publishedAt,
            dateModified: blog.updatedAt,
            image: blog.coverImage,
            url: `https://mohdumar.online/blog/${blog.slug}`,
          })}
        </script>
      </Helmet>

      <Container>
        <article className="max-w-3xl mx-auto py-10 font-mono">
          {/* Back */}
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>

          {/* Cover Image */}
          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-64 object-cover mb-8 border border-cyan-500/20"
            />
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags?.map((tag) => (
              <span key={tag} className="text-xs text-pink-400 uppercase tracking-widest">
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight mb-4">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-6 text-xs text-gray-500 mb-8 pb-8 border-b border-cyan-500/20">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {blog.readingTime} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {blog.views} views
            </span>
            <span>
              {new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Content */}
          <div
            className="prose prose-invert max-w-none blog-content ProseMirror"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Author Section */}
          <div className="mt-16 pt-8 border-t border-cyan-500/20">
            <div className="flex items-start gap-4">
              <img
                src="/avatar.webp"
                alt="Mohd Umar"
                className="w-14 h-14 rounded-full border-2 border-cyan-400/40 object-cover"
              />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                  Written by
                </p>
                <h3 className="text-white font-bold">Mohd Umar</h3>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                  Full Stack Developer · MERN Stack · Building production-grade
                  applications with Node.js, React, Redis & CI/CD pipelines.
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <a
                    href="https://www.linkedin.com/in/mohd-umar-mern-stack-developer/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/mohdumar-mern"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://mohdumar.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Portfolio
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <p className="text-xs text-gray-600 mt-8 text-center border-t border-cyan-500/10 pt-6">
              © 2026 Mohd Umar · All rights reserved ·{" "}
              <a href="https://mohdumar.online" className="text-cyan-400 hover:underline">
                mohdumar.online
              </a>
            </p>
          </div>
        </article>
      </Container>
    </>
  );
};

export default BlogDetail;
