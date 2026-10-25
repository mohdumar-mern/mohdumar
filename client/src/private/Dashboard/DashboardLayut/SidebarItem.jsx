// import { NavLink } from "react-router-dom";

// const SidebarItem = ({ to, icon: Icon, label }) => (
//   <NavLink
//     to={to}
//     end
//     className={({ isActive }) =>
//       `flex items-center gap-3 px-4 py-2.5 text-sm uppercase tracking-widest font-mono transition border-l-2 ${
//         isActive
//           ? "border-cyan-400 bg-cyan-500/10 text-cyan-300"
//           : "border-transparent text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/5"
//       }`
//     }
//   >
//     <Icon className="w-4 h-4 shrink-0" />
//     {label}
//   </NavLink>
// );

// export default SidebarItem;

import { NavLink } from "react-router-dom";

const SidebarItem = ({ to, icon: Icon, label, collapsed = false }) => (
  <NavLink
    to={to}
    end
    title={collapsed ? label : undefined}
    aria-label={label}
    className={({ isActive }) =>
      `group relative flex min-h-11 w-full items-center rounded-sm border-l-2 transition ${
        collapsed ? "justify-center px-0" : "gap-3 px-3"
      } ${
        isActive
          ? "border-cyan-400 bg-cyan-500/10 text-cyan-300"
          : "border-transparent text-gray-400 hover:bg-cyan-500/5 hover:text-cyan-300"
      }`
    }
  >
    <Icon className="h-4 w-4 shrink-0" />
    {!collapsed && (
      <span className="min-w-0 truncate text-xs uppercase tracking-[0.12em] xl:text-sm">
        {label}
      </span>
    )}
    {collapsed && (
      <span className="pointer-events-none absolute left-full top-1/2 z-[120] ml-3 -translate-y-1/2 whitespace-nowrap border border-cyan-500/20 bg-[#05090d] px-3 py-2 text-xs uppercase tracking-wider text-cyan-200 opacity-0 shadow-xl transition group-hover:opacity-100 group-focus-visible:opacity-100">
        {label}
      </span>
    )}
  </NavLink>
);

export default SidebarItem;
