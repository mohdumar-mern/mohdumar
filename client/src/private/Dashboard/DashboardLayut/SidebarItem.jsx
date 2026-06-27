import { NavLink } from "react-router-dom";

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 text-sm uppercase tracking-widest font-mono transition border-l-2 ${
        isActive
          ? "border-cyan-400 bg-cyan-500/10 text-cyan-300"
          : "border-transparent text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/5"
      }`
    }
  >
    <Icon className="w-4 h-4 shrink-0" />
    {label}
  </NavLink>
);

export default SidebarItem;