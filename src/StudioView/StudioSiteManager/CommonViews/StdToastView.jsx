import React from "react";
import { studioTailwindStyles } from "../../../utils/studioTailwindStyles";

const Toast = ({ message, isVisible }) => {
  return (
    <div className={`fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 ${isVisible ? "" : "hidden"}`}>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 flex items-center justify-center">
          <i className="ri-check-line"></i>
        </div>
        <span className={studioTailwindStyles.paragraph_2}>{message}</span>
      </div>
    </div>
  );
};

export default Toast;