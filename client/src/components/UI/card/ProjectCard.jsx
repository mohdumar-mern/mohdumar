import { Github, ExternalLink } from "lucide-react";

const ProjectCard = ({
  image,
  title,
  description,
  techStack,
  githubLink,
  liveDemo,
}) => {
  const isLive = Boolean(liveDemo);

  return (
    <div
      className={`relative h-full flex flex-col border ${
        isLive
          ? "border-cyan-500/25 bg-gradient-to-b from-cyan-950/20 to-black"
          : "border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 to-black"
      } transition-colors duration-300`}
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)",
      }}
    >
      {/* Top accent line */}
      <div
        className={`h-[2px] w-full shrink-0 ${
          isLive ? "bg-cyan-400/60" : "bg-emerald-400/40"
        }`}
      />

      {/* Icon / image area — fixed height */}
      <div className="flex items-center justify-center h-40 px-6 shrink-0">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <span className="text-5xl opacity-80">📦</span>
        )}
      </div>

      {/* Content — grows to fill remaining space */}
      <div className="flex flex-col flex-1 px-6 pb-6 font-mono">
        {/* Category + status row */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <span className="text-pink-400 text-[11px] uppercase tracking-widest truncate">
            {Array.isArray(techStack) ? techStack[0] : techStack || "Project"}
          </span>
          <span
            className={`flex items-center gap-1.5 text-[11px] uppercase tracking-widest shrink-0 ${
              isLive ? "text-cyan-300" : "text-emerald-400"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLive ? "bg-cyan-400" : "bg-emerald-400"
              }`}
            />
            {isLive ? "Live" : "In_Dev"}
          </span>
        </div>

        {/* Title — fixed lines */}
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 shrink-0">
          {title}
        </h3>

        {/* Description — clamped, consistent block height */}
        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 min-h-[3.75rem]">
          {description}
        </p>

        {/* Tech tags */}
        {Array.isArray(techStack) && techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
            {techStack.slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="border border-cyan-500/30 text-cyan-300 text-[11px] px-2.5 py-1 tracking-wide"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Spacer pushes links to bottom */}
        <div className="flex-1" />

        {/* Links — pinned to bottom */}
        <div className="flex items-center gap-5 text-[11px] uppercase tracking-widest pt-4 border-t border-white/5 shrink-0">
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              Github
            </a>
          )}
          {liveDemo && (
            <a
              href={liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live_Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;