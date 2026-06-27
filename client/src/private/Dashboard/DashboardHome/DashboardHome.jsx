import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, Activity, CheckCircle } from "lucide-react";
import AvatarCard from "../../../components/UI/card/AvatarCard";

import { Helmet } from "react-helmet-async";

const DashboardCard = ({ icon: Icon, text, accent, onClick }) => (
  <button
    onClick={onClick}
    className="group relative flex items-center gap-4 w-full text-left p-5 border border-cyan-500/20 bg-gradient-to-b from-cyan-950/15 to-black hover:border-cyan-400/40 transition-colors duration-300 focus:outline-none"
    style={{
      clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
    }}
    aria-label={text}
  >
    <span
      className={`flex items-center justify-center w-11 h-11 rounded-full border-2 shrink-0 ${accent.ring} ${accent.bg}`}
    >
      <Icon className={`w-5 h-5 ${accent.text}`} />
    </span>
    <span className="text-sm text-gray-300 font-mono tracking-wide group-hover:text-cyan-200 transition-colors">
      {text}
    </span>
  </button>
);

const DashboardHome = () => {
  const navigate = useNavigate();

  const goToProfile = useCallback(() => {
    navigate("/dashboard/profile");
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Dashboard | Mohd Umar</title>
        <meta
          name="description"
          content="Admin dashboard overview page for Mohd Umar's portfolio."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="p-6 sm:p-8 border border-cyan-500/15 bg-gradient-to-b from-cyan-950/10 to-black space-y-8 font-mono">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 text-pink-500 text-xs uppercase tracking-widest">
          <span>//</span>
          <span>Operator_Console</span>
        </div>

        {/* Welcome */}
        <div className="flex items-center gap-4">
          <AvatarCard size="w-16 h-16" />
          <div>
            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white">
              Welcome back,{" "}
              <span className="text-cyan-400 drop-shadow-[0_0_14px_rgba(34,211,238,0.5)]">
                Umar
              </span>
            </h1>
            <div className="h-[2px] w-20 bg-gradient-to-r from-cyan-400 to-transparent mt-2" />
          </div>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
          Here's a quick snapshot of your dashboard. Manage your portfolio,
          track your activity, and stay up to date — all in one place.
        </p>

        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <DashboardCard
            icon={Activity}
            text="Monitor recent activity"
            accent={{
              ring: "border-cyan-500/40",
              bg: "bg-cyan-500/10",
              text: "text-cyan-300",
            }}
          />
          <DashboardCard
            icon={CheckCircle}
            text="Review completed tasks"
            accent={{
              ring: "border-emerald-500/40",
              bg: "bg-emerald-500/10",
              text: "text-emerald-400",
            }}
          />
          <DashboardCard
            icon={UserCircle}
            text="Update your profile info"
            accent={{
              ring: "border-pink-500/40",
              bg: "bg-pink-500/10",
              text: "text-pink-400",
            }}
            onClick={goToProfile}
          />
        </div>
      </section>
    </>
  );
};

export default memo(DashboardHome);