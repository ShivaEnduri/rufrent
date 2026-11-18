// // import { create } from "zustand";
// // import { persist } from "zustand/middleware";
// // import { fetchAllStudioProjects } from "../services/studioapiservices";

// // const useStudioProjectsStore = create(
// //   persist(
// //     (set, get) => ({
// //       projects: [],
// //       counts: { pending: 0, completed: 0, total: 0 },
// //       loading: false,
// //       error: null,

// //       // Fetch projects and save to state + localStorage
// //       getProjects: async (params = {}) => {
// //         set({ loading: true, error: null });
// //         try {
// //           const data = await fetchAllStudioProjects(params);
// //           set({
// //             projects: data.projects || [],
// //             counts: data.counts || { pending: 0, completed: 0, total: 0 },
// //             loading: false,
// //           });
// //         } catch (err) {
// //           set({ error: err.message, loading: false });
// //         }
// //       },
// //     }),
// //     {
// //       name: "studio-projects-storage", 
// //     }
// //   )
// // );

// // export default useStudioProjectsStore;


// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { fetchAllStudioProjects } from "../services/studioapiservices";

// const useStudioProjectsStore = create(
//   persist(
//     (set) => ({
//       projects: [],
//       counts: { pending: 0, completed: 0, total: 0 },
//       loading: false,
//       error: null,

//       // Fetch projects with optional filtering by customer
//       getProjects: async (params) => {
//         // Only call API if params is an object or undefined
//         if (params !== undefined && typeof params !== "object") {
//           console.warn("getProjects called with invalid params:", params);
//           params = {};
//         }

//         console.log("Fetching projects with params:", params);

//         set({ loading: true, error: null });

//         try {
//           const data = await fetchAllStudioProjects(params);

//           const projects = Array.isArray(data.projects) ? data.projects : [];
//           const counts =
//             projects.length > 0
//               ? data.counts || { pending: 0, completed: 0, total: projects.length }
//               : { pending: 0, completed: 0, total: 0 };

//           set({ projects, counts, loading: false });
//         } catch (err) {
//           console.error("Error in getProjects:", err);
//           set({
//             projects: [],
//             counts: { pending: 0, completed: 0, total: 0 },
//             error: err.message,
//             loading: false,
//           });
//         }
//       },

//       clearProjects: () => set({ projects: [], counts: { pending: 0, completed: 0, total: 0 }, error: null }),
//     }),
//     { name: "studio-projects-storage" }
//   )
// );

// export default useStudioProjectsStore;


// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { fetchAllStudioProjects } from "../services/studioapiservices";

// const useStudioProjectsStore = create(
//   persist(
//     (set, get) => ({
//       projects: [],
//       counts: { pending: 0, completed: 0, total: 0 },
//       loading: false,
//       error: null,

//       // Fetch projects and save to state + localStorage
//       getProjects: async (params = {}) => {
//         set({ loading: true, error: null });
//         try {
//           const data = await fetchAllStudioProjects(params);
//           set({
//             projects: data.projects || [],
//             counts: data.counts || { pending: 0, completed: 0, total: 0 },
//             loading: false,
//           });
//         } catch (err) {
//           set({ error: err.message, loading: false });
//         }
//       },
//     }),
//     {
//       name: "studio-projects-storage", 
//     }
//   )
// );

// export default useStudioProjectsStore;


import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchAllStudioProjects } from "../services/studioapiservices";

const useStudioProjectsStore = create(
  persist(
    (set, get) => ({
      projects: [],
      counts: { pending: 0, completed: 0, total: 0 },
      loading: false,
      error: null,
      lastFetchedCustId: null, 

      getProjects: async (params = {}) => {
        const { cust_id } = params;
        if (!cust_id) {
          console.error("No cust_id provided for fetching projects");
          set({ error: "Customer ID is required", loading: false });
          return;
        }

        // Skip if already fetched for this cust_id
        if (get().lastFetchedCustId === cust_id && get().projects.length > 0) {
          console.log("Skipping fetch: Projects already loaded for cust_id:", cust_id);
          return;
        }

        set({ loading: true, error: null });
        try {
          const data = await fetchAllStudioProjects(params);
          set({
            projects: data.projects || [],
            counts: data.counts || { pending: 0, completed: 0, total: 0 },
            loading: false,
            lastFetchedCustId: cust_id,
          });
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      clearProjects: () => {
        set({
          projects: [],
          counts: { pending: 0, completed: 0, total: 0 },
          loading: false,
          error: null,
          lastFetchedCustId: null,
        });
      },
    }),
    {
      name: "studio-projects-storage",
    }
  )
);

export default useStudioProjectsStore;