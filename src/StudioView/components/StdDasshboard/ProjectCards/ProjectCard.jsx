
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useDocumentStore } from "../../../../store/stdProjDocsStore"
import { studioTailwindStyles } from '../../../../utils/studioTailwindStyles';

const ProjectCards = ({ projects, selectedProject, setSelectedProject }) => {
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [previewPdf, setPreviewPdf] = useState(null);

  const { documents, fetchDocumentsForProject } = useDocumentStore();

  useEffect(() => {
    const fetchAllDocuments = async () => {
      await Promise.all(
        projects.map(async (project) => {
          if (!documents[project.id]) {
            await fetchDocumentsForProject(project.id);
          }
        })
      );
    };

    if (projects.length > 0) {
      fetchAllDocuments();
    }
  }, [projects, documents, fetchDocumentsForProject]);

  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) setCardsPerView(1);
      else if (width < 1024) setCardsPerView(2);
      else setCardsPerView(3);
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const maxStartIndex = Math.max(0, projects.length - cardsPerView);
  const showControls = projects.length > 1;

  const handlePrev = () => setCurrentStartIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentStartIndex((prev) => Math.min(prev + 1, maxStartIndex));



  if (projects.length === 0) {
    return (
      <div className="mb-8">
        <h2 className={`${studioTailwindStyles.heading_2} text-[#1A1F3D] mb-0 md:mb-4`}>
                 Your Projects
               </h2>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">No projects available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 relative">
      <h2 className={`${studioTailwindStyles.heading_2} text-[#1A1F3D] mb-0 md:mb-4`}>
       Your Projects
             </h2>

      <div className="overflow-hidden">
        <div
          className={`flex transition-transform duration-500`}
          style={{
            transform: `translateX(-${(100 / cardsPerView) * currentStartIndex}%)`,
            width: projects.length === 1 ? '100%' : `${(100 * projects.length) / cardsPerView}%`,
          }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex-shrink-0"
              style={{
                width: projects.length === 1 ? 'auto' : `${100 / cardsPerView}%`,
                maxWidth: projects.length === 1 ? '400px' : cardsPerView === 1 ? '100%' : '400px',
                padding: cardsPerView === 1 ? '0 8px' : '0 8px',
                margin: projects.length === 1 ? '0' : '0',
              }}
            >
              <div
                className={`p-4 rounded-lg shadow cursor-pointer transition-all duration-200 h-[300px] flex flex-col justify-between ${
                  selectedProject === project.id ? 'bg-blue-50 border-2 border-blue-500' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => setSelectedProject(project.id)}
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{project.project_name}</h3>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium min-w-[100px]">Flat:</span>
                      <span>{project.flat || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium min-w-[100px]">Community:</span>
                      <span>{project.community || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium min-w-[100px]">Customer:</span>
                      <span>{project.customer_name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium min-w-[100px]">Start Date:</span>
                      <span>{project.start_date || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium min-w-[100px]">Estimated End:</span>
                      <span>{project.est_end_date || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium min-w-[100px]">Actual End:</span>
                      <span>{project.act_end_date || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium min-w-[100px]">Status:</span>
                      <span>
                        {project.status === 45
                          ? 'Completed'
                          : [42, 43, 44].includes(Number(project.status))
                          ? 'Pending'
                          : 'In Progress'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium min-w-[100px]">Documents:</span>
                      {documents[project.id]?.files?.pdfs?.length > 0 ? (
                        <button
                          className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewPdf(documents[project.id].files.pdfs[0].url);
                          }}
                          aria-label="View document"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                      ) : (
                        <span>None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showControls && (
        <>
          <button
            onClick={handlePrev}
            disabled={currentStartIndex === 0}
            className={`absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow mt-6 ${
              currentStartIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
            aria-label="Previous"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={handleNext}
            disabled={currentStartIndex >= maxStartIndex}
            className={`absolute top-1/2 right-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow mt-6 ${
              currentStartIndex >= maxStartIndex ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
            aria-label="Next"
          >
            <ChevronRight />
          </button>
        </>
      )}

      {previewPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-3xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setPreviewPdf(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Document Preview</h3>
            </div>
            <div className="overflow-auto max-h-[80vh] border rounded">
              <iframe src={previewPdf} className="w-full h-[60vh] sm:h-[70vh]" title="Document Preview" />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setPreviewPdf(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCards;

// import React, { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
// import { useDocumentStore } from "../../../../store/stdProjDocsStore";
// import { useRoleStore } from "../../../../store/roleStore";
// import { studioTailwindStyles } from "../../../../utils/studioTailwindStyles";

// const ProjectCards = ({ projects, selectedProject, setSelectedProject }) => {
//   const [currentStartIndex, setCurrentStartIndex] = useState(0);
//   const [cardsPerView, setCardsPerView] = useState(3);
//   const [previewPdf, setPreviewPdf] = useState(null);

//   const { userData } = useRoleStore();
//   const isAdmin = userData?.role === "admin";
//   const { documents, fetchDocumentsForProject } = useDocumentStore();

//   // Fetch documents per project safely
//   useEffect(() => {
//     const fetchAllDocuments = async () => {
//       await Promise.all(
//         projects.map(async (project) => {
//           if (!documents[project.id]) {
//             // Pass cust_id only for normal users
//             const cust_id = isAdmin ? null : userData.id;
//             await fetchDocumentsForProject(project.id, cust_id);
//           }
//         })
//       );
//     };

//     if (projects.length > 0) fetchAllDocuments();
//   }, [projects, documents, fetchDocumentsForProject, userData, isAdmin]);

//   // Responsive cards per view
//   useEffect(() => {
//     const updateCardsPerView = () => {
//       const width = window.innerWidth;
//       if (width < 640) setCardsPerView(1);
//       else if (width < 1024) setCardsPerView(2);
//       else setCardsPerView(3);
//     };

//     updateCardsPerView();
//     window.addEventListener("resize", updateCardsPerView);
//     return () => window.removeEventListener("resize", updateCardsPerView);
//   }, []);

//   const maxStartIndex = Math.max(0, projects.length - cardsPerView);
//   const showControls = projects.length > 1;
//   const handlePrev = () => setCurrentStartIndex((prev) => Math.max(prev - 1, 0));
//   const handleNext = () => setCurrentStartIndex((prev) => Math.min(prev + 1, maxStartIndex));

//   if (projects.length === 0)
//     return (
//       <div className="mb-8">
//         <h2 className={`${studioTailwindStyles.heading_2} text-[#1A1F3D] mb-0 md:mb-4`}>Your Projects</h2>
//         <div className="bg-white p-4 rounded-lg shadow text-center">
//           <p className="text-sm text-gray-500">No projects available.</p>
//         </div>
//       </div>
//     );

//   return (
//     <div className="mb-8 relative">
//       <h2 className={`${studioTailwindStyles.heading_2} text-[#1A1F3D] mb-0 md:mb-4`}>Your Projects</h2>

//       <div className="overflow-hidden">
//         <div
//           className="flex transition-transform duration-500"
//           style={{
//             transform: `translateX(-${(100 / cardsPerView) * currentStartIndex}%)`,
//             width: projects.length === 1 ? "100%" : `${(100 * projects.length) / cardsPerView}%`,
//           }}
//         >
//           {projects.map((project) => (
//             <div
//               key={project.id}
//               className="flex-shrink-0"
//               style={{
//                 width: projects.length === 1 ? "auto" : `${100 / cardsPerView}%`,
//                 maxWidth: projects.length === 1 ? "400px" : cardsPerView === 1 ? "100%" : "400px",
//                 padding: "0 8px",
//               }}
//             >
//               <div
//                 className={`p-4 rounded-lg shadow cursor-pointer transition-all duration-200 h-[300px] flex flex-col justify-between ${
//                   selectedProject === project.id ? "bg-blue-50 border-2 border-blue-500" : "bg-white hover:bg-gray-50"
//                 }`}
//                 onClick={() => setSelectedProject(project.id)}
//               >
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">{project.project_name}</h3>
//                   <div className="space-y-1 text-sm text-gray-500">
//                     <div className="flex items-center">
//                       <span className="font-medium min-w-[100px]">Flat:</span>
//                       <span>{project.flat || "N/A"}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="font-medium min-w-[100px]">Community:</span>
//                       <span>{project.community || "N/A"}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="font-medium min-w-[100px]">Customer:</span>
//                       <span>{project.customer_name}</span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-500">
//                       <span className="font-medium min-w-[100px]">Start Date:</span>
//                       <span>{project.start_date || 'N/A'}</span>
//                      </div>
//                      <div className="flex items-center text-sm text-gray-500">
//                        <span className="font-medium min-w-[100px]">Estimated End:</span>
//                        <span>{project.est_end_date || 'N/A'}</span>
//                      </div>
//                      <div className="flex items-center text-sm text-gray-500">
//                        <span className="font-medium min-w-[100px]">Actual End:</span>
//                        <span>{project.act_end_date || 'N/A'}</span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-500">
//                       <span className="font-medium min-w-[100px]">Status:</span>
//                        <span>
//                         {project.status === 45
//                            ? 'Completed'
//                            : [42, 43, 44].includes(Number(project.status))
//                           ? 'Pending'
//                            : 'In Progress'}
//                        </span>
//                      </div>
//                     <div className="flex items-center">
//                       <span className="font-medium min-w-[100px]">Documents:</span>
//                       {documents[project.id]?.files?.pdfs?.length > 0 ? (
//                         <button
//                           className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setPreviewPdf(documents[project.id].files.pdfs[0].url);
//                           }}
//                         >
//                           <Eye size={16} />
//                           <span>View</span>
//                         </button>
//                       ) : (
//                         <span>None</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {showControls && (
//         <>
//           <button
//             onClick={handlePrev}
//             disabled={currentStartIndex === 0}
//             className={`absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow mt-6 ${
//               currentStartIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
//             }`}
//           >
//             <ChevronLeft />
//           </button>
//           <button
//             onClick={handleNext}
//             disabled={currentStartIndex >= maxStartIndex}
//             className={`absolute top-1/2 right-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow mt-6 ${
//               currentStartIndex >= maxStartIndex ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
//             }`}
//           >
//             <ChevronRight />
//           </button>
//         </>
//       )}

//       {previewPdf && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg w-11/12 max-w-3xl relative">
//             <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setPreviewPdf(null)}>
//               ✕
//             </button>
//             <div className="mb-4">
//               <h3 className="text-lg font-semibold">Document Preview</h3>
//             </div>
//             <div className="overflow-auto max-h-[80vh] border rounded">
//               <iframe src={previewPdf} className="w-full h-[60vh] sm:h-[70vh]" title="Document Preview" />
//             </div>
//             <div className="mt-4 flex justify-end">
//               <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400" onClick={() => setPreviewPdf(null)}>
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectCards;
