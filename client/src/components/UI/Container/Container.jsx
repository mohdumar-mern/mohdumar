import React from "react";

const Container = React.memo(({ children, className = "", style = {} }) => {
  return (
    <div
      className={`min-h-screen flex justify-center items-center py-20 md:py-20 lg:py-10 max-w-6xl mx-auto px-4 text-white ${className}`}
      style={style}
      aria-live="polite" // Ensures live updates are announced by screen readers (good for dynamic content)
    >
      {children}
    </div>
  );
});

export default Container;
