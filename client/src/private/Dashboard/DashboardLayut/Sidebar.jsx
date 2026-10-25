// // import React from "react";
// // import {
// //   LogOut,
// //   Plus,
// //   User,
// //   Code2,
// //   LayoutDashboard,
// //   Contact,
// //   Briefcase,
// //   BookOpen,
// // } from "lucide-react";
// // import { useNavigate } from "react-router-dom";
// // import { useDispatch } from "react-redux";

// // import { logoutUser } from "../../../features/Auth/authSlice";
// // import SidebarItem from "./SidebarItem";

// // const Sidebar = () => {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();


// //   const tabs = [
// //     { label: "Dashboard", icon: LayoutDashboard, path: "" },
// //     { label: "Projects", icon: Code2, path: "projects" },
// //     { label: "Skills", icon: Plus, path: "skills" },
// //     { label: "Services", icon: Briefcase, path: "services" },
// //     { label: "Contacts", icon: Contact, path: "contacts" },
// //     { label: "Profile", icon: User, path: "profile" },
// //     { label: "Blogs", icon: BookOpen, path: "blogs" },  // ← yeh add karo
// //   ];

// //   const logoutHandler = () => {
// //     dispatch(logoutUser());
// //     navigate("/login");
// //   };

// //   return (
// //     <aside className="w-64 bg-black border-r border-cyan-500/15 p-6 hidden sm:block font-mono">
// //       {/* Eyebrow */}
// //       <div className="flex items-center gap-2 text-pink-500 text-[11px] uppercase tracking-widest mb-2">
// //         <span>//</span>
// //         <span>Root_Access</span>
// //       </div>

// //       <h2 className="text-xl font-extrabold uppercase tracking-tight text-white mb-1">
// //         ADMIN{" "}
// //         <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
// //           PANEL
// //         </span>
// //       </h2>

// //       <div className="h-[2px] w-16 bg-gradient-to-r from-cyan-400 to-transparent mb-8" />

// //       <nav className="space-y-1">
// //         {tabs.map(({ label, icon, path }) => (
// //           <SidebarItem key={label} to={path} icon={icon} label={label} />
// //         ))}
// //       </nav>

// //       <div className="mt-10 pt-6 border-t border-cyan-500/10">
// //         <button
// //           onClick={logoutHandler}
// //           className="flex items-center gap-2 text-pink-400 hover:text-pink-300 text-sm uppercase tracking-widest font-semibold transition"
// //         >
// //           <LogOut className="w-4 h-4" />
// //           Logout
// //         </button>
// //       </div>
// //     </aside>
// //   );
// // };

// // export default Sidebar;
// import React from "react";
// import {
//   LogOut,
//   Plus,
//   User,
//   Code2,
//   LayoutDashboard,
//   Contact,
//   Briefcase,
//   BookOpen,
//   Users,
//   FolderKanban,
//   FileCheck,
//   Receipt,
//   Wallet,
//   ClipboardCheck,
//   CalendarClock,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";

// import { logoutUser } from "../../../features/Auth/authSlice";
// import SidebarItem from "./SidebarItem";

// const Sidebar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const tabs = [
//     // Existing portfolio management
//     { label: "Dashboard", icon: LayoutDashboard, path: "" },
//     { label: "Projects", icon: Code2, path: "projects" },
//     { label: "Skills", icon: Plus, path: "skills" },
//     { label: "Services", icon: Briefcase, path: "services" },
//     { label: "Contacts", icon: Contact, path: "contacts" },
//     { label: "Profile", icon: User, path: "profile" },
//     { label: "Blogs", icon: BookOpen, path: "blogs" },

//     // Freelance business management
//     { label: "Clients & Leads", icon: Users, path: "leads" },
//     {
//       label: "Client Projects",
//       icon: FolderKanban,
//       path: "client-projects",
//     },
//     { label: "Agreements", icon: FileCheck, path: "agreements" },
//     { label: "Invoices", icon: Receipt, path: "invoices" },
//     { label: "Payments", icon: Wallet, path: "payments" },
//     {
//       label: "Handover",
//       icon: ClipboardCheck,
//       path: "handover",
//     },
//     {
//       label: "Maintenance",
//       icon: CalendarClock,
//       path: "maintenance",
//     },
//   ];

//   const logoutHandler = () => {
//     dispatch(logoutUser());
//     navigate("/login");
//   };

//   return (
//     <aside className="w-64 shrink-0 bg-black border-r border-cyan-500/15 p-6 hidden sm:block font-mono">
//       {/* Eyebrow */}
//       <div className="flex items-center gap-2 text-pink-500 text-[11px] uppercase tracking-widest mb-2">
//         <span>//</span>
//         <span>Root_Access</span>
//       </div>

//       <h2 className="text-xl font-extrabold uppercase tracking-tight text-white mb-1">
//         ADMIN{" "}
//         <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
//           PANEL
//         </span>
//       </h2>

//       <div className="h-[2px] w-16 bg-gradient-to-r from-cyan-400 to-transparent mb-8" />

//       <nav className="space-y-1">
//         {tabs.map(({ label, icon, path }) => (
//           <SidebarItem
//             key={label}
//             to={path}
//             icon={icon}
//             label={label}
//           />
//         ))}
//       </nav>

//       {/* Logout */}
//       <div className="mt-10 pt-6 border-t border-cyan-500/10">
//         <button
//           onClick={logoutHandler}
//           className="flex items-center gap-2 text-pink-400 hover:text-pink-300 text-sm uppercase tracking-widest font-semibold transition"
//         >
//           <LogOut className="w-4 h-4" />
//           Logout
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

import {
  LogOut,
  Plus,
  User,
  Code2,
  LayoutDashboard,
  Contact,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../features/Auth/authSlice";
import SidebarItem from "./SidebarItem";

const tabs = [
  { label: "Dashboard", icon: LayoutDashboard, path: "" },
  { label: "Projects", icon: Code2, path: "projects" },
  { label: "Skills", icon: Plus, path: "skills" },
  { label: "Services", icon: Briefcase, path: "services" },
  { label: "Contacts", icon: Contact, path: "contacts" },
  { label: "Profile", icon: User, path: "profile" },
  { label: "Blogs", icon: BookOpen, path: "blogs" },
  { label: "Clients & Leads", icon: Users, path: "leads" },
  { label: "Client Projects", icon: FolderKanban, path: "client-projects" },
  { label: "Agreements", icon: FileCheck, path: "agreements" },
  { label: "Invoices", icon: Receipt, path: "invoices" },
  { label: "Payments", icon: Wallet, path: "payments" },
  { label: "Handover", icon: ClipboardCheck, path: "handover" },
  { label: "Maintenance", icon: CalendarClock, path: "maintenance" },
];

const Sidebar = ({ collapsed = false, mobile = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const iconOnly = collapsed && !mobile;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-black font-mono">
      <div className={`${iconOnly ? "px-2 pt-4" : "px-5 pt-5"} pb-4`}>
        {!iconOnly && (
          <>
            <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-pink-500">
              <span>//</span>
              <span>Root_Access</span>
            </div>
            <h2 className="mb-1 text-xl font-extrabold uppercase tracking-tight text-white">
              ADMIN{" "}
              <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
                PANEL
              </span>
            </h2>
            <div className="mb-3 h-[2px] w-16 bg-gradient-to-r from-cyan-400 to-transparent" />
          </>
        )}
        {iconOnly && (
          <div className="flex justify-center text-sm font-extrabold text-cyan-300" title="Admin Panel">
            A<span className="text-white">.</span>
          </div>
        )}
      </div>

      <nav
        aria-label="Dashboard navigation"
        className={`flex-1 space-y-1 pb-4 ${iconOnly ? "px-2" : "px-3"}`}
      >
        {tabs.map(({ label, icon, path }) => (
          <SidebarItem
            key={label}
            to={path}
            icon={icon}
            label={label}
            collapsed={iconOnly}
          />
        ))}
      </nav>

      <div className={`mt-auto border-t border-cyan-500/10 py-4 ${iconOnly ? "px-2" : "px-5"}`}>
        <button
          type="button"
          onClick={logoutHandler}
          title={iconOnly ? "Logout" : undefined}
          aria-label="Logout"
          className={`group relative flex min-h-10 w-full items-center rounded-sm text-sm font-semibold uppercase tracking-widest text-pink-400 transition hover:bg-pink-500/10 hover:text-pink-300 ${
            iconOnly ? "justify-center px-0" : "gap-3 px-3"
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!iconOnly && <span>Logout</span>}
          {iconOnly && (
            <span className="pointer-events-none absolute left-full top-1/2 z-[120] ml-3 -translate-y-1/2 whitespace-nowrap border border-cyan-500/20 bg-[#05090d] px-3 py-2 text-xs normal-case tracking-normal text-cyan-200 opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100">
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
