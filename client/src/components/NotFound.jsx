import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <div className="min-h-[65vh] flex items-center justify-center bg-black px-6 font-mono">
      <div className="w-full max-w-xl border border-cyan-500/20 bg-black/80 p-8 sm:p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full border border-pink-500/30 bg-pink-500/10 p-4">
            <AlertTriangle className="w-10 h-10 text-pink-400" />
          </div>
        </div>

        <p className="text-pink-500 text-xs tracking-[0.3em] mb-4">
          // SYSTEM_RESPONSE_404
        </p>

        <h1 className="text-6xl font-extrabold text-white mb-4">
          404
        </h1>

        <h2 className="text-xl text-cyan-400 mb-4">
          Page Not Found
        </h2>

        <p className="text-sm text-gray-400 leading-7 mb-4">
          The page you're looking for doesn't exist or may have
          been moved.
        </p>

        <div className="text-xs text-gray-500 break-all mb-8">
          Requested path: {location.pathname}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to={isDashboardRoute ? "/dashboard" : "/"}
            className="inline-flex items-center justify-center gap-2 border border-cyan-500/40 px-5 py-3 text-xs uppercase tracking-widest text-cyan-400 hover:bg-cyan-400/10 transition"
          >
            <Home size={16} />
            {isDashboardRoute ? "Dashboard" : "Home"}
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border border-gray-700 px-5 py-3 text-xs uppercase tracking-widest text-gray-300 hover:border-cyan-500/40 transition"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;