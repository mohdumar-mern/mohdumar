import React from "react";
import {
  LogOut,
  Plus,
  User,
  Code2,
  LayoutDashboard,
  Contact,
  Briefcase,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logoutUser } from "../../../features/Auth/authSlice";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const tabs = [
    { label: "Dashboard", icon: LayoutDashboard, path: "" },
    { label: "Projects", icon: Code2, path: "projects" },
    { label: "Skills", icon: Plus, path: "skills" },
    { label: "Services", icon: Briefcase, path: "services" },
    { label: "Contacts", icon: Contact, path: "contacts" },
    { label: "Profile", icon: User, path: "profile" },
    { label: "Blogs", icon: BookOpen, path: "blogs" },  // ← yeh add karo
  ];

  const logoutHandler = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-black border-r border-cyan-500/15 p-6 hidden sm:block font-mono">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 text-pink-500 text-[11px] uppercase tracking-widest mb-2">
        <span>//</span>
        <span>Root_Access</span>
      </div>

      <h2 className="text-xl font-extrabold uppercase tracking-tight text-white mb-1">
        ADMIN{" "}
        <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
          PANEL
        </span>
      </h2>

      <div className="h-[2px] w-16 bg-gradient-to-r from-cyan-400 to-transparent mb-8" />

      <nav className="space-y-1">
        {tabs.map(({ label, icon, path }) => (
          <SidebarItem key={label} to={path} icon={icon} label={label} />
        ))}
      </nav>

      <div className="mt-10 pt-6 border-t border-cyan-500/10">
        <button
          onClick={logoutHandler}
          className="flex items-center gap-2 text-pink-400 hover:text-pink-300 text-sm uppercase tracking-widest font-semibold transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;