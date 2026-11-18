





// import { create } from "zustand";
// import { fetchAllStudioTasks } from "../services/studioapiservices";

// const useStudioTasksStore = create((set) => ({
//   tasks: [],
//   counts: {
//     main_task_count: 0,
   
//   },
//   loading: false,
//   error: null,

//  getStudioTasks: async (project_id) => {
//   set({ loading: true, error: null, tasks: [] });
//   try {
//     const data = await fetchAllStudioTasks(project_id);

//     const mappedTasks = (data.result || []).map((task) => ({
//       id: task.id,
//       project_id: task.project_id,
//       main_task_name: task.main_task_name || "N/A",
//       vendor_id: task.vendor_id,
//       vendor_name: task.vendor_name,
//       task_cost: task.task_cost,
      
//       total_task_cost: task.total_task_cost,
     
//       status: task.task_status || "N/A",
     
//       week_no: task.sub_tasks?.[0]?.week_no || null,
//     }));

//     const finalCounts = {
//       main_task_count: data.main_task_count || data.result.length,
//     };

//     set({
//       tasks: mappedTasks,
//       counts: finalCounts,
//       loading: false,
//     });

//     return { result: mappedTasks, counts: finalCounts }; 
//   } catch (err) {
//     set({ error: err.message, loading: false, tasks: [] });
//     return null;  
//   }
// }

// }));

// export default useStudioTasksStore;


import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchAllStudioTasks } from "../services/studioapiservices";

const useStudioTasksStore = create(
  persist(
    (set) => ({
      tasks: [],
      counts: {
        main_task_count: 0,
      },
      loading: false,
      error: null,

      getStudioTasks: async (params = {}) => {
        set({ loading: true, error: null, tasks: [] });
        try {
          const data = await fetchAllStudioTasks(params);

          const mappedTasks = (data.result || []).map((task) => ({
            id: task.id,
            project_id: task.project_id,
            project_name: task.project_name || "Unknown Project",
            main_task_name: task.main_task_name || "N/A",
            vendor_id: task.vendor_id,
            vendor_name: task.vendor_name || "N/A",
            task_cost: task.task_cost || 0,
            total_task_cost: task.total_task_cost || 0,
            status: task.main_task_status || "N/A",
            status_code: task.main_task_status_code || null,
            signup_pct: task.signup_pct || 0,
            week_no: task.week_no || null,
            sub_tasks: task.sub_tasks || [],
            completed_count: task.completed_count || 0,
            pending_count: task.pending_count || 0,
            total_sub_tasks: task.total_sub_tasks || 0,
          }));

          const finalCounts = {
            main_task_count: data.main_task_count || data.result.length,
          };

          set({
            tasks: mappedTasks,
            counts: finalCounts,
            loading: false,
          });

          return { result: mappedTasks, counts: finalCounts };
        } catch (err) {
          set({ error: err.message, loading: false, tasks: [] });
          return null;
        }
      },

      clearTasks: () => {
        set({
          tasks: [],
          counts: { main_task_count: 0 },
          loading: false,
          error: null,
        });
      },
    }),
    {
      name: "studio-tasks-storage",
    }
  )
);

export default useStudioTasksStore;