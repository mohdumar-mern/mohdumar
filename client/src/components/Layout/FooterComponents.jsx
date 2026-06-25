import React from "react";
import { NavLink } from "react-router-dom";
import { navItems } from "./HeaderComponents";

const FooterComponents = () => {
  return (
    <footer className="bg-black/95 text-gray-400 border-t border-cyan-500/20 px-6 sm:px-10 py-10 font-mono">
      {/* Desktop Menu */}
      <div className="hidden lg:flex flex-wrap justify-center gap-8 mb-8">
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
                      : "hover:text-cyan-400 transition-colors"
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
        </ul>
      </div>

      {/* Mobile Menu - 2 items per row, centered */}
      <div className="lg:hidden max-w-sm mx-auto grid grid-cols-2 gap-4 mb-8 text-center text-xs uppercase tracking-widest">
        {navItems
          .filter((item) => item.path !== "/")
          .map((item, index) => (
            <div key={index} className="flex justify-center">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-cyan-400"
                    : "hover:text-cyan-400 text-gray-400 transition-colors"
                }
              >
                {item.label}
              </NavLink>
            </div>
          ))}
      </div>

      {/* Social Links (optional) */}
      
      {/* <div className="mt-4 sm:mt-8 flex justify-center">
        <SocialLinksPage color="bg-transparent" />
      </div> */}
     

      {/* Divider */}
      <div className="max-w-xs mx-auto border-t border-cyan-500/10 mb-6" />

      {/* Copyright */}
      <div className="text-center text-xs uppercase tracking-widest text-gray-500">
        © {new Date().getFullYear()} M<span className="text-cyan-400">.</span>Umar — All rights reserved
      </div>
    </footer>
  );
};

export default FooterComponents;