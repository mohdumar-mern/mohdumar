import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, Activity, CheckCircle } from "lucide-react";
import AvatarCard from "../../../components/UI/card/AvatarCard";

import { Helmet } from 'react-helmet-async';

const DashboardCard = ({ icon: Icon, text, bg, color, onClick }) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-lg shadow-sm flex items-center gap-3 w-full text-left transition hover:brightness-95 focus:outline-none ${bg}`}
    aria-label={text}
  >
    <Icon className={`${color}`} />
    <span className="text-sm text-gray-800">{text}</span>
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
        <meta name="description" content="Admin dashboard overview page for Mohd Umar's portfolio." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="p-6 rounded-xl bg-white shadow-md space-y-6 text-gray-800">
        <div className="text-2xl font-bold flex items-center gap-3">
          <AvatarCard size="w-16 h-16" />
          Welcome back, Umar!
        </div>

        <p className="text-gray-600 text-sm">
          Here's a quick snapshot of your dashboard. Manage your portfolio, track your activity,
          and stay up to date — all in one place.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DashboardCard
            icon={Activity}
            text="Monitor recent activity"
            bg="bg-indigo-100"
            color="text-indigo-600"
          />
          <DashboardCard
            icon={CheckCircle}
            text="Review completed tasks"
            bg="bg-green-100"
            color="text-green-600"
          />
          <DashboardCard
            icon={UserCircle}
            text="Update your profile info"
            bg="bg-yellow-100"
            color="text-yellow-600"
            onClick={goToProfile}
          />
        </div>
      </section>
    </>
  );
};

export default memo(DashboardHome);
