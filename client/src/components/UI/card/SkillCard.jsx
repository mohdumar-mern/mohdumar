import React from "react";
import { Code } from "lucide-react"; // fallback icon

const SkillCard = ({ title, level, imageUrl, category }) => {
  return (
    <div
      className="relative h-full flex flex-col border border-cyan-500/20 bg-gradient-to-b from-cyan-950/15 to-black hover:border-cyan-400/40 transition-colors duration-300 font-mono"
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)",
      }}
    >
      {/* Top accent line */}
      <div className="h-[2px] w-full bg-cyan-400/50 shrink-0" />

      <div className="flex flex-col items-center flex-1 px-5 pt-7 pb-6 text-center">
        {/* Icon / Image */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            fetchPriority="high"
            className="w-20 h-20 rounded-full object-cover border-2 border-cyan-500/40 shadow-[0_0_16px_rgba(34,211,238,0.25)] mb-4"
          />
        ) : (
          <div className="w-20 h-20 flex items-center justify-center rounded-full border-2 border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.25)] mb-4">
            <Code className="w-9 h-9" />
          </div>
        )}

        {/* Category tag */}
        {category && (
          <span className="text-pink-400 text-[11px] uppercase tracking-widest mb-2">
            {category}
          </span>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-4 line-clamp-1">
          {title}
        </h3>

        {/* Spacer pushes level badge to bottom */}
        <div className="flex-1" />

        {/* Level badge */}
        <span className="inline-flex items-center gap-2 border border-cyan-500/30 text-cyan-300 text-xs uppercase tracking-widest px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Level: {level}
        </span>
      </div>
    </div>
  );
};

export default SkillCard;