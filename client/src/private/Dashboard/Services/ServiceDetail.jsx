import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { fetchSingleService } from "../../../features/service/serviceSlice";

import { Helmet } from "react-helmet-async";

const ServiceDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { service, loading, error } = useSelector((state) => state.service);

  useEffect(() => {
    if (id) dispatch(fetchSingleService(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-pink-500 py-8 text-sm font-mono">
        {error}
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center text-gray-500 py-8 text-sm uppercase tracking-widest font-mono">
        No_service_found
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${service?.title || "Service Detail"} | Mohd Umar`}</title>
        <meta
          name="description"
          content={service?.description?.substring(0, 150) || "Service details by Mohd Umar"}
        />
      </Helmet>

      <div className="max-w-3xl mx-auto font-mono">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-cyan-400 text-sm uppercase tracking-widest mb-6 inline-flex items-center transition"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back_to_Services
        </button>

        <div
          className="border border-cyan-500/15 bg-gradient-to-b from-cyan-950/10 to-black p-6 sm:p-8"
          style={{
            clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)",
          }}
        >
          <div className="flex items-center gap-2 text-pink-500 text-[11px] uppercase tracking-widest mb-2">
            <span>//</span>
            <span>Service_Record</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-5">
            {service.title}
          </h1>

          {service?.file?.url && (
            <img
              src={service.file.url}
              alt={service.title}
              loading="lazy"
              decoding="async"
              fetchPriority="high"
              className="w-32 h-32 rounded-full object-cover border-2 border-cyan-500/40 shadow-[0_0_16px_rgba(34,211,238,0.25)] mb-6"
            />
          )}

          <div className="text-sm mb-2">
            <span className="text-xs uppercase tracking-widest text-gray-500">
              Category:{" "}
            </span>
            <span className="text-cyan-300">{service.category || "N/A"}</span>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mt-3 mb-2">
            {service.description || "N/A"}
          </p>

          <div className="text-sm mb-6">
            <span className="text-xs uppercase tracking-widest text-gray-500">
              Date_Added:{" "}
            </span>
            <span className="text-cyan-300">
              {service.createdAt
                ? new Date(service.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetail;