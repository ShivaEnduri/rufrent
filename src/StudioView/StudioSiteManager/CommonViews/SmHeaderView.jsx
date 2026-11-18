import React from "react";
import { studioTailwindStyles } from "../../../utils/studioTailwindStyles";

const SiteManagerHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className={studioTailwindStyles.heading_2}>Site Manager Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#E07A5F] rounded-full flex items-center justify-center">
                <i className="ri-user-line text-white text-sm"></i>
              </div>
              <span className={studioTailwindStyles.paragraph_1}>John Smith</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SiteManagerHeader;