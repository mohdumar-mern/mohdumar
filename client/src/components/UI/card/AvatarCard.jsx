
import React from "react";
import avatar from "../../../assets/avatar.jpg";

const AvatarCard = ({ size = "w-64 h-64" }) => {

  return (
  <div className="flex justify-center items-center">
  <div
    className={`relative overflow-hidden rounded-full border-white border-2 shadow-xl ${size}`}
  >
    <img
      src={avatar}
      alt="User Avatar"
      loading="lazy"
      decoding="async"
      fetchpriority="high"
      className="
        w-full h-full object-cover object-top
        transition-all duration-500 ease-out
       hover:scale-125 hover:brightness-125 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]

      "
    />
  </div>
</div>

  );
};

export default React.memo(AvatarCard);
