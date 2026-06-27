import React from "react";
import { Code, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ title, category, imageUrl, description }) => {
  const navigate = useNavigate();

  const handleHireClick = () => {
    navigate("/contact-us", {
      state: { subject: `I'm interested in your service: ${title}` },
    });
  };

  return (
    <div
      className="relative h-full flex flex-col border border-cyan-500/20 bg-gradient-to-b from-cyan-950/15 to-black hover:border-cyan-400/40 transition-colors duration-300 font-mono"
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
      }}
    >
      {/* Top accent line */}
      <div className="h-[2px] w-full bg-cyan-400/50 shrink-0" />

      {/* Content */}
      <div className="flex flex-col items-center flex-1 px-6 pt-8 pb-4 text-center">
        {/* Avatar / Icon */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            width="80"
            height="80"
            loading="lazy"
            decoding="async"
            fetchPriority="high"
            className="w-16 h-16 rounded-full object-cover border-2 border-cyan-500/40 shadow-[0_0_16px_rgba(34,211,238,0.25)] mb-4"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.25)] mb-4">
            <Code className="w-7 h-7" />
          </div>
        )}

        {/* Category tag */}
        <span className="text-pink-400 text-[11px] uppercase tracking-widest mb-2">
          {category || "Service"}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 min-h-[3.75rem]">
          {description || "No description provided."}
        </p>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleHireClick}
        className="group w-full flex items-center justify-center gap-2 bg-cyan-400 text-black text-xs font-bold uppercase tracking-widest py-3 hover:bg-cyan-300 transition-colors shrink-0"
      >
        Hire_Me
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
};

export default ServiceCard;