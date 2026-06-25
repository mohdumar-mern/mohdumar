// components/UI/Pagination.js
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, style='text-white' }) => {
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-4 my-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-600 text-white rounded-md"
      >
        Prev
      </button>
      <span className={`${style}`}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-600 text-white rounded-md"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
