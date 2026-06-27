import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../features/Project/projectSlice";

import { Helmet } from "react-helmet-async";

import Container from "../../components/UI/Container/Container";
import Pagination from "../../components/UI/pagination/Pagination";
import ProjectCard from "../../components/UI/card/ProjectCard";

import { motion } from "framer-motion";

const ProjectPage = () => {
  const dispatch = useDispatch();

  const {
    projects = [],
    loading,
    error,
    currentPage,
    totalPages,
    projectsPerPage,
  } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(fetchProjects({ page: currentPage, limit: projectsPerPage }));
  }, [dispatch, currentPage, projectsPerPage]);

  const handlePageChange = (page) => {
    dispatch(fetchProjects({ page, limit: projectsPerPage }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.15,
        when: "beforeChildren",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <Helmet>
        <title>Projects | Mohd Umar - MERN Stack Developer</title>
        <meta
          name="description"
          content="Explore full-stack projects developed by Mohd Umar using React, Node.js, MongoDB, and Express. View live demos and GitHub code."
        />
        <meta name="robots" content="index, follow" />
        <html lang="en" />

        {projects?.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Projects - Mohd Umar",
              about: "MERN Stack Projects",
              author: {
                "@type": "Person",
                name: "Mohd Umar",
                url: "https://umarportfolio-frontend.vercel.app",
              },
              mainEntity: {
                "@type": "ItemList",
                itemListElement: projects.map((proj, index) => ({
                  "@type": "CreativeWork",
                  position: index + 1,
                  name: proj.title,
                  url:
                    proj.liveDemo ||
                    "https://umarportfolio-frontend.vercel.app/projects",
                })),
              },
            })}
          </script>
        )}
      </Helmet>

      <Container>
        <main className="w-full">
          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full min-h-screen py-12 font-mono"
          >
            {/* 🔸 Page Header */}
            <motion.header variants={cardVariants} className="mb-14">
              <div className="flex items-center gap-2 text-pink-500 text-xs uppercase tracking-widest">
                <span>//</span>
                <span>Deployed_Systems</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mt-3">
                PROJECT{" "}
                <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.6)]">
                  LOG
                </span>
              </h1>

              <div className="h-[2px] w-28 bg-gradient-to-r from-cyan-400 to-transparent mt-4" />
            </motion.header>

            {/* 🔁 Loading */}
            {loading && (
              <motion.div variants={cardVariants} className="text-center mt-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400 mx-auto"></div>
                <p className="text-gray-500 text-sm uppercase tracking-widest mt-3">
                  Loading_projects...
                </p>
              </motion.div>
            )}

            {/* ❌ Error */}
            {error && !loading && (
              <motion.p
                variants={cardVariants}
                className="text-center text-pink-500 text-sm"
              >
                {error}
              </motion.p>
            )}

            {/* ✅ Projects — 3-column grid, equal height rows */}
            {!loading && projects.length > 0 && (
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
              >
             {projects.map((proj) => (
  <motion.div
    key={proj._id}
    variants={cardVariants}
    className="h-full"
    whileHover={{ scale: 1.04 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <ProjectCard
      image={proj.imageUrl}
      title={proj.title}
      description={proj.description}
      techStack={proj.techStack}
      githubLink={proj.githubLink}
      liveDemo={proj.liveDemo}
    />
  </motion.div>
))}
              </motion.div>
            )}

            {/* 🈳 No Projects */}
            {!loading && projects.length === 0 && (
              <motion.p
                variants={cardVariants}
                className="text-center text-gray-500 text-sm uppercase tracking-widest"
              >
                No_projects_found
              </motion.p>
            )}

            {/* 🔽 Pagination */}
            {totalPages > 1 && (
              <motion.div variants={cardVariants} className="mt-14">
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </motion.div>
            )}
          </motion.section>
        </main>
      </Container>
    </>
  );
};

export default React.memo(ProjectPage);