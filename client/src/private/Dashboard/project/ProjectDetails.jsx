import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProject } from "../../../features/Project/projectSlice";
import { ChevronLeft, Github, ExternalLink, Edit } from "lucide-react";

import { Helmet } from "react-helmet-async";
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

  if (!id)
    return (
      <p className="text-center text-pink-500 text-sm uppercase tracking-widest">
        Invalid_Project_ID
      </p>
    );

  if (loading) {
    return (
      <div className="text-center mt-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400 mx-auto"></div>
        <p className="text-gray-500 text-sm uppercase tracking-widest mt-3">
          Loading_project...
        </p>
      </div>
    );
  }

  if (error)
    return <p className="text-pink-500 text-center text-sm">{error}</p>;
  if (!project)
    return (
      <p className="text-center text-gray-500 text-sm uppercase tracking-widest">
        No_project_found
      </p>
    );

  const previewImage = project.imageUrl || project.file?.url;

  return (
    <>
      <Helmet>
        <title>{project.title} | Project Details</title>
        <meta name="description" content={`Details of ${project.title} project.`} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        className="max-w-3xl mx-auto font-mono"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-cyan-400 text-sm uppercase tracking-widest mb-6 inline-flex items-center transition"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back_to_List
        </button>

        <div
          className="border border-cyan-500/15 bg-gradient-to-b from-cyan-950/10 to-black p-6 sm:p-8"
          style={{
            clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)",
          }}
        >
          <div className="flex items-center gap-2 text-pink-500 text-[11px] uppercase tracking-widest mb-2">
            <span>//</span>
            <span>Project_Record</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-5">
            {project.title}
          </h1>

          {previewImage && (
            <img
              src={previewImage}
              alt={`${project.title} preview`}
              loading="lazy"
              decoding="async"
              fetchPriority="high"
              className="w-full max-w-xs border border-cyan-500/20 mb-6"
            />
          )}

          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            {project.description}
          </p>

          <div className="text-sm mb-2">
            <span className="text-xs uppercase tracking-widest text-gray-500">
              Tech_Stack:{" "}
            </span>
            <span className="text-cyan-300">{project.techStack}</span>
          </div>

          {project.githubLink && (
            <div className="text-sm mb-2 flex items-center gap-2">
              <Github className="w-4 h-4 text-gray-500" />
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 underline transition"
                aria-label="GitHub Repository"
              >
                {project.githubLink}
              </a>
            </div>
          )}

          {project.liveDemo && (
            <div className="text-sm mb-6 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-gray-500" />
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 underline transition"
                aria-label="Live demo link"
              >
                {project.liveDemo}
              </a>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-cyan-500/10">
            <button
              onClick={() => navigate(`/dashboard/projects/${id}/edit`)}
              className="flex items-center gap-2 bg-cyan-400 text-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-cyan-300 transition"
              style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)" }}
            >
              <Edit className="w-4 h-4" />
              Edit_Project
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProjectDetails;