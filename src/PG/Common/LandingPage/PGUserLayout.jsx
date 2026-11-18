// src/PG/Common/LandingPage/PGUserLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AppAwareNavbar from "../../../components/CommonViews/AppAwareNavbar";

const PGUserLayout = (props) => (
  <div className="flex w-full flex-col bg-white">
    <AppAwareNavbar {...props} />
    <main>
      <Outlet />
    </main>
  </div>
);

export default PGUserLayout;