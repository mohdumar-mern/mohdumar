// Sidebar.jsx
import React from 'react';
import {
  LogOut,
  Plus,
  User,
  FileText,
  Code2,
  Link as LinkIcon,
  LayoutDashboard,
  Contact,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logoutUser } from '../../../features/Auth/authSlice';
import SidebarItem from './SidebarItem';

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
  ];

  const logoutHandler = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-black border-r p-6 hidden sm:block">
      <h2 className="text-2xl font-bold text-orange-500 mb-6 tracking-wide">
        Admin Panel
      </h2>
      <nav className="space-y-3">
        {tabs.map(({ label, icon, path }) => (
          <SidebarItem key={label} to={path} icon={icon} label={label} />
        ))}
      </nav>

      <div className="mt-10">
        <button
          onClick={logoutHandler}
          className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-800 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
