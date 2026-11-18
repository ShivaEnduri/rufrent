// src/components/CommonViews/MenuDropdown/footerSections.js

// Items visible in **both** Rentals and Studio
const COMMON_ITEMS = [
  { id: "about-us", label: "About Us" },
  { id: "terms-and-conditions", label: "T&C's" },
  { id: "team", label: "Team" },
  { id: "contact-us", label: "Contact Us" },
];

// Items visible **only in Rentals**
const RENTALS_ONLY = [
  { id: "rr-package", label: "RR Package" },
  { id: "tenants", label: "Tenants" },
  { id: "owners", label: "Owners" },
];

/**
 * Get menu items based on app
 * @param {string} app - "rentals" or "studio"
 * @returns {Array}
 */
export const getFooterSections = (app) => {
  if (app === "studio") return COMMON_ITEMS;
  return [...COMMON_ITEMS, ...RENTALS_ONLY]; // default = rentals
};