


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timeline from '../ProjectTimeline';
import ProjectTaskPayments from '../ProjectTaskPayments';
import useStudioProjectsStore from '../../../store/studioProjectFilterStore';
import { useRoleStore } from '../../../store/roleStore';
import useStudioTasksStore from '../../../store/std_main_tasks_store';
import ProjectCards from '../StdDasshboard/ProjectCards/ProjectCard';
import { studioTailwindStyles } from '../../../utils/studioTailwindStyles';
import { fetchAllStudioTasksCount } from '../../../services/studioapiservices';

const StudioDashboard = () => {
  const navigate = useNavigate();
  const { userData } = useRoleStore();
  const { projects, loading: projectsLoading, error: projectsError, getProjects } = useStudioProjectsStore();
  const { tasks, counts: storeCounts, loading: tasksLoading, error: tasksError, getStudioTasks } = useStudioTasksStore();
  
  // Single source of truth for selected project and task counts
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [taskCounts, setTaskCounts] = useState({ completed_count: 0, pending_count: 0 });

  // Fetch projects when user is available
  useEffect(() => {
    if (userData?.id) {
      getProjects({ cust_id: userData.id });
    }
  }, [userData, getProjects]);

  // Fetch tasks from store and counts from new API when selected project changes
  useEffect(() => {
    if (selectedProjectId) {
      getStudioTasks(selectedProjectId); // Fetch tasks and main_task_count from store
      fetchAllStudioTasksCount(selectedProjectId)
        .then(({ counts }) => {
          setTaskCounts(counts); // Update completed and pending counts
        })
        .catch((err) => {
          console.error('Failed to fetch task counts:', err);
        });
    }
  }, [selectedProjectId, getStudioTasks]);

  // Set default selected project when projects load
  useEffect(() => {
    if (projects.length && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  // Find currently selected project object
  const selectedProject = projects.find((p) => p.id === selectedProjectId) || null;

  // Merge counts: main_task_count from store, completed/pending from API
  const mergedCounts = {
    main_task_count: storeCounts.main_task_count || 0,
    completed_count: taskCounts.completed_count,
    pending_count: taskCounts.pending_count,
  };

  if (projectsLoading || tasksLoading) return <p>Loading...</p>;
  if (projectsError) return <p className="text-red-500">{projectsError}</p>;
  if (tasksError) return <p className="text-red-500">{tasksError}</p>;

  return (
    <section id="dashboard" className="py-10 px-4 lg:px-6 bg-gray-50 w-full min-h-screen">
      <div className="container mx-auto px-4 lg:px-6 max-w-[1280px]">
        {/* Projects Cards Section */}
        <ProjectCards
          projects={projects}
          selectedProject={selectedProjectId}
          setSelectedProject={setSelectedProjectId}
        />

        {/* Dashboard Overview */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <h2 className={`${studioTailwindStyles.heading_2} text-[#1A1F3D] mb-4`}>
              Dashboard Overview
            </h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedProjectId || ''}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full sm:w-48 border-gray-300 rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.project_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Task Counts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Main Tasks</h3>
              <p className="text-2xl font-bold text-gray-900">{mergedCounts.main_task_count}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500"> Completed</h3>
              <p className="text-2xl font-bold text-gray-900">{mergedCounts.completed_count}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500"> Pending</h3>
              <p className="text-2xl font-bold text-gray-900">{mergedCounts.pending_count}</p>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <Timeline
          timelineData={tasks}
          timelineProject={selectedProjectId}
          setTimelineProject={setSelectedProjectId}
          navigate={navigate}
          projects={projects}
        />

        {/* Project Task Payments Section */}
        <ProjectTaskPayments
          weeklyTasks={tasks}
          projectId={selectedProjectId}
        />
      </div>
    </section>
  );
};

export default StudioDashboard;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Timeline from '../ProjectTimeline';
// import ProjectTaskPayments from '../ProjectTaskPayments';
// import useStudioProjectsStore from '../../../store/studioProjectFilterStore';
// import { useRoleStore } from '../../../store/roleStore';
// import useStudioTasksStore from '../../../store/std_main_tasks_store';
// import ProjectCards from '../StdDasshboard/ProjectCards/ProjectCard';
// import { studioTailwindStyles } from '../../../utils/studioTailwindStyles';
// import { fetchAllStudioTasksCount } from '../../../services/studioapiservices';

// const StudioDashboard = () => {
//   const navigate = useNavigate();
//   const { userData } = useRoleStore();
//   const { projects, loading: projectsLoading, error: projectsError, getProjects } = useStudioProjectsStore();
//   const { tasks, counts: storeCounts, loading: tasksLoading, error: tasksError, getStudioTasks } = useStudioTasksStore();
  
//   const [selectedProjectId, setSelectedProjectId] = useState(null);
//   const [taskCounts, setTaskCounts] = useState({ completed_count: 0, pending_count: 0 });

//   useEffect(() => {
//     if (userData?.id) {
//       console.log("Fetching projects for cust_id:", userData.id);
//       getProjects({ cust_id: userData.id });
//     } else {
//       console.warn("No userData.id available");
//     }
//   }, [userData, getProjects]);

//   useEffect(() => {
//     if (selectedProjectId) {
//       getStudioTasks(selectedProjectId);
//       fetchAllStudioTasksCount(selectedProjectId)
//         .then(({ counts }) => {
//           setTaskCounts(counts);
//         })
//         .catch((err) => {
//           console.error('Failed to fetch task counts:', err);
//         });
//     }
//   }, [selectedProjectId, getStudioTasks]);

//   useEffect(() => {
//     if (projects.length && !selectedProjectId) {
//       setSelectedProjectId(projects[0].id);
//     }
//   }, [projects, selectedProjectId]);

//   const selectedProject = projects.find((p) => p.id === selectedProjectId) || null;

//   const mergedCounts = {
//     main_task_count: storeCounts.main_task_count || 0,
//     completed_count: taskCounts.completed_count,
//     pending_count: taskCounts.pending_count,
//   };

//   console.log("Projects loaded:", projects);

//   if (projectsLoading || tasksLoading) return <p>Loading...</p>;
//   if (projectsError) return <p className="text-red-500">{projectsError}</p>;
//   if (tasksError) return <p className="text-red-500">{tasksError}</p>;
//   if (!projects.length) return <p className="text-gray-500">No projects found for this user.</p>;

//   return (
//     <section id="dashboard" className="py-10 px-4 lg:px-6 bg-gray-50 w-full min-h-screen">
//       <div className="container mx-auto px-4 lg:px-6 max-w-[1280px]">
//         <ProjectCards
//           projects={projects}
//           selectedProject={selectedProjectId}
//           setSelectedProject={setSelectedProjectId}
//         />
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
//             <h2 className={`${studioTailwindStyles.heading_2} text-[#1A1F3D] mb-4`}>
//               Dashboard Overview
//             </h2>
//             <div className="flex flex-col sm:flex-row gap-2">
//               <select
//                 value={selectedProjectId || ''}
//                 onChange={(e) => setSelectedProjectId(e.target.value)}
//                 className="w-full sm:w-48 border-gray-300 rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               >
//                 {projects.map((project) => (
//                   <option key={project.id} value={project.id}>
//                     {project.project_name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h3 className="text-sm font-medium text-gray-500">Total Main Tasks</h3>
//               <p className="text-2xl font-bold text-gray-900">{mergedCounts.main_task_count}</p>
//             </div>
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h3 className="text-sm font-medium text-gray-500">Completed</h3>
//               <p className="text-2xl font-bold text-gray-900">{mergedCounts.completed_count}</p>
//             </div>
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h3 className="text-sm font-medium text-gray-500">Pending</h3>
//               <p className="text-2xl font-bold text-gray-900">{mergedCounts.pending_count}</p>
//             </div>
//           </div>
//         </div>
//         <Timeline
//           timelineData={tasks}
//           timelineProject={selectedProjectId}
//           setTimelineProject={setSelectedProjectId}
//           navigate={navigate}
//           projects={projects}
//         />
//         <ProjectTaskPayments
//           weeklyTasks={tasks}
//           projectId={selectedProjectId}
//         />
//       </div>
//     </section>
//   );
// };

// export default StudioDashboard;