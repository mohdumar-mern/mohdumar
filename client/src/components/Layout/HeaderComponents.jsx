
// export default HeaderComponents;
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import HeaderContainer from "../UI/Container/HeaderContainer";

export const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Skills", path: "/skills" },
  { label: "Services", path: "/services" },
  { label: "Blog", path: "/blog" },
  { label: "Contact Us", path: "/contact-us" },
];

const HeaderComponents = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const loginButtonClass =
    "inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest text-cyan-400 border border-cyan-500/40 rounded-md hover:bg-cyan-400/10 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all duration-300";

  return (
    <header className="bg-black/80 backdrop-blur-md shadow-md border-b border-cyan-500/20 fixed top-0 z-50 w-full font-mono">
      <HeaderContainer>
        <nav className="flex justify-between items-center py-4">
          {/* Logo */}
          <NavLink
            to="/"
            onClick={closeMenu}
            className="text-white text-xl font-bold tracking-widest uppercase"
          >
            M<span className="text-cyan-400">.</span>UMAR
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            <ul className="flex gap-6 text-xs uppercase tracking-widest">
              {navItems
                .filter((item) => item.path !== "/")
                .map((item) => (
                  <li key={item.path}>
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

            {/* Available for hire */}
            {/* <Link
              to="/contact-us"
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400 pl-5 border-l border-cyan-500/20 whitespace-nowrap"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              Available_for_hire
            </Link> */}

            {/* Login Button */}
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `${loginButtonClass} ${
                  isActive ? "bg-cyan-400/10 border-cyan-400" : ""
                }`
              }
            >
              <LogIn size={15} />
              Login
            </NavLink>
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
          <div className="lg:hidden bg-black/95 border-t border-cyan-500/20 px-4 pb-5">
            <ul className="flex flex-col gap-1 text-sm uppercase tracking-widest">
              {navItems
                .filter((item) => item.path !== "/")
                .map((item) => (
                  <li key={item.path}>
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

            

              {/* Mobile Login Button */}
              <li className="pt-3">
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `${loginButtonClass} w-full ${
                      isActive ? "bg-cyan-400/10 border-cyan-400" : ""
                    }`
                  }
                >
                  <LogIn size={16} />
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