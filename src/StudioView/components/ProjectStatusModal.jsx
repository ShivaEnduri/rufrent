// // src/components/ProjectDetailsModal.jsx
// import React, { useEffect } from 'react';
// import { studioTailwindStyles } from '../../utils/studioTailwindStyles';
// import { useMediaStore } from '../../store/stdSubtasksMediaStore'

// // Carousel component (unchanged)
// const Carousel = ({ media, title }) => {
//   const [currentIndex, setCurrentIndex] = React.useState(0);

//   const handlePrev = () => {
//     setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
//   };

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
//   };

//   if (!media || media.length === 0) {
//     return <p className="text-gray-500">No media available for {title}</p>;
//   }

//   return (
//     <div className="mb-4">
//       <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
//       <div className="relative">
//         {media[currentIndex].type === 'image' ? (
//           <img
//             src={media[currentIndex].url}
//             alt={`${title} ${currentIndex + 1}`}
//             className="w-full h-32 sm:h-48 object-cover rounded-lg"
//             onError={(e) => console.error(`Failed to load image: ${media[currentIndex].url}`, e)}
//           />
//         ) : (
//           <video
//             src={media[currentIndex].url}
//             controls
//             className="w-full h-32 sm:h-48 object-cover rounded-lg"
//             onError={(e) => console.error(`Failed to load video: ${media[currentIndex].url}`, e)}
//           />
//         )}
//         {media.length > 1 && (
//           <>
//             <button
//               className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
//               onClick={handlePrev}
//             >
//               ‹
//             </button>
//             <button
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
//               onClick={handleNext}
//             >
//               ›
//             </button>
//             <div className="flex justify-center mt-2 space-x-2">
//               {media.map((_, index) => (
//                 <div
//                   key={index}
//                   className={`w-2 h-2 rounded-full cursor-pointer ${
//                     index === currentIndex ? 'bg-[#E07A5F]' : 'bg-gray-300'
//                   }`}
//                   onClick={() => setCurrentIndex(index)}
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// const ProjectDetailsModal = ({ project, onClose }) => {
  
//   const { media, fetchMediaForSubTask, clearMedia } = useMediaStore();

//   useEffect(() => {
//     if (!project?.id) {
//       console.log('No project ID provided, skipping media fetch');
//       return;
//     }

//     const loadMedia = async () => {
//       await fetchMediaForSubTask(project.id, project.media_path);
//     };

//     loadMedia();
//   }, [project?.id, project?.media_path, fetchMediaForSubTask]);

//   if (!project) return null;

//   const beforeMedia = media[project.id]?.before || [];
//   const afterMedia = media[project.id]?.after || [];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h3 className={`${studioTailwindStyles.heading_3} text-gray-900 text-base sm:text-lg`}>
//             {project.sub_task_name}
//           </h3>
//           <button
//             className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl font-bold"
//             onClick={onClose}
//           >
//             ×
//           </button>
//         </div>

//         {/* Media Carousels */}
//         {beforeMedia.length > 0 && <Carousel media={beforeMedia} title="Before" />}
//         {afterMedia.length > 0 && <Carousel media={afterMedia} title="After" />}

//         {/* Optional Refresh Button for Media */}
//         <div className="mb-4">
//           <button
//             className="text-blue-500 hover:text-blue-600 text-sm"
//             onClick={() => fetchMediaForSubTask(project.id, project.media_path, true)}
//           >
//             Refresh Media
//           </button>
//         </div>

//         {/* Task Description */}
//         <div className="mb-4">
//           <h4 className="text-sm font-medium text-gray-700">Task</h4>
//           <p className={`${studioTailwindStyles.paragraph_2} text-gray-600 mt-1 text-sm sm:text-base`}>
//             {project.sub_task_description}
//           </p>
//         </div>

//         {/* Progress */}
//         <div className="mb-4">
//           <p className="text-sm text-gray-700 font-medium">Progress: {project.percent_complete}%</p>
//           <div className="w-full bg-gray-200 h-2 rounded-full">
//             <div
//               className="h-2 rounded-full bg-[#E07A5F]"
//               style={{ width: `${project.percent_complete}%` }}
//             ></div>
//           </div>
//         </div>

//         {/* Close button */}
//         <button
//           className="w-full bg-[#E07A5F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#d16a4f] transition-colors"
//           onClick={onClose}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProjectDetailsModal;




import React, { useEffect } from 'react';
import { studioTailwindStyles } from '../../utils/studioTailwindStyles';
import { useMediaStore } from '../../store/stdSubtasksMediaStore';

// Carousel component (enhanced for mobile)
export const Carousel = ({ media, title }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  if (!media || media.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">No {title} media available</p>;
  }

  return (
    <div className="mb-6">
      <h4 className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">{title}</h4>
      <div className="relative overflow-hidden rounded-lg">
        <div className="transition-opacity duration-300">
          {media[currentIndex].type === 'image' ? (
            <img
              src={media[currentIndex].url}
              alt={`${title} ${currentIndex + 1}`}
              className="w-full max-h-[40vh] sm:h-48 object-contain rounded-lg"
              onError={(e) => console.error(`Failed to load image: ${media[currentIndex].url}`, e)}
            />
          ) : (
            <video
              src={media[currentIndex].url}
              controls
              className="w-full max-h-[40vh] sm:h-48 object-contain rounded-lg"
              onError={(e) => console.error(`Failed to load video: ${media[currentIndex].url}`, e)}
            />
          )}
        </div>
        {media.length > 1 && (
          <>
            <button
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-60 text-white p-3 sm:p-4 rounded-full hover:bg-opacity-80 transition-all duration-200"
              onClick={handlePrev}
              aria-label="Previous media"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-60 text-white p-3 sm:p-4 rounded-full hover:bg-opacity-80 transition-all duration-200"
              onClick={handleNext}
              aria-label="Next media"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="flex justify-center mt-3 space-x-2">
              {media.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex ? 'bg-[#E07A5F] scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to media ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// MediaModal component (renamed for reuse, works for both project and subtask)
export const MediaModal = ({ task, media, onClose, onRefresh }) => {
  const beforeMedia = media?.before || [];
  const afterMedia = media?.after || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className={`${studioTailwindStyles.heading_3} text-gray-900 dark:text-gray-100 text-base sm:text-lg`}>
            Media for {task.sub_task_name || task.project_name || 'Task'}
          </h3>
          <button
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg sm:text-xl font-bold"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {beforeMedia.length > 0 && <Carousel media={beforeMedia} title="Before" />}
        {afterMedia.length > 0 && <Carousel media={afterMedia} title="After" />}

        <div className="mb-4 sm:mb-6">
          <button
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm sm:text-base"
            onClick={onRefresh}
          >
            Refresh Media
          </button>
        </div>

        <div className="mb-4 sm:mb-6">
          <h4 className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">Task Description</h4>
          <p className={`${studioTailwindStyles.paragraph_2} text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base`}>
            {task.sub_task_description || task.description || 'No description available'}
          </p>
        </div>

        <div className="mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">
            Progress: {task.percent_complete || 0}%
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
            <div
              className="h-2 rounded-full bg-[#E07A5F]"
              style={{ width: `${task.percent_complete || 0}%` }}
            ></div>
          </div>
        </div>

        <button
          className="w-full bg-[#E07A5F] text-white px-4 py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-[#d16a4f] transition-colors"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// ProjectDetailsModal (wrapper for user flow)
const ProjectDetailsModal = ({ project, onClose }) => {
  const { fetchMediaForSubTask, media } = useMediaStore();

  useEffect(() => {
    if (!project?.id) {
      console.log('No project ID provided, skipping media fetch');
      return;
    }

    const loadMedia = async () => {
      await fetchMediaForSubTask(project.id, project.media_path);
    };

    loadMedia();
  }, [project?.id, project?.media_path, fetchMediaForSubTask]);

  if (!project) return null;

  return (
    <MediaModal
      task={project}
      media={media[project.id]}
      onClose={onClose}
      onRefresh={() => fetchMediaForSubTask(project.id, project.media_path, true)}
    />
  );
};

export default ProjectDetailsModal;