import { NavLink } from "react-router-dom";

const SidebarItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition hover:bg-[#222] ${
          isActive ? "bg-orange-200 text-orange-600 font-semibold" : "text-gray-300"
        }`
      }
    >
      <Icon className="w-5 h-5" />
      {label}
    </NavLink>
  );
  
  export default SidebarItem