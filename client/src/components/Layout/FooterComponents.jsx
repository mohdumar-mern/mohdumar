import React from "react";
import { NavLink } from "react-router-dom";
import { navItems } from "./HeaderComponents";

const FooterComponents = () => {
  return (
    <footer className="bg-[#1C1C1C] text-[#BDC3C7] px-6  sm:px-10 py-8  font-sans">
      {/* Desktop Menu */}
      <div className="hidden lg:flex flex-wrap justify-center gap-6 mb-6">
        <ul className="flex gap-6 text-sm font-medium">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-500 font-semibold transition-colors"
                    : "hover:text-orange-500 transition-colors"
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
{/* Mobile Menu - 2 items per row, centered */}
<div className="lg:hidden max-w-sm mx-auto grid grid-cols-2 gap-4 mb-6 text-center text-sm font-medium">
  {navItems.map((item, index) => (
    <div key={index} className="flex justify-center">
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          isActive
            ? "text-orange-500 font-semibold"
            : "hover:text-orange-500 text-[#BDC3C7] transition-colors"
        }
      >
        {item.label}
      </NavLink>
    </div>
  ))}
</div>



      {/* Social Links (optional) */}
      {/*
      <div className="mt-4 sm:mt-8 flex justify-center">
        <SocialLinksPage color="bg-transparent" />
      </div>
      */}

      {/* Copyright */}
      <div className="text-center mt-6 text-sm text-[#BDC3C7]">
        © {new Date().getFullYear()} Mohammad Umar. All rights reserved.
      </div>
    </footer>
  );
};

export default FooterComponents;
