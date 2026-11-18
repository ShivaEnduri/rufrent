import React, { useState } from "react";
import SiteManagerHeader from "./SmHeaderView";
import SiteManagerTabs from "./StdSMTabs";
import TasksSection from "./StdSMTasksRequestsSection/StdTasksSec";
import InvoicesSection from "./StdSMInvRequestsSection/InvRequestsSec";
import MediaModal from "./StdSMTasksRequestsSection/StdModalView";
import DescriptionModal from "./StdSMTasksRequestsSection/StdDescModal";
import Toast from "./StdToastView";


const SiteManagerView = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [mediaContent, setMediaContent] = useState({ images: [], videos: [] });
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentDescriptionElement, setCurrentDescriptionElement] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const openMediaModal = (images, videos) => {
    setMediaContent({ images, videos });
    setIsMediaModalOpen(true);
  };

  const closeMediaModal = () => {
    setIsMediaModalOpen(false);
    setMediaContent({ images: [], videos: [] });
  };

  const openDescriptionModal = (description, element) => {
    setCurrentDescription(description);
    setCurrentDescriptionElement(element);
    setIsDescriptionModalOpen(true);
  };

  const closeDescriptionModal = () => {
    setIsDescriptionModalOpen(false);
    setCurrentDescription("");
    setCurrentDescriptionElement(null);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => setIsToastVisible(false), 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SiteManagerHeader />
      <div className="px-6 py-6">
        <SiteManagerTabs activeTab={activeTab} onTabChange={handleTabChange} />
        {activeTab === "tasks" ? (
          <TasksSection openMediaModal={openMediaModal} openDescriptionModal={openDescriptionModal} showToast={showToast} />
        ) : (
          <InvoicesSection showToast={showToast} />
        )}
      </div>
      <MediaModal
        isOpen={isMediaModalOpen}
        onClose={closeMediaModal}
        images={mediaContent.images}
        videos={mediaContent.videos}
      />
      <DescriptionModal
        isOpen={isDescriptionModalOpen}
        onClose={closeDescriptionModal}
        description={currentDescription}
        setDescription={setCurrentDescription}
        onSave={() => {
          if (currentDescriptionElement) {
            currentDescriptionElement.textContent = currentDescription;
            showToast("Description updated successfully!");
          }
          closeDescriptionModal();
        }}
      />
      <Toast message={toastMessage} isVisible={isToastVisible} />
    </div>
  );
};

export default SiteManagerView;