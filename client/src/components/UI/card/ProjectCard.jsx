import { Eye, Github, Calendar, CalendarClock } from "lucide-react";

// Format date to a readable string
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ProjectCard = ({
  image,
  title,
  description,
  techStack,
  githubLink,
  liveDemo,
  createdAt,
  updatedAt,
}) => {
  return (
    <div className="bg-[#0F0F0F] text-white rounded-2xl border border-orange-500 shadow-[8px_8px_20px_rgba(249,115,22,0.4),-4px_-4px_10px_rgba(255,255,255,0.05)] transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[12px_12px_30px_rgba(249,115,22,0.7)]">
      {/* Image */}
      <img
        src={image}
        alt={title}
        className="w-full  h-52 object-cover p-4 rounded-t-2xl transition-transform duration-300 hover:scale-105"
        loading="lazy"
          decoding="async"
          fetchpriority="high"
      />

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-2xl font-semibold mb-2 border-b border-slate-700 pb-2">
          {title}
        </h3>

        <p className="text-gray-300 text-sm mb-2 line-clamp-3">{description}</p>
        <p className="text-orange-300 text-xs font-mono mb-4">{techStack}</p>

        {/* Date Info */}
        <div className="text-gray-400 text-xs space-y-1 mb-5">
          {createdAt && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Created: {formatDate(createdAt)}</span>
            </div>
          )}
          {updatedAt && (
            <div className="flex items-center">
              <CalendarClock className="w-4 h-4 mr-1" />
              <span>Updated: {formatDate(updatedAt)}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-auto flex flex-col sm:flex-row gap-3">
          {liveDemo && (
            <a
              href={liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium transition duration-300"
            >
              <Eye className="w-4 h-4" />
              View Project
            </a>
          )}
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-orange-500 text-white px-4 py-2 rounded-md font-medium transition duration-300"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
