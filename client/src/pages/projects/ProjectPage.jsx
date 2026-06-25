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
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <>
      {/* 🔹 SEO Meta Tags */}
      <Helmet>
        <title>Projects | Mohd Umar - MERN Stack Developer</title>
        <meta
          name="description"
          content="Explore full-stack projects developed by Mohd Umar using React, Node.js, MongoDB, and Express. View live demos and GitHub code."
        />
        <meta name="robots" content="index, follow" />
        <html lang="en" />

        {/* 🧠 JSON-LD Structured Data */}
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
        <main>
          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full min-h-screen py-12"
          >
            {/* 🔸 Page Header */}
            <motion.header variants={cardVariants} className="text-center mb-10">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
                My <span className="text-orange-500">Projects</span>
              </h1>
              <p className="text-gray-400">Some of the work I’ve done recently</p>
            </motion.header>

            {/* 🔁 Loading Spinner */}
            {loading && (
              <motion.div variants={cardVariants} className="text-center mt-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading projects...</p>
              </motion.div>
            )}

            {/* ❌ Error Message */}
            {error && !loading && (
              <motion.p variants={cardVariants} className="text-center text-red-500">
                {error}
              </motion.p>
            )}

            {/* ✅ Projects Grid */}
            {!loading && projects.length > 0 && (
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              >
                {projects.map((proj) => (
                  <motion.div key={proj._id} variants={cardVariants}>
                    <ProjectCard
                      image={proj.imageUrl}
                      title={proj.title}
                      description={proj.description}
                      techStack={proj.techStack?.[0]}
                      githubLink={proj.githubLink}
                      liveDemo={proj.liveDemo}
                      createdAt={proj.createdAt}
                      updatedAt={proj.updatedAt}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* 🈳 No Projects */}
            {!loading && projects.length === 0 && (
              <motion.p variants={cardVariants} className="text-center text-gray-400">
                No projects found.
              </motion.p>
            )}

            {/* 🔽 Pagination */}
            {totalPages > 1 && (
              <motion.div variants={cardVariants} className="mt-10">
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
