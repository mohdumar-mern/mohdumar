import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import HeaderContainer from "../UI/Container/HeaderContainer";

export const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Skills", path: "/skills" },
  { label: "Services", path: "/services" },
  { label: "Contact Us", path: "/contact-us" },
];

const HeaderComponents = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-black/60 backdrop-blur-md shadow-md border-b border-orange-600 fixed top-0 z-50 w-full font-sans">
      <HeaderContainer>
        <nav className="flex justify-between items-center py-3">
          {/* Logo */}
          <NavLink to="/" className="text-white text-2xl font-bold tracking-wide">
            Mohammad <span className="text-orange-500">Umar</span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-4">
            <ul className="flex gap-6 text-sm">
              {navItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? "text-orange-800 bg-white font-medium px-4 py-2 rounded-lg"
                        : "text-gray-300 hover:text-orange-500 transition-colors"
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <NavLink
              to="/login"
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              Login
            </NavLink>
          </div>

          {/* Mobile Nav Toggle */}
          <button
            onClick={handleToggle}
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
            className="lg:hidden text-white focus:outline-none"
          >
            <Menu size={28} />
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden bg-[#1C1C1C] px-4 pb-4">
            <ul className="flex flex-col gap-3 text-[16px] font-medium">
              {navItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      isActive
                        ? "block text-orange-500 font-semibold px-2 py-2"
                        : "block text-gray-300 hover:text-orange-500 px-2 py-2 transition-colors"
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="block bg-orange-700 hover:bg-orange-800 text-white text-center px-4 py-2 rounded-lg font-semibold mt-2 transition-colors duration-200"
                >
                  Login
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </HeaderContainer>
    </header>
  );
};

export default HeaderComponents;
