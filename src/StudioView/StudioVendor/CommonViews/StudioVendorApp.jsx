import React, { useState } from "react";
import VendorSidebar from "./StudioVendorSidebar";
import VendorHeader from "./StudioVendorHeader";
import VendorDashboard from "../StdVenDashboard/StudioVendorDashboard";
import VendorTasks from "../StudioVendorTasks/StudioVendorTasks";
import VendorPayments from "../StudioVendorPayments/StudioVendorPayments";
import { useLocalStorage } from "./useLocalStorage";
import { studioTailwindStyles } from '../../../utils/studioTailwindStyles';

const VendorApp = () => {
  const [data, saveData] = useLocalStorage();
  const [activeSection, setActiveSection] = useState("tasks");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const openModal = (content) => setModalContent(content);
  const closeModal = () => setModalContent(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: "", type: "", visible: false }), 3000); // Auto-hide after 3 seconds
  };

  return (
    <>
      <VendorSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="md:ml-64 min-h-screen">
        <VendorHeader toggleSidebar={toggleSidebar} />
        <main>
          {activeSection === "dashboard" && <VendorDashboard data={data} />}
          {activeSection === "tasks" && (
            <VendorTasks
              data={data}
              saveData={saveData}
              showToast={showToast}
              openModal={openModal}
            />
          )}
          {activeSection === "payments" && (
            <VendorPayments
              data={data}
              saveData={saveData}
              showToast={showToast}
              openModal={openModal}
            />
          )}
        </main>
      </div>
      {/* Custom Modal */}
      {modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              &times;
            </button>
            {modalContent}
          </div>
        </div>
      )}
      {/* Custom Toast */}
      {toast.visible && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          } animate-fade-in-out`}
        >
          {toast.message}
        </div>
      )}
      {/* Inline CSS for toast animation */}
      <style jsx>{`
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out;
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(20px); }
        }
      `}</style>
    </>
  );
};

export default VendorApp;