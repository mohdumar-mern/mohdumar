import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { fetchSingleService } from "../../../features/service/serviceSlice";

import { Helmet } from 'react-helmet-async';

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
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <>
      {/* ✅ SEO Helmet */}
      <Helmet>
        <title>{`${service?.title || "Service Detail"} | Mohd Umar`}</title>
        <meta
          name="description"
          content={service?.description?.substring(0, 150) || "Service details by Mohd Umar"}
        />
      </Helmet>

      <main className="max-w-3xl mx-auto p-6">
        <section className="bg-black rounded-2xl shadow-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-4 text-orange-500">
            {service.title}
          </h1>

          <div className="space-y-2 text-sm sm:text-base text-gray-300">
            <p>
              <strong>Category:</strong> {service.category || "N/A"}
            </p>
            <p>
              <strong>Description:</strong> {service.description || "N/A"}
            </p>
            <p>
              <strong>Date Added:</strong>{" "}
              {service.createdAt
                ? new Date(service.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          {service?.file?.url && (
            <div className="mt-6">
              <img
                src={service.file.url}
                alt={service.title}
                loading="lazy"
                decoding="async"
                fetchpriority="high"
                className="rounded-lg shadow-lg max-w-xs w-full"
              />
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white transition"
            >
              <ChevronLeft size={18} />
              Back to Services List
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default ServiceDetail;
