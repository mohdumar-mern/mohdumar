import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Helmet } from 'react-helmet-async';

import {
  deleteservice,
  fetchServices,
  // clearError,
  // clearMessage,
} from "../../../features/service/serviceSlice";
import Skeleton from "../../../components/UI/Skeleton/TableSkeleton";

const ServicesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { services, loading, error, message } = useSelector(
    (state) => state.service
  );

  // Fetch services
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  // Clear messages and errors after a short delay
  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        // dispatch(clearError());
        // dispatch(clearMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, message, dispatch]);

  // Delete service handler
  const handleDelete = useCallback(
    (id) => {
      if (window.confirm("Are you sure you want to delete this service?")) {
        dispatch(deleteservice(id))
          .unwrap()
          .then(() => {
            dispatch(fetchServices());
          })
          .catch((err) => {
            console.error("Failed to delete service:", err);
          });
      }
    },
    [dispatch]
  );

  const handleView = useCallback(
    (id) => {
      navigate(`/dashboard/services/${id}/view`);
    },
    [navigate]
  );

  const handleAddService = () => {
    navigate("/dashboard/services/add");
  };

  return (
    <>
      <Helmet>
        <title>Services | Admin Dashboard</title>
        <meta
          name="description"
          content="Manage your portfolio services. Add, view, or delete service records."
        />
      </Helmet>

      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Services List</h2>
          <button
            onClick={handleAddService}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            + Add Service
          </button>
        </div>

        {/* Feedback Message */}
        {message && !loading && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-center">
            {message}
          </div>
        )}
        {error && !loading && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && <Skeleton rows={6} cols={4} />}

        {/* Empty state */}
        {!loading && services?.length === 0 && (
          <div className="text-center py-4 text-gray-600">
            <p>No services found.</p>
            <button
              onClick={handleAddService}
              className="mt-4 text-orange-600 hover:text-orange-800 transition"
            >
              + Add Your First Service
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && services?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-orange-300">
              <thead className="bg-orange-100 text-black">
                <tr>
                  <th className="px-4 py-2 border">Sr. No</th>
                  <th className="px-4 py-2 border">Title</th>
                  <th className="px-4 py-2 border">Created At</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr
                    key={service?._id}
                    className="hover:bg-[#111] text-gray-300"
                  >
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{service?.title}</td>
                    <td className="px-4 py-2 border">
                      {service?.createdAt
                        ? new Date(service.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="View"
                          onClick={() => handleView(service._id)}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete"
                          onClick={() => handleDelete(service._id)}
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ServicesList;
