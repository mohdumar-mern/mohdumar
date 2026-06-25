import React from "react";
import resume from "../../../assets/resume.pdf";

const ResumeDownload = () => {
  const handleDownload = () => {
    if (resume) {
      window.open(resume, "_blank", "noopener,noreferrer");
    } else {
      console.error("Resume URL is not available.");
    }
  };

  return (
    <div className="text-center">
      {resume && (
        <button
          onClick={handleDownload}
          className="inline-block bg-cyan-400 text-black font-mono uppercase tracking-widest text-sm font-bold py-3 px-6 shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:bg-cyan-300 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-300"
          style={{ clipPath: "polygon(0 0, 100% 0, 92% 100%, 0% 100%)" }}
          aria-label="View or download resume"
        >
          View_Resume
        </button>
      )}
    </div>
  );
};

export default ResumeDownload;