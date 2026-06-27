import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, Trash, X } from "lucide-react";

import { Helmet } from "react-helmet-async";

import {
  deleteContactMessage,
  fetchContacts,
  clearContactStatus,
} from "../../../features/Contact/contactSlice";

import Pagination from "../../../components/UI/pagination/Pagination";
import Skeleton from "../../../components/UI/Skeleton/TableSkeleton";

const ContactList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    contacts,
    loading,
    error,
    message,
    currentPage,
    totalPages,
    contactPerPage,
  } = useSelector((state) => state.contact);

  useEffect(() => {
    dispatch(fetchContacts({ page: currentPage, limit: contactPerPage }));
  }, [dispatch, currentPage, contactPerPage]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(clearContactStatus());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  const handleDelete = useCallback(
    (id) => {
      if (
        window.confirm("Are you sure you want to delete this contact message?")
      ) {
        dispatch(deleteContactMessage(id))
          .unwrap()
          .then(() => {
            dispatch(
              fetchContacts({ page: currentPage, limit: contactPerPage })
            );
          })
          .catch((err) => console.error("Failed to delete contact:", err));
      }
    },
    [dispatch, currentPage, contactPerPage]
  );

  const handlePageChange = useCallback(
    (page) => {
      if (page > 0 && page <= totalPages) {
        dispatch(fetchContacts({ page, limit: contactPerPage }));
      }
    },
    [dispatch, totalPages, contactPerPage]
  );

  return (
    <div className="font-mono">
      <Helmet>
        <title>Contact Messages | Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-pink-500 text-[11px] uppercase tracking-widest">
          <span>//</span>
          <span>Inbox</span>
        </div>
        <h2 className="text-xl font-bold uppercase tracking-tight text-white mt-1">
          Contact_Messages
        </h2>
      </div>

      {/* Status Message */}
      {(message || error) && (
        <div
          className={`mb-4 px-4 py-3 border text-sm relative pr-10 ${
            error
              ? "border-pink-500/30 bg-pink-500/10 text-pink-300"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {message || error}
          <button
            onClick={() => dispatch(clearContactStatus())}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition"
            aria-label="Close message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && <Skeleton rows={6} cols={4} />}

      {/* Empty State */}
      {!loading && contacts?.length === 0 && (
        <p className="text-center text-gray-500 text-sm uppercase tracking-widest">
          No_messages_found
        </p>
      )}

      {/* Table */}
      {!loading && contacts?.length > 0 && (
        <div className="overflow-x-auto border border-cyan-500/15">
          <table className="min-w-full text-sm">
            <thead className="bg-cyan-500/5 text-cyan-300 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-4 py-3 text-left" scope="col">
                  Sr_No
                </th>
                <th className="px-4 py-3 text-left" scope="col">
                  Name
                </th>
                <th className="px-4 py-3 text-left" scope="col">
                  Email
                </th>
                <th className="px-4 py-3 text-center" scope="col">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr
                  key={contact._id}
                  className="hover:bg-cyan-500/5 text-gray-300 border-b border-cyan-500/10"
                >
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 text-white">{contact.name}</td>
                  <td className="px-4 py-3 text-gray-400">{contact.email}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-center gap-4">
                      <button
                        title="View"
                        aria-label="View Contact"
                        className="text-emerald-400 hover:text-emerald-300 transition"
                        onClick={() =>
                          navigate(`/dashboard/contacts/${contact._id}/view`)
                        }
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        title="Delete"
                        aria-label="Delete Contact"
                        className="text-pink-400 hover:text-pink-300 transition"
                        onClick={() => handleDelete(contact._id)}
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
  );
};

export default ContactList;