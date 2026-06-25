import React from "react";
import { Code } from "lucide-react"; // fallback icon

const SkillCard = ({ title, level, imageUrl, category }) => {
  return (
    <div className="bg-[#0F0F0F] rounded-2xl w-64 border border-orange-500 shadow-[inset_0_-2px_4px_rgba(255,255,255,0.1),8px_8px_20px_rgba(249,115,22,0.3),-8px_-8px_20px_rgba(255,255,255,0.03)] transition-all duration-500 hover:scale-[1.03] hover:shadow-[inset_0_-2px_4px_rgba(255,255,255,0.1),12px_12px_30px_rgba(249,115,22,0.5),-12px_-12px_30px_rgba(255,255,255,0.05)] transform">
      <div className="flex items-center justify-center pt-6">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            fetchpriority="high"
            className="w-24 h-24 rounded-full object-cover border-2 border-orange-500 shadow-[0_4px_10px_rgba(249,115,22,0.4)]"
          />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-orange-500 text-white shadow-md">
            <Code className="w-12 h-12" />
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-white text-center mt-4">{title}</h3>
      <p className="text-sm text-orange-300 text-center mb-4">{category}</p>

      <div className="text-center pb-6">
        <span className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
          Level: {level}
        </span>
      </div>
    </div>
  );
};

export default SkillCard;
