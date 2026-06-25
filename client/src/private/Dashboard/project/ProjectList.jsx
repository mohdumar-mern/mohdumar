import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Trash } from "lucide-react";

import { Helmet } from 'react-helmet-async';

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
      <tr key={project._id} className="hover:bg-[#111] text-gray-300">
        <td className="px-4 py-2 border">{index + 1}</td>
        <td className="px-4 py-2 border">{project.title}</td>
        <td className="px-4 py-2 border">
          {new Date(project.createdAt).toLocaleDateString()}
        </td>
        <td className="px-4 py-2 border text-center">
          <div className="flex justify-center items-center gap-3">
            <button
              aria-label="Edit project"
              title="Edit"
              className="text-blue-600 hover:text-blue-800 transition"
              onClick={() => navigate(`/dashboard/projects/${project._id}/edit`)}
            >
              <Edit size={18} />
            </button>
            <button
              aria-label="View project"
              title="View"
              className="text-green-600 hover:text-green-800 transition"
              onClick={() => navigate(`/dashboard/projects/${project._id}/view`)}
            >
              <Eye size={18} />
            </button>
            <button
              aria-label="Delete project"
              title="Delete"
              className="text-red-600 hover:text-red-800 transition"
              onClick={() => handleDelete(project._id)}
            >
              <Trash size={18} />
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

      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Projects List</h2>
          <button
            onClick={handleAddProject}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            + Add Project
          </button>
        </div>

        {/* Status Message */}
        {(message || error) && (
          <div
            className={`mb-4 p-3 rounded-md ${
              error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {message || error}
          </div>
        )}

        {/* Loading */}
        {loading && <Skeleton rows={6} cols={4} />}

        {/* Empty State */}
        {!loading && projects?.length === 0 && (
          <p className="text-center text-gray-600">No projects found.</p>
        )}

        {/* Table */}
        {!loading && projects?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-orange-300">
              <thead className="bg-orange-100 text-black">
                <tr>
                  <th className="px-4 py-2 border">Sr no</th>
                  <th className="px-4 py-2 border">Title</th>
                  <th className="px-4 py-2 border">Created</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>{renderTableBody()}</tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default ProjectList;
