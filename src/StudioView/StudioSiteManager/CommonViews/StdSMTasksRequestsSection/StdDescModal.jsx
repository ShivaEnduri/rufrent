import React from "react";
import { studioTailwindStyles } from "../../../../utils/studioTailwindStyles";

const DescriptionModal = ({ isOpen, onClose, description, setDescription, onSave }) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${isOpen ? "" : "hidden"}`} onClick={onClose}>
      <div className="bg-white rounded-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className={studioTailwindStyles.heading_3}>Edit Description</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-close-line"></i>
            </div>
          </button>
        </div>
        <div className="p-6">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent"
            rows="4"
            placeholder="Enter description..."
          />
          <div className="flex justify-end space-x-3 mt-4">
            <button onClick={onClose} className={studioTailwindStyles.form_secondary_button}>
              Cancel
            </button>
            <button onClick={onSave} className={studioTailwindStyles.form_main_button}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionModal;