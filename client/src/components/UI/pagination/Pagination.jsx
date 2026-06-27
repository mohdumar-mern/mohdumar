// components/UI/Pagination.js
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 my-4 font-mono">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1.5 px-4 py-2 border border-cyan-500/20 text-gray-300 text-xs uppercase tracking-widest hover:border-cyan-400/50 hover:text-cyan-300 transition disabled:opacity-30 disabled:hover:border-cyan-500/20 disabled:hover:text-gray-300 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={14} />
        Prev
      </button>

      <span className="text-xs uppercase tracking-widest text-gray-500">
        Page <span className="text-cyan-300">{currentPage}</span> /{" "}
        <span className="text-cyan-300">{totalPages}</span>
      </span>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1.5 px-4 py-2 border border-cyan-500/20 text-gray-300 text-xs uppercase tracking-widest hover:border-cyan-400/50 hover:text-cyan-300 transition disabled:opacity-30 disabled:hover:border-cyan-500/20 disabled:hover:text-gray-300 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default Pagination;