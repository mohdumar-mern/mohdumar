import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, Mail, Phone, MessageSquareText, Clock } from "lucide-react";

import { Helmet } from "react-helmet-async";
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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="p-6 text-center font-mono">
        <p className="text-pink-500 text-sm">
          {error || "Contact not found."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center gap-1 text-gray-400 hover:text-cyan-400 text-sm uppercase tracking-widest transition"
        >
          <ChevronLeft size={16} />
          Back_to_List
        </button>
      </div>
    );
  }

  const detailRows = [
    { icon: Mail, label: "Email", value: contact.email },
    { icon: Phone, label: "Phone", value: contact.phone },
    { icon: MessageSquareText, label: "Message", value: contact.message },
    {
      icon: Clock,
      label: "Received",
      value: contact.createdAt
        ? new Date(contact.createdAt).toLocaleString()
        : "N/A",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Detail | Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-3xl mx-auto font-mono">
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
            <span>Message_Record</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
            {contact.name || "N/A"}
          </h2>

          <div className="space-y-0">
            {detailRows.map(({ icon: Icon, label, value }, i) => (
              <div
                key={i}
                className="flex items-start gap-4 border border-cyan-500/15 px-4 py-4 -mt-px"
              >
                <Icon className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-gray-500 mb-1">
                    {label}
                  </div>
                  <div className="text-sm text-gray-300 leading-relaxed">
                    {value || "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactDetail;