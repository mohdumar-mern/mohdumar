// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Helmet } from "react-helmet-async";
// import { fetchBlogs, fetchTags } from "../../features/blog/blogSlice";
// import Container from "../../components/UI/Container/Container";

// const BlogPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { blogs, tags, pagination, loading } = useSelector((state) => state.blog);

//   console.log("blogs", blogs)
//   const [activeTag, setActiveTag] = useState("");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     dispatch(fetchBlogs({ page, tag: activeTag, search }));
//     dispatch(fetchTags());
//   }, [dispatch, page, activeTag, search]);

//   return (
//     <>
//       <Helmet>
//         <title>Blog | Mohd Umar - MERN Stack Developer</title>
//         <meta
//           name="description"
//           content="Tech articles on MERN Stack, Node.js, React, DevOps, CI/CD and more by Mohd Umar."
//         />
//         <meta name="robots" content="index, follow" />
//         <link rel="canonical" href="https://mohdumar.online/blog" />
//         <meta property="og:title" content="Blog | Mohd Umar" />
//         <meta property="og:type" content="website" />
//       </Helmet>

//       <Container>
//         <section className="py-10 font-mono">
//           {/* Header */}
//           <div className="mb-10">
//             <div className="flex items-center gap-2 text-pink-500 text-xs uppercase tracking-widest mb-3">
//               <span>//</span>
//               <span>Tech_Articles</span>
//             </div>
//             <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white">
//               BLOG{" "}
//               <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.6)]">
//                 NODE
//               </span>
//             </h1>
//             <div className="h-[2px] w-28 bg-gradient-to-r from-cyan-400 to-transparent mt-4" />
//           </div>

//           {/* Search */}
//           <input
//             type="text"
//             placeholder="Search articles..."
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(1);
//             }}
//             className="w-full md:w-96 px-4 py-2 bg-[#0a0f17] border border-cyan-500/15 text-cyan-100 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-cyan-400/60 mb-6"
//           />

//           {/* Tags */}
//           <div className="flex flex-wrap gap-2 mb-8">
//             <button
//               onClick={() => { setActiveTag(""); setPage(1); }}
//               className={`text-xs px-3 py-1 border transition ${
//                 activeTag === ""
//                   ? "border-cyan-400 text-cyan-400 bg-cyan-400/10"
//                   : "border-cyan-500/20 text-gray-500 hover:border-cyan-400/40"
//               }`}
//             >
//               All
//             </button>
//             {tags.map((tag) => (
//               <button
//                 key={tag}
//                 onClick={() => { setActiveTag(tag); setPage(1); }}
//                 className={`text-xs px-3 py-1 border transition ${
//                   activeTag === tag
//                     ? "border-cyan-400 text-cyan-400 bg-cyan-400/10"
//                     : "border-cyan-500/20 text-gray-500 hover:border-cyan-400/40"
//                 }`}
//               >
//                 #{tag}
//               </button>
//             ))}
//           </div>

//           {/* Blog Grid */}
//           {loading ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {[...Array(4)].map((_, i) => (
//                 <div key={i} className="border border-cyan-500/10 p-6 animate-pulse">
//                   <div className="h-4 bg-gray-800 rounded mb-3 w-3/4" />
//                   <div className="h-3 bg-gray-800 rounded mb-2 w-full" />
//                   <div className="h-3 bg-gray-800 rounded w-2/3" />
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {blogs.map((blog) => (
//                 <article
//                   key={blog._id}
//                   onClick={() => navigate(`/blog/${blog.slug}`)}
//                   className="border border-cyan-500/15 p-6 hover:border-cyan-400/40 hover:bg-cyan-500/5 transition cursor-pointer group"
//                 >
//                   {/* Cover Image */}
//                   {blog.coverImage && (
//                     <img
//                       src={blog.coverImage}
//                       alt={blog.title}
//                       className="w-full h-40 object-cover mb-4 opacity-80 group-hover:opacity-100 transition"
//                     />
//                   )}

//                   {/* Tags */}
//                   <div className="flex flex-wrap gap-1 mb-3">
//                     {blog.tags?.slice(0, 3).map((tag) => (
//                       <span
//                         key={tag}
//                         className="text-xs text-pink-400 uppercase tracking-widest"
//                       >
//                         #{tag}
//                       </span>
//                     ))}
//                   </div>

//                   {/* Title */}
//                   <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition mb-2 line-clamp-2">
//                     {blog.title}
//                   </h2>

//                   {/* Excerpt */}
//                   <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4">
//                     {blog.excerpt}
//                   </p>

//                   {/* Meta */}
//                   <div className="flex items-center justify-between text-xs text-gray-600">
//                     <span>{blog.readingTime} min read</span>
//                     <span>
//                       {new Date(blog.publishedAt).toLocaleDateString("en-IN", {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </span>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           )}

//           {/* Empty State */}
//           {!loading && blogs.length === 0 && (
//             <p className="text-center text-gray-600 py-20">
//               No articles found.
//             </p>
//           )}

//           {/* Pagination */}
//           {pagination && pagination.totalPages > 1 && (
//             <div className="flex justify-center gap-2 mt-10">
//               {[...Array(pagination.totalPages)].map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setPage(i + 1)}
//                   className={`w-8 h-8 text-xs font-mono border transition ${
//                     page === i + 1
//                       ? "border-cyan-400 text-cyan-400 bg-cyan-400/10"
//                       : "border-cyan-500/20 text-gray-500 hover:border-cyan-400/40"
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//             </div>
//           )}
//         </section>
//       </Container>
//     </>
//   );
// };

// export default BlogPage;

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fetchBlogs, fetchTags } from "../../features/blog/blogSlice";
import Container from "../../components/UI/Container/Container";

const BlogPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, tags, pagination, loading } = useSelector((state) => state.blog);

  const [activeTag, setActiveTag] = useState("");
  const [searchInput, setSearchInput] = useState(""); // what the user is typing — instant
  const [search, setSearch] = useState("");           // what actually triggers the fetch — debounced
  const [page, setPage] = useState(1);

  // Debounce: only update `search` (and refetch) 400ms after the user stops typing
  const debounceRef = useRef(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  useEffect(() => {
    dispatch(fetchBlogs({ page, tag: activeTag, search }));
    dispatch(fetchTags());
  }, [dispatch, page, activeTag, search]);

  return (
    <>
      <Helmet>
        <title>Blog | Mohd Umar - MERN Stack Developer</title>
        <meta
          name="description"
          content="Tech articles on MERN Stack, Node.js, React, DevOps, CI/CD and more by Mohd Umar."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://mohdumar.online/blog" />
        <meta property="og:title" content="Blog | Mohd Umar" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Container  align="start">
        <section className="py-10 font-mono">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-pink-500 text-xs uppercase tracking-widest mb-3">
              <span>//</span>
              <span>Tech_Articles</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white">
              BLOG{" "}
              <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.6)]">
                NODE
              </span>
            </h1>
            <div className="h-[2px] w-28 bg-gradient-to-r from-cyan-400 to-transparent mt-4" />
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search articles..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full md:w-96 px-4 py-2 bg-[#0a0f17] border border-cyan-500/15 text-cyan-100 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-cyan-400/60 mb-6"
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => { setActiveTag(""); setPage(1); }}
              className={`text-xs px-3 py-1 border transition ${
                activeTag === ""
                  ? "border-cyan-400 text-cyan-400 bg-cyan-400/10"
                  : "border-cyan-500/20 text-gray-500 hover:border-cyan-400/40"
              }`}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => { setActiveTag(tag); setPage(1); }}
                className={`text-xs px-3 py-1 border transition ${
                  activeTag === tag
                    ? "border-cyan-400 text-cyan-400 bg-cyan-400/10"
                    : "border-cyan-500/20 text-gray-500 hover:border-cyan-400/40"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Blog Grid — min-h prevents collapse/scrollbar-toggle during loading */}
          <div className="min-h-[400px]">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border border-cyan-500/10 p-6 animate-pulse">
                    <div className="h-4 bg-gray-800 rounded mb-3 w-3/4" />
                    <div className="h-3 bg-gray-800 rounded mb-2 w-full" />
                    <div className="h-3 bg-gray-800 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((blog) => (
                  <article
                    key={blog._id}
                    onClick={() => navigate(`/blog/${blog.slug}`)}
                    className="border border-cyan-500/15 p-6 hover:border-cyan-400/40 hover:bg-cyan-500/5 transition cursor-pointer group"
                  >
                    {blog.coverImage && (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-40 object-cover mb-4 opacity-80 group-hover:opacity-100 transition"
                      />
                    )}

                    <div className="flex flex-wrap gap-1 mb-3">
                      {blog.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-pink-400 uppercase tracking-widest"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition mb-2 line-clamp-2">
                      {blog.title}
                    </h2>

                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{blog.readingTime} min read</span>
                      <span>
                        {new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!loading && blogs.length === 0 && (
              <p className="text-center text-gray-600 py-20">
                No articles found.
              </p>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 text-xs font-mono border transition ${
                    page === i + 1
                      ? "border-cyan-400 text-cyan-400 bg-cyan-400/10"
                      : "border-cyan-500/20 text-gray-500 hover:border-cyan-400/40"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </section>
      </Container>
    </>
  );
};

export default BlogPage;