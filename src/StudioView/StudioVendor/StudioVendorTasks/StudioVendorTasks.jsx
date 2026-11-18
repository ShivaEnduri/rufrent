// import React, { useState, useEffect, useCallback } from 'react';
// import VendorCompleteTaskForm from '../StudioVendorTasks/StdVenCompleteTaskForm';
// import { studioTailwindStyles } from '../../../utils/studioTailwindStyles';
// import { useRoleStore } from '../../../store/roleStore';
// import useStudioProjectsStore from '../../../store/studioProjectFilterStore';
// import useStudioTasksStore from '../../../store/std_main_tasks_store';
// import useStudioSubTasksStore from '../../../store/stdSubTaskStore';
// import { useMediaStore } from '../../../store/stdSubtasksMediaStore';
// import { updateStudioSubTask } from '../../../services/studioapiservices';

// // Carousel component
// const Carousel = ({ media, title }) => {
//   const [currentIndex, setCurrentIndex] = React.useState(0);

//   const handlePrev = () => {
//     setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
//   };

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
//   };

//   if (!media || media.length === 0) {
//     return <p className="text-gray-500">No {title} media available</p>;
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

// // Media Modal component
// const MediaModal = ({ subTask, media, onClose }) => {
//   const beforeMedia = media?.before || [];
//   const afterMedia = media?.after || [];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className={`${studioTailwindStyles.heading_3} text-gray-900 text-base sm:text-lg`}>
//             Media for {subTask.sub_task_name}
//           </h3>
//           <button
//             className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl font-bold"
//             onClick={onClose}
//           >
//             ×
//           </button>
//         </div>
//         {beforeMedia.length > 0 && <Carousel media={beforeMedia} title="Before" />}
//         {afterMedia.length > 0 && <Carousel media={afterMedia} title="After" />}
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

// const VendorTasks = ({ showToast, openModal }) => {
//   const [selectedProject, setSelectedProject] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedMediaTask, setSelectedMediaTask] = useState(null);

//   const { projects, getProjects, loading: projectsLoading, error: projectsError } = useStudioProjectsStore();
//   const { tasks, getStudioTasks, loading: tasksLoading, error: tasksError } = useStudioTasksStore();
//   const { subTasks, loadSubTasks, loading: subTasksLoading, error: subTasksError } = useStudioSubTasksStore();
//   const { fetchMediaForSubTask, media } = useMediaStore();
//   const { userData } = useRoleStore();

//   const vendorId = userData?.id;

//   // Fetch projects
//   const fetchProjects = useCallback(async () => {
//     try {
//       await getProjects();
//     } catch (err) {
//       showToast('Failed to fetch projects. Retrying...', 'error');
//       setTimeout(() => getProjects(), 3000);
//     }
//   }, [getProjects, showToast]);

//   // Fetch tasks for all projects
//   const fetchTasks = useCallback(async () => {
//     if (projects.length === 0 || !vendorId) return;

//     const newTasks = [];
//     for (const project of projects) {
//       try {
//         const data = await getStudioTasks(project.id);
//         if (data?.result) {
//           newTasks.push(
//             ...data.result.map((task) => ({
//               ...task,
//               project_id: task.project_id,
//               vendor_id: task.vendor_id,
//               main_task_name: task.main_task_name || 'N/A',
//               status: task.main_task_status || 'N/A',
//               signup_pct: task.signup_pct || 0,
//             }))
//           );
//         }
//       } catch (err) {
//         console.error(`Failed to fetch tasks for project ${project.id}:`, err.message);
//       }
//     }
//     useStudioTasksStore.setState({ tasks: newTasks, loading: false });
//   }, [projects, vendorId, getStudioTasks]);

//   // Fetch subtasks for selected project and main task
//   const fetchSubTasks = useCallback(async () => {
//     if (!selectedProject || !selectedCategory || !vendorId) return;

//     try {
//       const data = await loadSubTasks({
//         project_id: parseInt(selectedProject),
//         main_task: parseInt(selectedCategory),
//         vendor_id: vendorId,
//       });
     
//     } catch (err) {
//       showToast(`Failed to fetch subtasks: ${err.message}`, 'error');
//     }
//   }, [selectedProject, selectedCategory, vendorId, loadSubTasks, showToast]);

//   // Fetch media for each subtask
//   useEffect(() => {
//     if (subTasks.length > 0) {
//       Promise.all(
//         subTasks.map((task) =>
//           fetchMediaForSubTask(task.id, task.media_path, false).catch((err) => {
//             console.error(`Failed to fetch media for subtask ${task.id}:`, err);
//             showToast(`Failed to load media for subtask ${task.sub_task_name}`, 'error');
//             return { before: [], after: [], timestamp: Date.now() };
//           })
//         )
//       ).catch((err) => showToast('Failed to load media for some subtasks', 'error'));
//     }
//   }, [subTasks, fetchMediaForSubTask, showToast]);

//   useEffect(() => {
//     fetchProjects();
//   }, [fetchProjects]);

//   useEffect(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   useEffect(() => {
//     if (selectedProject && selectedCategory && vendorId) {
//       fetchSubTasks();
//     }
//   }, [selectedProject, selectedCategory, vendorId, fetchSubTasks]);

//   // Filter projects that have tasks for this vendor
//   const vendorProjects = projects.filter((p) =>
//     tasks.some((t) => t.project_id === p.id && t.vendor_id === vendorId)
//   );

//   // Filter main task categories for selected project
//   const categories = tasks
//     .filter((t) => t.project_id === parseInt(selectedProject) && t.vendor_id === vendorId)
//     .map((t) => ({ id: t.id, name: t.main_task_name }));

//   // Filter subtasks
//   const filteredSubTasks = subTasks.filter(
//     (t) =>
//       t.project_id === parseInt(selectedProject) &&
//       parseInt(t.main_task) === parseInt(selectedCategory) &&
//       t.vendor_id === vendorId
//   );

 

//   const weeks = [...new Set(filteredSubTasks.map((t) => t.week_no))].sort((a, b) => a - b);

//   const handleCompleteTask = (subTaskId) => {
//   const subTask = subTasks.find((t) => t.id === subTaskId);
//   if (!subTask) {
//     showToast("Subtask not found.", "error");
//     return;
//   }

//   openModal(
//     <VendorCompleteTaskForm
//       task={subTask}
//       onSubmit={async (updatedTask) => {
//         try {
//           //  Convert subTaskData into [{ key, value }] array format
//           const subTaskData = [
//             { key: "id", value: subTaskId },
//             { key: "sub_task_description", value: updatedTask.sub_task_description },
//           ];

//           const { 
//   beforeImages = [], 
//   afterImages = [], 
//   beforeVideos = [], 
//   afterVideos = [] 
// } = updatedTask;

//           console.log("Preparing to call updateStudioSubTask:", {
//             subTaskId,
//             subTaskData,
//             beforeImages: beforeImages.map((f) => ({ name: f.name, size: f.size })),
//             afterImages: afterImages.map((f) => ({ name: f.name, size: f.size })),
//             beforeVideos: beforeVideos.map((f) => ({ name: f.name, size: f.size, type: f.type })),
//             afterVideos: afterVideos.map((f) => ({ name: f.name, size: f.size, type: f.type })),
//           });

//           const response = await updateStudioSubTask({
//             subTaskId,
//             subTaskData,
//             beforeImages,
//             afterImages,
//             beforeVideos,
//             afterVideos,
//           });

//           if (response.success) {
//             const newSubTasks = subTasks.map((t) =>
//               t.id === subTaskId
//                 ? { ...t, sub_task_description: updatedTask.sub_task_description }
//                 : t
//             );
//             useStudioSubTasksStore.setState({ subTasks: newSubTasks });

//             await fetchMediaForSubTask(subTaskId, response.mediaPath, false);

//             showToast("Subtask updated successfully. The site manager will review it.");
//           } else {
//             showToast(response.message || "Failed to update subtask.", "error");
//           }
//         } catch (error) {
//           console.error("Error in handleCompleteTask:", error.message, error.response?.data);
//           const errorMessage = error.response?.data?.message || error.message;
//           showToast(`Failed to update subtask: ${errorMessage}`, "error");
//         }
//         openModal(null);
//       }}
//       onCancel={() => openModal(null)}
//     />
//   );
// };


//   const handleViewMedia = (subTask) => {
//     setSelectedMediaTask(subTask);
//   };

//   const closeMediaModal = () => {
//     setSelectedMediaTask(null);
//   };

//   return (
//     <div className="p-4 sm:p-6">
//       <h2 className={studioTailwindStyles.heading_2}>Subtasks</h2>

//       {!vendorId && (
//         <p className={`${studioTailwindStyles.form_text} text-red-500 font-medium`}>
//           Vendor ID is missing. Please log in.
//         </p>
//       )}

//       {(projectsLoading || tasksLoading || subTasksLoading) && (
//         <p className={studioTailwindStyles.form_text}>Loading data...</p>
//       )}

//       {(projectsError || tasksError || subTasksError) && (
//         <p className={`${studioTailwindStyles.form_text} text-red-500 font-medium`}>
//           Error: {projectsError || tasksError || subTasksError}
//         </p>
//       )}

//       {vendorProjects.length === 0 && !projectsLoading && !tasksLoading && vendorId && (
//         <p className={studioTailwindStyles.form_text}>No projects found for this vendor.</p>
//       )}

//       {/* Project + Main Task Row */}
//       <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6">
//         <div className="w-full sm:w-1/2">
//           <label className={`${studioTailwindStyles.form_label} pr-0 md:pr-2`}>Project</label>
//           <select
//             value={selectedProject}
//             onChange={(e) => {
//               setSelectedProject(e.target.value);
//               setSelectedCategory('');
//             }}
//             className={`${studioTailwindStyles.form_text} w-[75%] p-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-accent mt-1`}
//             disabled={projectsLoading || tasksLoading || !vendorId}
//           >
//             <option value="">Select a project</option>
//             {vendorProjects.map((p) => (
//               <option key={p.id} value={p.id}>
//                 {p.project_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {selectedProject && (
//           <div className="w-full sm:w-1/2">
//             <label className={`${studioTailwindStyles.form_label} pr-0 md:pr-2`}>Main Task</label>
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className={`${studioTailwindStyles.form_text} w-[75%] p-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-accent mt-1`}
//               disabled={projectsLoading || tasksLoading || !vendorId}
//             >
//               <option value="">Select a main task</option>
//               {categories.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//       </div>

//       {/* Subtasks Table */}
//       <div className="space-y-4">
//         {!selectedProject || !selectedCategory || filteredSubTasks.length === 0 ? (
//           <p className={studioTailwindStyles.form_text}>
//             {selectedProject
//               ? 'Select a main task to view subtasks.'
//               : vendorProjects.length > 0
//               ? 'Select a project to view main tasks.'
//               : 'No tasks available.'}
//           </p>
//         ) : (
//           weeks.map((week) => (
//             <div key={week} className="glassmorphic rounded-lg p-4">
//               <h3 className={studioTailwindStyles.form_label}>Week {week}</h3>
//               <div className="table-container hidden sm:block">
//                 <table className="w-full glassmorphic rounded-lg overflow-hidden table-auto">
//                   <thead className="bg-primary text-white">
//                     <tr>
//                       {['Name', 'Completed %', 'Images Before', 'Images After', 'Notes', 'Status', 'Action'].map(
//                         (header) => (
//                           <th key={header} className={`${studioTailwindStyles.form_text} p-3 text-left`}>
//                             {header}
//                           </th>
//                         )
//                       )}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredSubTasks
//                       .filter((t) => t.week_no === week)
//                       .map((t) => {
//                         const subTaskMedia = media[t.id] || { before: [], after: [] };
//                         return (
//                           <tr
//                             key={t.id}
//                             className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
//                           >
//                             <td className="p-3">{t.sub_task_name}</td>
//                             <td className="p-3">{t.percent_complete || 0}%</td>
//                             <td className="p-3">
//                               {subTaskMedia.before.length > 0 ? (
//                                 <button
//                                   onClick={() => handleViewMedia(t)}
//                                   className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
//                                 >
//                                   <svg
//                                     className="w-5 h-5 mr-1"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth="2"
//                                       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                                     />
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth="2"
//                                       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                                     />
//                                   </svg>
//                                   View
//                                 </button>
//                               ) : (
//                                 'N/A'
//                               )}
//                             </td>
//                             <td className="p-3">
//                               {subTaskMedia.after.length > 0 ? (
//                                 <button
//                                   onClick={() => handleViewMedia(t)}
//                                   className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
//                                 >
//                                   <svg
//                                     className="w-5 h-5 mr-1"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth="2"
//                                       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                                     />
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth="2"
//                                       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                                     />
//                                   </svg>
//                                   View
//                                 </button>
//                               ) : (
//                                 'N/A'
//                               )}
//                             </td>
//                             <td className="p-3">{t.sub_task_description || 'N/A'}</td>
//                             <td className="p-3">{t.status_code}</td>
//                             <td className="p-3">
//                               {t.status !== 'approved' && (
//                                 <button
//                                   onClick={() => handleCompleteTask(t.id)}
//                                   className={studioTailwindStyles.main_button}
//                                 >
//                                   Complete
//                                 </button>
//                               )}
//                             </td>
//                           </tr>
//                         );
//                       })}
//                   </tbody>
//                 </table>
//               </div>
//               {/* Mobile View */}
//               <div className="block sm:hidden space-y-4">
//                 {filteredSubTasks
//                   .filter((t) => t.week_no === week)
//                   .map((t) => {
//                     const subTaskMedia = media[t.id] || { before: [], after: [] };
//                     return (
//                       <div
//                         key={t.id}
//                         className="glassmorphic rounded-lg p-4 border dark:border-gray-700"
//                       >
//                         <p className={studioTailwindStyles.form_text}>
//                           <strong>Name:</strong> {t.sub_task_name}
//                         </p>
//                         <p className={studioTailwindStyles.form_text}>
//                           <strong>Completed:</strong> {t.percent_complete || 0}%
//                         </p>
//                         <p className={studioTailwindStyles.form_text}>
//                           <strong>Before Media:</strong>{' '}
//                           {subTaskMedia.before.length > 0 ? (
//                             <button
//                               onClick={() => handleViewMedia(t)}
//                               className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
//                             >
//                               <svg
//                                 className="w-5 h-5 mr-1"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                                 xmlns="http://www.w3.org/2000/svg"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth="2"
//                                   d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                                 />
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth="2"
//                                   d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                                 />
//                               </svg>
//                               View
//                             </button>
//                           ) : (
//                             'N/A'
//                           )}
//                         </p>
//                         <p className={studioTailwindStyles.form_text}>
//                           <strong>After Media:</strong>{' '}
//                           {subTaskMedia.after.length > 0 ? (
//                             <button
//                               onClick={() => handleViewMedia(t)}
//                               className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
//                             >
//                               <svg
//                                 className="w-5 h-5 mr-1"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                                 xmlns="http://www.w3.org/2000/svg"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth="2"
//                                   d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                                 />
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth="2"
//                                   d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                                 />
//                               </svg>
//                               View
//                             </button>
//                           ) : (
//                             'N/A'
//                           )}
//                         </p>
//                         <p className={studioTailwindStyles.form_text}>
//                           <strong>Notes:</strong> {t.sub_task_description || 'N/A'}
//                         </p>
//                         <p className={studioTailwindStyles.form_text}>
//                           <strong>Status:</strong> {t.status_code}
//                         </p>
//                         {t.status !== 'approved' && (
//                           <button
//                             onClick={() => handleCompleteTask(t.id)}
//                             className={studioTailwindStyles.main_button}
//                           >
//                             Complete
//                           </button>
//                         )}
//                       </div>
//                     );
//                   })}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Media Modal */}
//       {selectedMediaTask && (
//         <MediaModal
//           subTask={selectedMediaTask}
//           media={media[selectedMediaTask.id]}
//           onClose={closeMediaModal}
//         />
//       )}
//     </div>
//   );
// };

// export default VendorTasks;

// import React, { useState, useEffect, useCallback } from 'react';
// import VendorCompleteTaskForm from '../StudioVendorTasks/StdVenCompleteTaskForm';
// import { studioTailwindStyles } from '../../../utils/studioTailwindStyles';
// import { useRoleStore } from '../../../store/roleStore';
// import useStudioTasksStore from '../../../store/std_main_tasks_store';
// import useStudioSubTasksStore from '../../../store/stdSubTaskStore';
// import { useMediaStore } from '../../../store/stdSubtasksMediaStore';
// import { updateStudioSubTask } from '../../../services/studioapiservices';

// // Carousel component
// const Carousel = ({ media, title }) => {
//   const [currentIndex, setCurrentIndex] = React.useState(0);

//   const handlePrev = () => {
//     setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
//   };

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
//   };

//   if (!media || media.length === 0) {
//     return <p className="text-gray-500">No {title} media available</p>;
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

// // Media Modal component
// const MediaModal = ({ subTask, media, onClose }) => {
//   const beforeMedia = media?.before || [];
//   const afterMedia = media?.after || [];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className={`${studioTailwindStyles.heading_3} text-gray-900 text-base sm:text-lg`}>
//             Media for {subTask.sub_task_name}
//           </h3>
//           <button
//             className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl font-bold"
//             onClick={onClose}
//           >
//             ×
//           </button>
//         </div>
//         {beforeMedia.length > 0 && <Carousel media={beforeMedia} title="Before" />}
//         {afterMedia.length > 0 && <Carousel media={afterMedia} title="After" />}
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

// const VendorTasks = ({ showToast, openModal }) => {
//   const [selectedProject, setSelectedProject] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedMediaTask, setSelectedMediaTask] = useState(null);

//   const { tasks, getStudioTasks, loading: tasksLoading, error: tasksError, counts } = useStudioTasksStore();
//   const { subTasks, loadSubTasks, loading: subTasksLoading, error: subTasksError } = useStudioSubTasksStore();
//   const { fetchMediaForSubTask, media } = useMediaStore();
//   const { userData } = useRoleStore();

//   const vendorId = userData?.id;

//   // Fetch tasks for vendor
//   const fetchTasks = useCallback(async () => {
//     if (!vendorId) return;
//     try {
//       await getStudioTasks({ vendor_id: vendorId });
//     } catch (err) {
//       showToast('Failed to fetch tasks. Retrying...', 'error');
//       setTimeout(() => getStudioTasks({ vendor_id: vendorId }), 3000);
//     }
//   }, [vendorId, getStudioTasks, showToast]);

//   // Fetch subtasks for selected project and main task
//   const fetchSubTasks = useCallback(async () => {
//     if (!selectedProject || !selectedCategory || !vendorId) return;

//     try {
//       await loadSubTasks({
//         project_id: parseInt(selectedProject),
//         main_task: parseInt(selectedCategory),
//         vendor_id: vendorId,
//       });
//     } catch (err) {
//       showToast(`Failed to fetch subtasks: ${err.message}`, 'error');
//     }
//   }, [selectedProject, selectedCategory, vendorId, loadSubTasks, showToast]);

//   // Fetch media for each subtask
//   useEffect(() => {
//     if (subTasks.length > 0) {
//       Promise.all(
//         subTasks.map((task) =>
//           fetchMediaForSubTask(task.id, task.media_path, false).catch((err) => {
//             console.error(`Failed to fetch media for subtask ${task.id}:`, err);
//             showToast(`Failed to load media for subtask ${task.sub_task_name}`, 'error');
//             return { before: [], after: [], timestamp: Date.now() };
//           })
//         )
//       ).catch((err) => showToast('Failed to load media for some subtasks', 'error'));
//     }
//   }, [subTasks, fetchMediaForSubTask, showToast]);

//   useEffect(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   useEffect(() => {
//     if (selectedProject && selectedCategory && vendorId) {
//       fetchSubTasks();
//     }
//   }, [selectedProject, selectedCategory, vendorId, fetchSubTasks]);

//   // Derive unique projects from tasks
//   const vendorProjects = Array.from(
//     new Map(
//       tasks
//         .filter((t) => t.vendor_id === vendorId)
//         .map((t) => [t.project_id, { id: t.project_id, project_name: t.project_name }])
//     ).values()
//   ).sort((a, b) => a.project_name.localeCompare(b.project_name));

//   // Filter main task categories for selected project
//   const categories = tasks
//     .filter((t) => t.project_id === parseInt(selectedProject) && t.vendor_id === vendorId)
//     .map((t) => ({ id: t.id, name: t.main_task_name }));

//   // Filter subtasks
//   const filteredSubTasks = subTasks.filter(
//     (t) =>
//       t.project_id === parseInt(selectedProject) &&
//       parseInt(t.main_task) === parseInt(selectedCategory) &&
//       t.vendor_id === vendorId
//   );

//   const weeks = [...new Set(filteredSubTasks.map((t) => t.week_no))].sort((a, b) => a - b);

//   const handleCompleteTask = (subTaskId) => {
//     const subTask = subTasks.find((t) => t.id === subTaskId);
//     if (!subTask) {
//       showToast("Subtask not found.", "error");
//       return;
//     }

//     openModal(
//       <VendorCompleteTaskForm
//         task={subTask}
//         onSubmit={async (updatedTask) => {
//           try {
//             const subTaskData = [
//               { key: "id", value: subTaskId },
//               { key: "sub_task_description", value: updatedTask.sub_task_description },
//             ];

//             const {
//               beforeImages = [],
//               afterImages = [],
//               beforeVideos = [],
//               afterVideos = [],
//             } = updatedTask;

//             console.log("Preparing to call updateStudioSubTask:", {
//               subTaskId,
//               subTaskData,
//               beforeImages: beforeImages.map((f) => ({ name: f.name, size: f.size })),
//               afterImages: afterImages.map((f) => ({ name: f.name, size: f.size })),
//               beforeVideos: beforeVideos.map((f) => ({ name: f.name, size: f.size, type: f.type })),
//               afterVideos: afterVideos.map((f) => ({ name: f.name, size: f.size, type: f.type })),
//             });

//             const response = await updateStudioSubTask({
//               subTaskId,
//               subTaskData,
//               beforeImages,
//               afterImages,
//               beforeVideos,
//               afterVideos,
//             });

//             if (response.success) {
//               const newSubTasks = subTasks.map((t) =>
//                 t.id === subTaskId
//                   ? { ...t, sub_task_description: updatedTask.sub_task_description }
//                   : t
//               );
//               useStudioSubTasksStore.setState({ subTasks: newSubTasks });

//               await fetchMediaForSubTask(subTaskId, response.mediaPath, false);

//               showToast("Subtask updated successfully. The site manager will review it.");
//             } else {
//               showToast(response.message || "Failed to update subtask.", "error");
//             }
//           } catch (error) {
//             console.error("Error in handleCompleteTask:", error.message, error.response?.data);
//             const errorMessage = error.response?.data?.message || error.message;
//             showToast(`Failed to update subtask: ${errorMessage}`, "error");
//           }
//           openModal(null);
//         }}
//         onCancel={() => openModal(null)}
//       />
//     );
//   };

//   const handleViewMedia = (subTask) => {
//     setSelectedMediaTask(subTask);
//   };

//   const closeMediaModal = () => {
//     setSelectedMediaTask(null);
//   };

//   return (
//     <div className="p-4 sm:p-6">
//       <h2 className={studioTailwindStyles.heading_2}>Subtasks</h2>

//       {!vendorId && (
//         <p className={`${studioTailwindStyles.form_text} text-red-500 font-medium`}>
//           Vendor ID is missing. Please log in.
//         </p>
//       )}

//       {tasksLoading || subTasksLoading ? (
//         <p className={studioTailwindStyles.form_text}>Loading data...</p>
//       ) : null}

//       {tasksError || subTasksError ? (
//         <p className={`${studioTailwindStyles.form_text} text-red-500 font-medium`}>
//           Error: {tasksError || subTasksError}
//         </p>
//       ) : null}

//       {vendorProjects.length === 0 && !tasksLoading && vendorId ? (
//         <p className={studioTailwindStyles.form_text}>No projects found for this vendor.</p>
//       ) : null}

//       {/* Project + Main Task Row */}
//       <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6">
//         <div className="w-full sm:w-1/2">
//           <label className={`${studioTailwindStyles.form_label} pr-0 md:pr-2`}>Project</label>
//           <select
//             value={selectedProject}
//             onChange={(e) => {
//               setSelectedProject(e.target.value);
//               setSelectedCategory('');
//             }}
//             className={`${studioTailwindStyles.form_text} w-[75%] p-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-accent mt-1`}
//             disabled={tasksLoading || !vendorId}
//           >
//             <option value="">Select a project</option>
//             {vendorProjects.map((p) => (
//               <option key={p.id} value={p.id}>
//                 {p.project_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {selectedProject && (
//           <div className="w-full sm:w-1/2">
//             <label className={`${studioTailwindStyles.form_label} pr-0 md:pr-2`}>Main Task</label>
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className={`${studioTailwindStyles.form_text} w-[75%] p-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-accent mt-1`}
//               disabled={tasksLoading || !vendorId}
//             >
//               <option value="">Select a main task</option>
//               {categories.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//       </div>

//       {/* Subtasks Table */}
//       <div className="space-y-4">
//         {!selectedProject || !selectedCategory || filteredSubTasks.length === 0 ? (
//           <p className={studioTailwindStyles.form_text}>
//             {selectedProject
//               ? 'Select a main task to view subtasks.'
//               : vendorProjects.length > 0
//               ? 'Select a project to view main tasks.'
//               : 'No tasks available.'}
//           </p>
//         ) : (
//           weeks.map((week) => (
//             <div key={week} className="glassmorphic rounded-lg p-4">
//               <h3 className={studioTailwindStyles.form_label}>Week {week}</h3>
//               <div className="table-container hidden sm:block">
//                 <table className="w-full glassmorphic rounded-lg overflow-hidden table-auto">
//                   <thead className="bg-primary text-white">
//                     <tr>
//                       {['Name', 'Completed %', 'Images Before', 'Images After', 'Notes', 'Status', 'Action'].map(
//                         (header) => (
//                           <th key={header} className={`${studioTailwindStyles.form_text} p-3 text-left`}>
//                             {header}
//                           </th>
//                         )
//                       )}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredSubTasks
//                       .filter((t) => t.week_no === week)
//                       .map((t) => {
//                         const subTaskMedia = media[t.id] || { before: [], after: [] };
//                         return (
//                           <tr
//                             key={t.id}
//                             className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
//                           >
//                             <td className="p-3">{t.sub_task_name}</td>
//                             <td className="p-3">{t.percent_complete || 0}%</td>
//                             <td className="p-3">
//                               {subTaskMedia.before.length > 0 ? (
//                                 <button
//                                   onClick={() => handleViewMedia(t)}
//                                   className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
//                                 >
//                                   <svg
//                                     className="w-5 h-5 mr-1"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth="2"
//                                       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                                     />
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth="2"
//                                       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                                     />
//                                   </svg>
//                                   View
//                                 </button>
//                               ) : (
//                                 'N/A'
//                               )}
//                             </td>
//                             <td className="p-3">
//                               {subTaskMedia.after.length > 0 ? (
//                                 <button
//                                   onClick={() => handleViewMedia(t)}
//                                   className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
//                                 >
//                                   <svg
//                                     className="w-5 h-5 mr-1"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth="2"
//                                       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                                     />
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth="2"
//                                       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                                     />
//                                   </svg>
//                                   View
//                                 </button>
//                               ) : (
//                                 'N/A'
//                               )}
//                             </td>
//                             <td className="p-3">{t.sub_task_description || 'N/A'}</td>
//                             <td className="p-3">{t.status_code}</td>
//                             <td className="p-3">
//                               {t.status !== 'approved' && (
//                                 <button
//                                   onClick={() => handleCompleteTask(t.id)}
//                                   className={studioTailwindStyles.main_button}
//                                 >
//                                   Complete
//                                 </button>
//                               )}
//                             </td>
//                           </tr>
//                         );
//                       })}
//                   </tbody>
//                 </table>
//               </div>
//               {/* Mobile View */}
//               <div className="block sm:hidden space-y-4">
//                 {filteredSubTasks
//                   .filter((t) => t.week_no === week)
//                   .map((t) => {
//                     const subTaskMedia = media[t.id] || { before: [], after: [] };
//                     return (
//                       <div
//                         key={t.id}
//                         className="glassmorphic rounded-lg p-4 border dark:border-gray-700"
//                       >
//                         <p className={studioTailwindStyles.form_text}>
//                           <strong>Name:</strong> {t.sub_task_name}
//                         </p>
//                         <p className={studioTailwindStyles.form_text}>
//                           <strong>Completed:</strong> {t.percent_complete || 0}%
//                         </p>
//                         <p className={studioTailwindStyles.form_text}>
//                           <strong>Before Media:</strong>{' '}
//                           {subTaskMedia.before.length > 0 ? (
//                             <button
//                               onClick={() => handleViewMedia(t)}
//                               className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
//                             >
//                               <svg
//                                 className="w-5 h-5 mr-1"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                                 xmlns="http://www.w3.org/2000/svg"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth="2"
//                                   d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                                 />
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth="2"
//                                   d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                                 />
//                               </svg>
//                               View
//                             </button>
//                           ) : (
//                             'N/A'
//                           )}
//                         </p>
//                         <p className={studioTailwindStyles.form_text}>
//                           <strong>After Media:</strong>{' '}
//                           {subTaskMedia.after.length > 0 ? (
//                             <button
//                               onClick={() => handleViewMedia(t)}
//                               className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
//                             >
//                               <svg
//                                 className="w-5 h-5 mr-1"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                                 xmlns="http://www.w3.org/2000/svg"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth="2"
//                                   d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                                 />
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth="2"
//                                   d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                                 />
//                               </svg>
//                               View
//                             </button>
//                           ) : (
//                             'N/A'
//                           )}
//                         </p>
//                         <p className={studioTailwindStyles.form_text}>
//                           <strong>Notes:</strong> {t.sub_task_description || 'N/A'}
//                         </p>
//                         <p className={studioTailwindStyles.form_text}>
//                           <strong>Status:</strong> {t.status_code}
//                         </p>
//                         {t.status !== 'approved' && (
//                           <button
//                             onClick={() => handleCompleteTask(t.id)}
//                             className={studioTailwindStyles.main_button}
//                           >
//                             Complete
//                           </button>
//                         )}
//                       </div>
//                     );
//                   })}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Media Modal */}
//       {selectedMediaTask && (
//         <MediaModal
//           subTask={selectedMediaTask}
//           media={media[selectedMediaTask.id]}
//           onClose={closeMediaModal}
//         />
//       )}
//     </div>
//   );
// };

// export default VendorTasks;



import React, { useState, useEffect, useCallback } from 'react';
import VendorCompleteTaskForm from '../StudioVendorTasks/StdVenCompleteTaskForm';
import { studioTailwindStyles } from '../../../utils/studioTailwindStyles';
import { useRoleStore } from '../../../store/roleStore';
import useStudioTasksStore from '../../../store/std_main_tasks_store';
import useStudioSubTasksStore from '../../../store/stdSubTaskStore';
import { useMediaStore } from '../../../store/stdSubtasksMediaStore';
import { updateStudioSubTask } from '../../../services/studioapiservices';
import { Carousel, MediaModal } from '../../components/ProjectStatusModal';

const VendorTasks = ({ showToast, openModal }) => {
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMediaTask, setSelectedMediaTask] = useState(null);

  const { tasks, getStudioTasks, loading: tasksLoading, error: tasksError, counts } = useStudioTasksStore();
  const { subTasks, loadSubTasks, loading: subTasksLoading, error: subTasksError } = useStudioSubTasksStore();
  const { fetchMediaForSubTask, media } = useMediaStore();
  const { userData } = useRoleStore();

  const vendorId = userData?.id;

  // Fetch tasks for vendor
  const fetchTasks = useCallback(async () => {
    if (!vendorId) return;
    try {
      await getStudioTasks({ vendor_id: vendorId });
    } catch (err) {
      showToast('Failed to fetch tasks. Retrying...', 'error');
      setTimeout(() => getStudioTasks({ vendor_id: vendorId }), 3000);
    }
  }, [vendorId, getStudioTasks, showToast]);

  // Fetch subtasks for selected project and main task
  const fetchSubTasks = useCallback(async () => {
    if (!selectedProject || !selectedCategory || !vendorId) return;

    try {
      await loadSubTasks({
        project_id: parseInt(selectedProject),
        main_task: parseInt(selectedCategory),
        vendor_id: vendorId,
      });
    } catch (err) {
      showToast(`Failed to fetch subtasks: ${err.message}`, 'error');
    }
  }, [selectedProject, selectedCategory, vendorId, loadSubTasks, showToast]);

  // Fetch media for each subtask
  useEffect(() => {
    if (subTasks.length > 0) {
      Promise.all(
        subTasks.map((task) =>
          fetchMediaForSubTask(task.id, task.media_path, false).catch((err) => {
            console.error(`Failed to fetch media for subtask ${task.id}:`, err);
            showToast(`Failed to load media for subtask ${task.sub_task_name}`, 'error');
            return { before: [], after: [], timestamp: Date.now() };
          })
        )
      ).catch((err) => showToast('Failed to load media for some subtasks', 'error'));
    }
  }, [subTasks, fetchMediaForSubTask, showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (selectedProject && selectedCategory && vendorId) {
      fetchSubTasks();
    }
  }, [selectedProject, selectedCategory, vendorId, fetchSubTasks]);

  // Derive unique projects from tasks
  const vendorProjects = Array.from(
    new Map(
      tasks
        .filter((t) => t.vendor_id === vendorId)
        .map((t) => [t.project_id, { id: t.project_id, project_name: t.project_name }])
    ).values()
  ).sort((a, b) => a.project_name.localeCompare(b.project_name));

  // Filter main task categories for selected project
  const categories = tasks
    .filter((t) => t.project_id === parseInt(selectedProject) && t.vendor_id === vendorId)
    .map((t) => ({ id: t.id, name: t.main_task_name }));

  // Filter subtasks
  const filteredSubTasks = subTasks.filter(
    (t) =>
      t.project_id === parseInt(selectedProject) &&
      parseInt(t.main_task) === parseInt(selectedCategory) &&
      t.vendor_id === vendorId
  );

  const weeks = [...new Set(filteredSubTasks.map((t) => t.week_no))].sort((a, b) => a - b);

  const handleCompleteTask = (subTaskId) => {
    const subTask = subTasks.find((t) => t.id === subTaskId);
    if (!subTask) {
      showToast("Subtask not found.", "error");
      return;
    }

    openModal(
      <VendorCompleteTaskForm
        task={subTask}
        onSubmit={async (updatedTask) => {
          try {
            const subTaskData = [
              { key: "id", value: subTaskId },
              { key: "sub_task_description", value: updatedTask.sub_task_description },
            ];

            const {
              beforeImages = [],
              afterImages = [],
              beforeVideos = [],
              afterVideos = [],
            } = updatedTask;

            console.log("Preparing to call updateStudioSubTask:", {
              subTaskId,
              subTaskData,
              beforeImages: beforeImages.map((f) => ({ name: f.name, size: f.size })),
              afterImages: afterImages.map((f) => ({ name: f.name, size: f.size })),
              beforeVideos: beforeVideos.map((f) => ({ name: f.name, size: f.size, type: f.type })),
              afterVideos: afterVideos.map((f) => ({ name: f.name, size: f.size, type: f.type })),
            });

            const response = await updateStudioSubTask({
              subTaskId,
              subTaskData,
              beforeImages,
              afterImages,
              beforeVideos,
              afterVideos,
            });

            if (response.success) {
              const newSubTasks = subTasks.map((t) =>
                t.id === subTaskId
                  ? { ...t, sub_task_description: updatedTask.sub_task_description }
                  : t
              );
              useStudioSubTasksStore.setState({ subTasks: newSubTasks });

              await fetchMediaForSubTask(subTaskId, response.mediaPath, false);

              showToast("Subtask updated successfully. The site manager will review it.");
            } else {
              showToast(response.message || "Failed to update subtask.", "error");
            }
          } catch (error) {
            console.error("Error in handleCompleteTask:", error.message, error.response?.data);
            const errorMessage = error.response?.data?.message || error.message;
            showToast(`Failed to update subtask: ${errorMessage}`, "error");
          }
          openModal(null);
        }}
        onCancel={() => openModal(null)}
      />
    );
  };

  const handleViewMedia = (subTask) => {
    setSelectedMediaTask(subTask);
  };

  const closeMediaModal = () => {
    setSelectedMediaTask(null);
  };

  const handleRefreshMedia = (subTaskId, mediaPath) => {
    fetchMediaForSubTask(subTaskId, mediaPath, true);
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className={studioTailwindStyles.heading_2}>Subtasks</h2>

      {!vendorId && (
        <p className={`${studioTailwindStyles.form_text} text-red-500 dark:text-red-400 font-medium`}>
          Vendor ID is missing. Please log in.
        </p>
      )}

      {tasksLoading || subTasksLoading ? (
        <p className={`${studioTailwindStyles.form_text} text-gray-600 dark:text-gray-400`}>Loading data...</p>
      ) : null}

      {tasksError || subTasksError ? (
        <p className={`${studioTailwindStyles.form_text} text-red-500 dark:text-red-400 font-medium`}>
          Error: {tasksError || subTasksError}
        </p>
      ) : null}

      {vendorProjects.length === 0 && !tasksLoading && vendorId ? (
        <p className={`${studioTailwindStyles.form_text} text-gray-600 dark:text-gray-400`}>
          No projects found for this vendor.
        </p>
      ) : null}

      {/* Project + Main Task Row */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="w-full sm:w-1/2">
          <label className={`${studioTailwindStyles.form_label} pr-0 md:pr-2`}>Project</label>
          <select
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              setSelectedCategory('');
            }}
            className={`${studioTailwindStyles.form_text} w-full sm:w-[75%] p-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-[#E07A5F] mt-1 text-sm sm:text-base`}
            disabled={tasksLoading || !vendorId}
          >
            <option value="">Select a project</option>
            {vendorProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.project_name}
              </option>
            ))}
          </select>
        </div>

        {selectedProject && (
          <div className="w-full sm:w-1/2">
            <label className={`${studioTailwindStyles.form_label} pr-0 md:pr-2`}>Main Task</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`${studioTailwindStyles.form_text} w-full sm:w-[75%] p-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-[#E07A5F] mt-1 text-sm sm:text-base`}
              disabled={tasksLoading || !vendorId}
            >
              <option value="">Select a main task</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Subtasks Table */}
      <div className="space-y-6">
        {!selectedProject || !selectedCategory || filteredSubTasks.length === 0 ? (
          <p className={`${studioTailwindStyles.form_text} text-gray-600 dark:text-gray-400`}>
            {selectedProject
              ? 'Select a main task to view subtasks.'
              : vendorProjects.length > 0
              ? 'Select a project to view main tasks.'
              : 'No tasks available.'}
          </p>
        ) : (
          weeks.map((week) => (
            <div key={week} className="glassmorphic rounded-xl p-4 sm:p-6">
              <h3 className={`${studioTailwindStyles.form_label} text-gray-900 dark:text-gray-100`}>Week {week}</h3>
              <div className="table-container hidden sm:block">
                <table className="w-full glassmorphic rounded-lg overflow-hidden table-auto">
                  <thead className="bg-primary text-white">
                    <tr>
                      {['Name', 'Completed %', 'Images Before', 'Images After', 'Notes', 'Status', 'Action'].map(
                        (header) => (
                          <th key={header} className={`${studioTailwindStyles.form_text} p-3 text-left text-sm sm:text-base`}>
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubTasks
                      .filter((t) => t.week_no === week)
                      .map((t) => {
                        const subTaskMedia = media[t.id] || { before: [], after: [] };
                        return (
                          <tr
                            key={t.id}
                            className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <td className="p-3 text-sm sm:text-base">{t.sub_task_name}</td>
                            <td className="p-3 text-sm sm:text-base">{t.percent_complete || 0}%</td>
                            <td className="p-3">
                              {subTaskMedia.before.length > 0 ? (
                                <button
                                  onClick={() => handleViewMedia(t)}
                                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm sm:text-base flex items-center"
                                >
                                  <svg
                                    className="w-5 h-5 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  View
                                </button>
                              ) : (
                                <span className="text-sm sm:text-base">N/A</span>
                              )}
                            </td>
                            <td className="p-3">
                              {subTaskMedia.after.length > 0 ? (
                                <button
                                  onClick={() => handleViewMedia(t)}
                                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm sm:text-base flex items-center"
                                >
                                  <svg
                                    className="w-5 h-5 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  View
                                </button>
                              ) : (
                                <span className="text-sm sm:text-base">N/A</span>
                              )}
                            </td>
                            <td className="p-3 text-sm sm:text-base">{t.sub_task_description || 'N/A'}</td>
                            <td className="p-3 text-sm sm:text-base">{t.status_code}</td>
                            <td className="p-3">
                              {t.status !== 'approved' && (
                                <button
                                  onClick={() => handleCompleteTask(t.id)}
                                  className={`${studioTailwindStyles.main_button} text-sm sm:text-base px-4 py-2`}
                                >
                                  Complete
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              {/* Mobile View */}
              <div className="block sm:hidden space-y-4">
                {filteredSubTasks
                  .filter((t) => t.week_no === week)
                  .map((t) => {
                    const subTaskMedia = media[t.id] || { before: [], after: [] };
                    return (
                      <div
                        key={t.id}
                        className="glassmorphic rounded-lg p-4 border dark:border-gray-700"
                      >
                        <p className={`${studioTailwindStyles.form_text} text-sm sm:text-base`}>
                          <strong>Name:</strong> {t.sub_task_name}
                        </p>
                        <p className={`${studioTailwindStyles.form_text} text-sm sm:text-base`}>
                          <strong>Completed:</strong> {t.percent_complete || 0}%
                        </p>
                        <p className={`${studioTailwindStyles.form_text} text-sm sm:text-base`}>
                          <strong>Before Media:</strong>{' '}
                          {subTaskMedia.before.length > 0 ? (
                            <button
                              onClick={() => handleViewMedia(t)}
                              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm sm:text-base flex items-center"
                            >
                              <svg
                                className="w-5 h-5 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View
                            </button>
                          ) : (
                            'N/A'
                          )}
                        </p>
                        <p className={`${studioTailwindStyles.form_text} text-sm sm:text-base`}>
                          <strong>After Media:</strong>{' '}
                          {subTaskMedia.after.length > 0 ? (
                            <button
                              onClick={() => handleViewMedia(t)}
                              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm sm:text-base flex items-center"
                            >
                              <svg
                                className="w-5 h-5 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View
                            </button>
                          ) : (
                            'N/A'
                          )}
                        </p>
                        <p className={`${studioTailwindStyles.form_text} text-sm sm:text-base`}>
                          <strong>Notes:</strong> {t.sub_task_description || 'N/A'}
                        </p>
                        <p className={`${studioTailwindStyles.form_text} text-sm sm:text-base`}>
                          <strong>Status:</strong> {t.status_code}
                        </p>
                        {t.status !== 'approved' && (
                          <button
                            onClick={() => handleCompleteTask(t.id)}
                            className={`${studioTailwindStyles.main_button} text-sm sm:text-base w-full py-2 mt-2`}
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Media Modal */}
      {selectedMediaTask && (
        <MediaModal
          task={selectedMediaTask}
          media={media[selectedMediaTask.id]}
          onClose={closeMediaModal}
          onRefresh={() => handleRefreshMedia(selectedMediaTask.id, selectedMediaTask.media_path)}
        />
      )}
    </div>
  );
};

export default VendorTasks;