// src/components/CommonViews/AppAwareNavbar.jsx
import React from "react";
import { useLocation } from "react-router-dom";

import Navbar from "./Navbar"; // Rentals Navbar (in same folder or correct relative path)
import StudioNavbar from "../../StudioView/commonViews/StudioNavbar"; // Studio Navbar
import { PGNavbar } from "../../PG/Common/LandingPage/PGNavbar";
import { RENTALS_BASE, STUDIO_BASE, PG_BASE } from "../../routes/routesPath";

const AppAwareNavbar = (props) => {
  const { pathname, search } = useLocation();

  // Step 1: Check query param ?app=studio or ?app=rentals
  const urlParams = new URLSearchParams(search);
  const appFromQuery = urlParams.get("app"); // "studio" | "rentals" | "PG"| null

  // Step 2: Determine which app we're in
  const isStudio = appFromQuery === "studio" || pathname.startsWith(STUDIO_BASE);
  const isRentals = appFromQuery === "rentals" ||pathname.startsWith(RENTALS_BASE) ||pathname.startsWith("/base/footer");
  const isPg = appFromQuery === "pg" || pathname.startsWith(PG_BASE);
  // Step 3: Render correct navbar
  if (isStudio) {
    return <StudioNavbar {...props} />;
  }
  if (isPg) {
    return <PGNavbar {...props} />;
  }
  // Default: Rentals (including all /base/footer pages unless ?app=studio)
  return <Navbar {...props} />;
};

export default AppAwareNavbar;