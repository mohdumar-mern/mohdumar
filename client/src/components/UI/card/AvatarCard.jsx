import React from "react";
import avatar from "../../../assets/avatar.webp";

const AvatarCard = ({ size = "w-64 h-64", priority = false }) => {
  return (
    <div className="flex justify-center items-center">
      <div className={`relative ${size}`}>
        <span className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
        <span className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
        <span className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
        <span className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />

        <div className="relative overflow-hidden rounded-full border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.25)] w-full h-full">
          <img
            src={avatar}
            alt="Mohd Umar - MERN Stack Developer"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            className="
              w-full h-full object-cover object-top
              transition-all duration-500 ease-out
              hover:scale-110 hover:brightness-110 hover:drop-shadow-[0_0_16px_rgba(34,211,238,0.6)]
            "
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(AvatarCard);