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
      return <Github size={30} color="#00f5ff"/>;
    case "linkedin":
      return <LinkedinIcon  size={30} color="#00f5ff" />;
    case "twitter":
      return <TwitterIcon size={30} color="#00f5ff" />;
    case "instagram":
      return <InstagramIcon size={30} color="#00f5ff" />;
    case "youtube":
      return <YoutubeIcon size={30} color="#00f5ff" />;
    default:
      return null;
  }
};

const SocialLinksCard = ({ socialLinks }) => {
  return (
    <div
     className="px-6 py-3 w-fit p-4 border border-cyan-500/40 text-cyan-400 uppercase tracking-widest text-sm font-bold transition-colors duration-300"
      // className={` rounded-xl shadow-md backdrop-blur-sm ${color}`}
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
