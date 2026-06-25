import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProject } from "../../../features/Project/projectSlice";
import { ChevronLeft } from "lucide-react";

import { Helmet } from 'react-helmet-async';
import { motion } from "framer-motion";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { project, loading, error } = useSelector((state) => state.project);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProject(id));
    }
  }, [id, dispatch]);

  if (!id) return <p className="text-center text-red-500">Invalid project ID.</p>;

  if (loading) {
    return (
      <div className="text-center mt-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
        <p className="text-gray-400 mt-2">Loading project...</p>
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!project) return <p className="text-center text-white">No project found.</p>;

  return (
    <>
      <Helmet>
        <title>{project.title} | Project Details</title>
        <meta name="description" content={`Details of ${project.title} project.`} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        className="max-w-3xl mx-auto p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-white mb-4">{project.title}</h1>

        <p className="mb-3 text-gray-300">{project.description}</p>

        <p className="mb-2 text-sm text-gray-400">
          <strong className="text-white">Tech Stack:</strong> {project.techStack}
        </p>

        {project.githubLink && (
          <p className="mb-2 text-sm">
            <strong className="text-white">GitHub:</strong>{" "}
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
              aria-label="GitHub Repository"
            >
              {project.githubLink}
            </a>
          </p>
        )}

        {project.liveDemo && (
          <p className="mb-4 text-sm">
            <strong className="text-white">Live Demo:</strong>{" "}
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 underline"
              aria-label="Live demo link"
            >
              {project.liveDemo}
            </a>
          </p>
        )}

        {project.file?.url && (
          <img
            src={project.file.url}
            alt={`${project.title} preview`}
            loading="lazy"
            decoding="async"
            fetchpriority="high"
            className="w-full max-w-xs rounded-lg shadow mb-6"
          />
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            <ChevronLeft size={18} />
            Back to Project List
          </button>
          <button
            onClick={() => navigate(`/dashboard/projects/${id}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Edit Project
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default ProjectDetails;
