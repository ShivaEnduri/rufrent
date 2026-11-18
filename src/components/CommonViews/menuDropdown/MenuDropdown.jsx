


// src/components/CommonViews/MenuDropdown/MenuDropdown.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import tailwindStyles from "../../../utils/tailwindStyles";
import { FOOTER_PATH } from "../../../routes/routesPath";
import { getFooterSections } from "./FooterSections";

const MenuDropdown = ({ onCloseMobileMenu, app = "rentals" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sections = getFooterSections(app); // ← dynamic per app

  const handleToggle = () => setIsOpen(!isOpen);

  const handleItemClick = () => {
    setIsOpen(false);
    onCloseMobileMenu?.();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="hidden lg:flex relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className={`${tailwindStyles.header_item} flex items-center`}
      >
        ☰ Menu
      </button>

      {isOpen && (
        <div className="absolute top-8 -right-10 mt-2 w-32 bg-white rounded-md shadow-lg z-50">
          {sections.map((section) => (
            <NavLink
              key={section.id}
              to={`${FOOTER_PATH}/${section.id}?app=${app}`}
              className={({ isActive }) =>
                `block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${tailwindStyles.header_item} ${
                  isActive ? "text-[#001433] font-bold underline" : ""
                }`
              }
              onClick={handleItemClick}
            >
              {section.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;