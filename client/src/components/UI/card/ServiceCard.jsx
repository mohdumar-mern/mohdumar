import React from "react";
import { Code } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ title, category, imageUrl, description }) => {
  const navigate = useNavigate();

  const handleHireClick = () => {
    navigate("/contact-us", {
      state: { subject: `I'm interested in your service: ${title}` },
    });
  };

  return (
    <div className="bg-[#0F0F0F] rounded-2xl w-full max-w-xs h-[390px] border border-orange-500 shadow-[inset_0_-2px_4px_rgba(255,255,255,0.05),8px_8px_20px_rgba(249,115,22,0.2),-8px_-8px_20px_rgba(255,255,255,0.02)] hover:scale-[1.03] hover:shadow-[inset_0_-2px_4px_rgba(255,255,255,0.05),12px_12px_30px_rgba(249,115,22,0.4),-12px_-12px_30px_rgba(255,255,255,0.05)] transition-transform duration-500 transform flex flex-col justify-between">
      
      {/* Card Content */}
      <div className="flex flex-col items-center p-6 flex-grow">
        {/* Avatar or Icon */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            width="200"
            height="200"
            loading="lazy"
            decoding="async"
            fetchpriority="high"
            className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shadow-[0_4px_10px_rgba(249,115,22,0.4)] mb-4"
          />
        ) : (
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-orange-500 text-white shadow-md mb-4">
            <Code className="w-10 h-10" />
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-semibold text-white text-center mb-1">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-orange-300 text-center mb-3 line-clamp-3 min-h-[60px]">
          {description || "No description provided."}
        </p>

        {/* Category */}
        <p className="text-sm text-gray-400 mb-2">
          <span className="font-semibold text-orange-400">Category:</span>{" "}
          {category}
        </p>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleHireClick}
        className="w-full bg-orange-500 text-white font-medium py-2 rounded-b-2xl hover:bg-orange-600 transition"
      >
        Hire Me for this Service
      </button>
    </div>
  );
};

export default ServiceCard;
