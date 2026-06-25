import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Helmet } from 'react-helmet-async';
import { fetchSingleContact } from "../../../features/Contact/contactSlice";

const ContactDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contact, loading, error } = useSelector((state) => state.contact);

  useEffect(() => {
    if (id) dispatch(fetchSingleContact(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error || "Contact not found."}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-orange-500 hover:underline"
        >
          ⬅ Back to Contact List
        </button>
      </div>
    );
  }

  return (
    <>
      {/* 🔹 SEO */}
      <Helmet>
        <title>Contact Detail | Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-4 bg-[#0e0e0e]">
        <h2 className="text-2xl font-bold text-orange-500 mb-6">Contact Details</h2>

        <div className="space-y-4 text-gray-300 text-lg">
          <p>
            <strong className="text-orange-400">Name:</strong> {contact.name || "N/A"}
          </p>
          <p>
            <strong className="text-orange-400">Email:</strong> {contact.email || "N/A"}
          </p>
          <p>
            <strong className="text-orange-400">Phone:</strong> {contact.phone || "N/A"}
          </p>
          <p>
            <strong className="text-orange-400">Message:</strong> {contact.message || "N/A"}
          </p>
          <p>
            <strong className="text-orange-400">Created At:</strong>{" "}
            {contact.createdAt
              ? new Date(contact.createdAt).toLocaleString()
              : "N/A"}
          </p>
        </div>

        <div className="mt-6 flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            ⬅ Back to Contact List
          </button>
        </div>
      </div>
    </>
  );
};

export default ContactDetail;
