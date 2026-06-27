import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Trash, Plus } from "lucide-react";

import { Helmet } from "react-helmet-async";

import {
  fetchProjects,
  deleteProject,
  clearError,
  clearMessage,
} from "../../../features/Project/projectSlice";

import Pagination from "../../../components/UI/pagination/Pagination";
import Skeleton from "../../../components/UI/Skeleton/TableSkeleton";

const ProjectList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    projects,
    loading,
    error,
    message,
    currentPage,
    totalPages,
    projectsPerPage,
  } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(fetchProjects({ page: currentPage, limit: projectsPerPage }));
  }, [dispatch, currentPage, projectsPerPage]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        if (message) dispatch(clearMessage());
        if (error) dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  const handleAddProject = useCallback(() => {
    navigate("/dashboard/projects/add");
  }, [navigate]);

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm("Are you sure you want to delete this project?")) {
        dispatch(deleteProject(id))
          .unwrap()
          .then(() => dispatch(fetchProjects({ page: currentPage, limit: projectsPerPage })))
          .catch((err) => console.error("Failed to delete project:", err));
      }
    },
    [dispatch, currentPage, projectsPerPage]
  );

  const handlePageChange = useCallback(
    (page) => {
      if (page > 0 && page <= totalPages) {
        dispatch(fetchProjects({ page, limit: projectsPerPage }));
      }
    },
    [dispatch, totalPages, projectsPerPage]
  );

  const renderTableBody = () =>
    projects.map((project, index) => (
      <tr
        key={project._id}
        className="hover:bg-cyan-500/5 text-gray-300 border-b border-cyan-500/10"
      >
        <td className="px-4 py-3 text-gray-500">{index + 1}</td>
        <td className="px-4 py-3 text-white">{project.title}</td>
        <td className="px-4 py-3 text-gray-500 text-xs">
          {new Date(project.createdAt).toLocaleDateString()}
        </td>
        <td className="px-4 py-3 text-center">
          <div className="flex justify-center items-center gap-4">
            <button
              aria-label="Edit project"
              title="Edit"
              className="text-cyan-400 hover:text-cyan-300 transition"
              onClick={() => navigate(`/dashboard/projects/${project._id}/edit`)}
            >
              <Edit size={16} />
            </button>
            <button
              aria-label="View project"
              title="View"
              className="text-emerald-400 hover:text-emerald-300 transition"
              onClick={() => navigate(`/dashboard/projects/${project._id}/view`)}
            >
              <Eye size={16} />
            </button>
            <button
              aria-label="Delete project"
              title="Delete"
              className="text-pink-400 hover:text-pink-300 transition"
              onClick={() => handleDelete(project._id)}
            >
              <Trash size={16} />
            </button>
          </div>
        </td>
      </tr>
    ));

  return (
    <>
      <Helmet>
        <title>Projects | Admin Dashboard</title>
        <meta name="description" content="Manage and track all your projects." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="font-mono">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2 text-pink-500 text-[11px] uppercase tracking-widest">
              <span>//</span>
              <span>Registry</span>
            </div>
            <h2 className="text-xl font-bold uppercase tracking-tight text-white mt-1">
              Projects_List
            </h2>
          </div>
          <button
            onClick={handleAddProject}
            className="flex items-center gap-2 bg-cyan-400 text-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-cyan-300 transition"
            style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)" }}
          >
            <Plus className="w-4 h-4" />
            Add_Project
          </button>
        </div>

        {/* Status Message */}
        {(message || error) && (
          <div
            className={`mb-4 px-4 py-3 border text-sm ${
              error
                ? "border-pink-500/30 bg-pink-500/10 text-pink-300"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            {message || error}
          </div>
        )}

        {/* Loading */}
        {loading && <Skeleton rows={6} cols={4} />}

        {/* Empty State */}
        {!loading && projects?.length === 0 && (
          <p className="text-center text-gray-500 text-sm uppercase tracking-widest mt-8">
            No_projects_found
          </p>
        )}

        {/* Table */}
        {!loading && projects?.length > 0 && (
          <div className="overflow-x-auto border border-cyan-500/15">
            <table className="min-w-full text-sm">
              <thead className="bg-cyan-500/5 text-cyan-300 text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-4 py-3 text-left">Sr_No</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>{renderTableBody()}</tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectList;