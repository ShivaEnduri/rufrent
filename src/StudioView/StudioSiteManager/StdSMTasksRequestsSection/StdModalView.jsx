import React, { useState } from "react";
import { studioTailwindStyles } from "../../styles/studioTailwindStyles";

const MediaModal = ({ isOpen, onClose, images, videos }) => {
  const [activeTab, setActiveTab] = useState("images");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "images") {
      setCurrentImageIndex(0);
    } else {
      setCurrentVideoIndex(0);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${isOpen ? "" : "hidden"}`} onClick={onClose}>
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className={studioTailwindStyles.heading_3}>Project Media</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-close-line"></i>
            </div>
          </button>
        </div>
        <div className="p-6">
          <div className="flex space-x-4 mb-4">
            <button
              className={`${activeTab === "images" ? "bg-[#E07A5F] text-white" : "bg-gray-100 text-gray-700"} ${studioTailwindStyles.main_button}`}
              onClick={() => handleTabChange("images")}
            >
              Images
            </button>
            <button
              className={`${activeTab === "videos" ? "bg-[#E07A5F] text-white" : "bg-gray-100 text-gray-700"} ${studioTailwindStyles.main_button}`}
              onClick={() => handleTabChange("videos")}
            >
              Videos
            </button>
          </div>
          <div className="relative">
            {activeTab === "images" ? (
              <div className="relative">
                <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                  {images.length > 0 ? (
                    <img
                      src={images[currentImageIndex]}
                      alt="Project Image"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-600">No images available</div>
                  )}
                  {images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-4">
                      <button
                        onClick={handlePrevImage}
                        className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
                        disabled={currentImageIndex === 0}
                      >
                        <div className="w-6 h-6 flex items-center justify-center">
                          <i className="ri-arrow-left-line"></i>
                        </div>
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
                        disabled={currentImageIndex === images.length - 1}
                      >
                        <div className="w-6 h-6 flex items-center justify-center">
                          <i className="ri-arrow-right-line"></i>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
                {images.length > 0 && (
                  <>
                    <div className="flex justify-center mt-4 space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-[#E07A5F]" : "bg-gray-300"}`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                    <div className="text-center mt-2">
                      <span className={studioTailwindStyles.paragraph_2}>
                        {currentImageIndex === 0 ? "Before Image" : "After Image"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="relative">
                <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                  {videos.length > 0 ? (
                    <video controls className="w-full h-full">
                      <source src={videos[currentVideoIndex]} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-600">No videos available</div>
                  )}
                </div>
                {videos.length > 0 && (
                  <>
                    <div className="flex justify-center mt-4 space-x-2">
                      {videos.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full ${index === currentVideoIndex ? "bg-[#E07A5F]" : "bg-gray-300"}`}
                          onClick={() => setCurrentVideoIndex(index)}
                        />
                      ))}
                    </div>
                    <div className="text-center mt-2">
                      <span className={studioTailwindStyles.paragraph_2}>
                        {currentVideoIndex === 0 ? "Before Video" : "After Video"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaModal;