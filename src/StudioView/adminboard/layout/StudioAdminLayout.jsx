import React from "react";
import { Outlet } from "react-router-dom";
import StudioAdminSidebar from "../components/CommonViews/StudioAdminSidebar";
import StudioAdminHeader from "../components/CommonViews/StudioAdminHeader";

const StudioAdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <StudioAdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudioAdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudioAdminLayout;
