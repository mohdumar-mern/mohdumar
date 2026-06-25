import React from "react";
import {
  Github,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";

// Icon mapping function
const getIcon = (platform) => {
  switch (platform) {
    case "github":
      return <Github size={30} />;
    case "linkedin":
      return <LinkedinIcon  size={30} color="#1f7ce0" />;
    case "twitter":
      return <TwitterIcon size={30} />;
    case "instagram":
      return <InstagramIcon size={30} color="#E1306C" />;
    case "youtube":
      return <YoutubeIcon size={30} color="#FF0000" />;
    default:
      return null;
  }
};

const SocialLinksCard = ({ socialLinks, color = "bg-zinc-800/70" }) => {
  return (
    <div
      className={`w-fit p-4 rounded-xl shadow-md backdrop-blur-sm ${color}`}
    >
      <div className="flex  gap-5">
        {Object.entries(socialLinks || {}).map(([platform, url]) => (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-zinc-200 hover:text-blue-400 transition-all duration-300"
          >
            <span className="transform hover:scale-125 duration-300">
              {getIcon(platform)}
            </span>
            {/* <span className="capitalize font-medium">{platform}</span> */}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinksCard;
