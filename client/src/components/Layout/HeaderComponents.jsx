import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
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
    <header className="bg-black/80 backdrop-blur-md shadow-md border-b border-cyan-500/20 fixed top-0 z-50 w-full font-mono">
      <HeaderContainer>
        <nav className="flex justify-between items-center py-4">
          {/* Logo */}
          <NavLink
            to="/"
            className="text-white text-xl font-bold tracking-widest uppercase"
          >
            M<span className="text-cyan-400">.</span>UMAR
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex gap-8 text-xs uppercase tracking-widest">
              {navItems
                .filter((item) => item.path !== "/")
                .map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        isActive
                          ? "text-cyan-400"
                          : "text-gray-400 hover:text-cyan-400 transition-colors"
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
            </ul>

            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400 pl-6 border-l border-cyan-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              Available_for_hire
            </div>
          </div>

          {/* Mobile Nav Toggle */}
          <button
            onClick={handleToggle}
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
            className="lg:hidden text-cyan-400 focus:outline-none"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden bg-black/95 border-t border-cyan-500/20 px-4 pb-4">
            <ul className="flex flex-col gap-1 text-sm uppercase tracking-widest">
              {navItems
                .filter((item) => item.path !== "/")
                .map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.path}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "block text-cyan-400 px-2 py-3"
                          : "block text-gray-400 hover:text-cyan-400 px-2 py-3 transition-colors"
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              <li className="flex items-center gap-2 text-xs text-cyan-400 px-2 py-3 mt-2 border-t border-cyan-500/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                Available_for_hire
              </li>
            </ul>
          </div>
        )}
      </HeaderContainer>
    </header>
  );
};

export default HeaderComponents;