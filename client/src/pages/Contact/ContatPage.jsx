/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";

import Input from "../../components/UI/Input/Input";
import Container from "../../components/UI/Container/Container";

import {
  sendContactRequest,
  clearContactStatus,
} from "../../features/Contact/contactSlice";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const contactDetails = [
  { icon: Mail, label: "uk1941404@gmail.com", href: "mailto:uk1941404@gmail.com" },
  { icon: Phone, label: "+91 96287 87975", href: "tel:9628787975" },
  { icon: Linkedin, label: "linkedin.com/in/mohdumar-mern", href: "https://www.linkedin.com/in/mohd-umar-mern-stack-developer/" },
  { icon: Github, label: "github.com/mohdumar-mern", href: "https://github.com/mohdumar-mern" },
  { icon: MapPin, label: "Noida, Uttar Pradesh, India", href: null },
];

const ContactPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState(null);

  const { error, loading, message } = useSelector((state) => state.contact);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  }, []);

  const validateForm = () => {
    const { name, email, phone, message } = formData;
    if (!name || !email || !phone || !message) {
      return "Please fill in all fields.";
    }
    return null;
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validationError = validateForm();
      if (validationError) {
        setFormError(validationError);
        return;
      }
      const res = await dispatch(sendContactRequest(formData));
      if (res.meta.requestStatus === "fulfilled") {
        setFormData(initialFormState);
      }
    },
    [dispatch, formData]
  );

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearContactStatus());
    }
    if (error) {
      toast.error(error);
      dispatch(clearContactStatus());
    }
  }, [message, error, dispatch]);

  useEffect(() => {
    return () => dispatch(clearContactStatus());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Contact | Mohd Umar - MERN Stack Developer</title>
        <meta
          name="description"
          content="Get in touch with Mohd Umar. Send your queries or project requests directly via the contact form."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://umarportfolio-frontend.vercel.app/contact" />
        <meta property="og:title" content="Contact Mohd Umar" />
        <meta
          property="og:description"
          content="Reach out to Mohd Umar via email or phone. Available for freelance MERN Stack development work."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Manual CSS animations — no framer-motion dependency on this page */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-slide-up {
          opacity: 0;
          animation: fadeSlideUp 0.6s ease-out forwards;
        }
        .btn-hover-scale {
          transition: transform 0.2s ease-out;
        }
        .btn-hover-scale:hover {
          transform: scale(1.03);
        }
      `}</style>

      <Container>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full items-start font-mono py-10">
          {/* 🔹 Left: Intro + Contact Details */}
          <div>
            {/* Eyebrow */}
            <div
              className="flex items-center gap-2 text-pink-500 text-xs uppercase tracking-widest fade-slide-up"
              style={{ animationDelay: "0s" }}
            >
              <span>//</span>
              <span>Establish_Connection</span>
            </div>

            {/* Heading */}
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white mt-3 fade-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              CONTACT{" "}
              <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.6)]">
                NODE
              </span>
            </h1>

            {/* Underline accent */}
            <div
              className="h-[2px] w-28 bg-gradient-to-r from-cyan-400 to-transparent mt-4 mb-10 fade-slide-up"
              style={{ animationDelay: "0.2s" }}
            />

            <h2
              className="text-xl md:text-2xl font-bold text-white mb-4 fade-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              Let's build something.
            </h2>

            <p
              className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-md fade-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              Open to full-time roles, freelance projects, or just a great
              conversation about tech. Send a transmission and I'll respond
              within 24 hours.
            </p>

            {/* Contact list */}
            <ul className="space-y-0 max-w-md">
              {contactDetails.map(({ icon: Icon, label, href }, index) => {
                const content = (
                  <div className="flex items-center gap-4 border border-cyan-500/15 px-4 py-4 hover:border-cyan-400/40 hover:bg-cyan-500/5 transition-colors duration-300">
                    <Icon className="w-4 h-4 text-pink-400 shrink-0" />
                    <span className="text-sm text-gray-300 tracking-wide">
                      {label}
                    </span>
                  </div>
                );
                return (
                  <li
                    key={index}
                    className="-mt-px fade-slide-up"
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  >
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 🔸 Right: Form */}
          <div className="fade-slide-up" style={{ animationDelay: "0.2s" }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {formError && (
                <p className="text-pink-500 text-sm">{formError}</p>
              )}

              <Input
                label="Operator_Name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
              />
              <Input
                label="Comms_Channel"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                label="Direct_Line"
                name="phone"
                type="tel"
                placeholder="Your phone number"
                value={formData.phone}
                onChange={handleChange}
              />

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs uppercase tracking-widest text-gray-500 mb-2"
                >
                  Transmission
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  placeholder="Your message..."
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0a0f17] border border-cyan-500/15 text-cyan-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition resize-none"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-hover-scale bg-cyan-400 text-black font-bold uppercase tracking-widest text-sm py-3 px-8 hover:bg-cyan-300 transition disabled:opacity-50"
                style={{
                  clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)",
                }}
              >
                {loading ? "Sending..." : "Send Transmission"}
              </button>
            </form>
          </div>
        </section>
      </Container>
    </>
  );
};

export default memo(ContactPage);