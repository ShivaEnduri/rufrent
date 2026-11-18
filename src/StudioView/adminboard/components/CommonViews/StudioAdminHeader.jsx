import React from "react";
import { useRoleStore } from "../../../../store/roleStore";

const StudioAdminHeader = () => {
  const { userData } = useRoleStore();
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Studio Admin - Welcome, {userData.userName}
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          Studio Management System
        </div>
      </div>
    </header>
  );
};

export default StudioAdminHeader;
