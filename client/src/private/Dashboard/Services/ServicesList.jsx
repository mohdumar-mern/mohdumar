import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Helmet } from "react-helmet-async";

import {
  deleteservice,
  fetchServices,
} from "../../../features/service/serviceSlice";
import Skeleton from "../../../components/UI/Skeleton/TableSkeleton";

const ServicesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { services, loading, error, message } = useSelector(
    (state) => state.service
  );

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

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

      <div className="font-mono">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2 text-pink-500 text-[11px] uppercase tracking-widest">
              <span>//</span>
              <span>Registry</span>
            </div>
            <h2 className="text-xl font-bold uppercase tracking-tight text-white mt-1">
              Services_List
            </h2>
          </div>
          <button
            onClick={handleAddService}
            className="flex items-center gap-2 bg-cyan-400 text-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-cyan-300 transition"
            style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)" }}
          >
            <Plus className="w-4 h-4" />
            Add_Service
          </button>
        </div>

        {/* Feedback Message */}
        {message && !loading && (
          <div className="mb-4 px-4 py-3 border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm text-center">
            {message}
          </div>
        )}
        {error && !loading && (
          <div className="mb-4 px-4 py-3 border border-pink-500/30 bg-pink-500/10 text-pink-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && <Skeleton rows={6} cols={4} />}

        {/* Empty state */}
        {!loading && services?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm uppercase tracking-widest">
              No_services_found
            </p>
            <button
              onClick={handleAddService}
              className="mt-3 text-cyan-400 hover:text-cyan-300 text-xs uppercase tracking-widest transition"
            >
              + Add_Your_First_Service
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && services?.length > 0 && (
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
              <tbody>
                {services.map((service, index) => (
                  <tr
                    key={service?._id}
                    className="hover:bg-cyan-500/5 text-gray-300 border-b border-cyan-500/10"
                  >
                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 text-white">{service?.title}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {service?.createdAt
                        ? new Date(service.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center items-center gap-4">
                        <button
                          className="text-emerald-400 hover:text-emerald-300 transition"
                          title="View"
                          onClick={() => handleView(service._id)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="text-pink-400 hover:text-pink-300 transition"
                          title="Delete"
                          onClick={() => handleDelete(service._id)}
                        >
                          <Trash size={16} />
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