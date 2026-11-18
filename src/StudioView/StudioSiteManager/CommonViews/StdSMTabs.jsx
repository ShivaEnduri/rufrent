import React from "react";
import { studioTailwindStyles } from "../../../utils/studioTailwindStyles";

const SiteManagerTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-4 mb-6">
      <button
        className={`${activeTab === "tasks" ? "bg-[#E07A5F] text-white" : "bg-gray-500 text-gray-700"} ${studioTailwindStyles.main_button}`}
        onClick={() => onTabChange("tasks")}
      >
        Tasks
      </button>
      <button
        className={`${activeTab === "invoices" ? "bg-[#E07A5F] text-white" : "bg-gray-500 text-gray-700"} ${studioTailwindStyles.main_button}`}
        onClick={() => onTabChange("invoices")}
      >
        Invoices
      </button>
    </div>
  );
};

export default SiteManagerTabs;