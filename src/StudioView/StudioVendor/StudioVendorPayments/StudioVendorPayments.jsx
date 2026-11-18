

// import React, { useState, useEffect, useCallback } from "react";
// import VendorPaymentRequestForm from "../StudioVendorPayments/StdVenPaymentRequestForm";
// import { studioTailwindStyles } from '../../../utils/studioTailwindStyles';
// import { useRoleStore } from '../../../store/roleStore';
// import useStudioProjectsStore from '../../../store/studioProjectFilterStore';
// import useStudioTasksStore from '../../../store/std_main_tasks_store';
// import useStudioPaymentsStore from '../../../store/stdInvoice';

// const VendorPayments = ({ showToast, openModal }) => {
//   const [selectedProject, setSelectedProject] = useState("");
//   const [selectedMainTask, setSelectedMainTask] = useState("");

//   const { projects = [], getProjects, loading: projectsLoading, error: projectsError } = useStudioProjectsStore();
//   const { tasks = [], getStudioTasks, loading: tasksLoading, error: tasksError } = useStudioTasksStore();
//   const { invoices = [], loadInvoices, loading: invoicesLoading, error: invoicesError } = useStudioPaymentsStore();
//   const { userData } = useRoleStore();

//   const vendorId = userData?.id;

//   // Fetch projects
//   const fetchProjects = useCallback(async () => {
//     try {
//       await getProjects();
//     } catch (err) {
//       showToast("Failed to fetch projects. Retrying...", "error");
//       setTimeout(() => getProjects(), 3000);
//     }
//   }, [getProjects, showToast]);

//   // Fetch tasks for all projects
//   const fetchTasks = useCallback(async () => {
//     if (!projects || projects.length === 0 || !vendorId) return;

//     const newTasks = [];
//     for (const project of projects) {
//       try {
//         const data = await getStudioTasks(project.id);
        
//         if (data?.result) {
//           newTasks.push(
//             ...data.result.map((task) => ({
//               ...task,
//               maintTaskId:task.id,
//               project_id: task.project_id,
//               vendor_id: task.vendor_id,
//               main_task_name: task.main_task_name || "N/A",
//               status: task.status || "N/A",
              
//             }))
//           );
//         }
//       } catch (err) {
//         console.error(`Failed to fetch tasks for project ${project.id}:`, err.message);
//       }
//     }
//     useStudioTasksStore.setState({ tasks: newTasks, loading: false });
//   }, [projects, vendorId, getStudioTasks]);

//   // Fetch invoices
//   const fetchInvoices = useCallback(async () => {
//     if (!vendorId) return;

//     const filters = { vendor_id: vendorId };
//     if (selectedProject) filters.project_id = parseInt(selectedProject);
//     if (selectedMainTask) filters.main_task_id = parseInt(selectedMainTask);

//     try {
//       await loadInvoices(filters);
//     } catch (err) {
//       showToast("Failed to fetch invoices.", "error");
//     }
//   }, [vendorId, selectedProject, selectedMainTask, loadInvoices, showToast]);

//   useEffect(() => {
//     fetchProjects();
//   }, [fetchProjects]);

//   useEffect(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   useEffect(() => {
//     fetchInvoices();
//   }, [fetchInvoices]);

 
//   // Filter projects that have tasks for this vendor
//   const vendorProjects = (projects || []).filter((p) =>
//     (tasks || []).some((t) => t.project_id === p.id && t.vendor_id === vendorId)
//   );

//   // Filter main tasks for selected project
//   const mainTasks = (tasks || [])
//     .filter((t) => t.project_id === parseInt(selectedProject) && t.vendor_id === vendorId)
//     .map((t) => ({ id: t.id, name: t.main_task_name }));

//   // Filter invoices
//   const filteredInvoices = (invoices || []).filter((p) => {
//     if (!p.rcvr_cat_id) return false;
//     if (!selectedProject) return true;
//     if (selectedMainTask && p.main_task_id) {
//       return p.proj_id === parseInt(selectedProject) && p.main_task_id === parseInt(selectedMainTask);
//     }
//     return p.proj_id === parseInt(selectedProject);
//   });

//   const handleRaisePayment = () => {
//     const eligibleProjects = (projects || []).filter((p) =>
//       (tasks || []).some((t) => t.project_id === p.id && t.vendor_id === vendorId && t.status === "3")
//     );
   
//     const eligibleTasks = (tasks || []).filter((t) => t.vendor_id === vendorId && t.status === "3");
    
//     if (eligibleProjects.length === 0 || eligibleTasks.length === 0) {
//       showToast("No completed subtasks available for payment request.", "error");
//       return;
//     }
//     openModal(
//       <VendorPaymentRequestForm
//         projects={eligibleProjects}
//         tasks={eligibleTasks}
//         vendorId={vendorId}
//         onSubmit={(payment) => {
//           useStudioPaymentsStore.setState((state) => ({
//             invoices: [...(state.invoices || []), {
//               ...payment,
//               week_number: payment.wk_no || "N/A",
//               project_name: (projects || []).find((p) => p.id === payment.proj_id)?.project_name || "N/A",
//               inv_info: payment.inv_info || "N/A",
//               weekly_cost_amount: payment.wkly_cost_amt || 0,
//               total_cost: payment.wkly_cost_amt || 0,
//               proj_id: payment.project_id || payment.proj_id,
//               rcvr_cat_id: payment.rcvr_cat_id || vendorId,
//             }],
//           }));
//           showToast("Payment request submitted successfully");
//           setSelectedProject(selectedProject);
//           setSelectedMainTask(selectedMainTask);
//         }}
//         onCancel={() => openModal(null)}
//       />
//     );
//   };

//   return (
//     <div className="p-4 sm:p-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
//         <h2 className={studioTailwindStyles.heading_2}>Payments</h2>
//         <button
//           onClick={handleRaisePayment}
//           className={studioTailwindStyles.main_button}
//         >
//           <i className="ri-add-line mr-2"></i> Raise Payment Request
//         </button>
//       </div>

//       {!vendorId && (
//         <p className={`${studioTailwindStyles.form_text} text-red-500 font-medium`}>
//           Vendor ID is missing. Please log in.
//         </p>
//       )}

//       {(projectsLoading || tasksLoading || invoicesLoading) && (
//         <p className={studioTailwindStyles.form_text}>Loading data...</p>
//       )}

//       {(projectsError || tasksError || invoicesError) && (
//         <p className={`${studioTailwindStyles.form_text} text-red-500 font-medium`}>
//           Error: {projectsError || tasksError || invoicesError}
//         </p>
//       )}

//       {vendorProjects.length === 0 && !projectsLoading && !tasksLoading && vendorId && (
//         <p className={studioTailwindStyles.form_text}>No projects found for this vendor.</p>
//       )}

//       <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
//         <div className="w-full sm:w-1/2">
//           <label className={`${studioTailwindStyles.form_label} pr-0 md:pr-2`}>Filter by Project</label>
//           <select
//             value={selectedProject}
//             onChange={(e) => {
//               setSelectedProject(e.target.value);
//               setSelectedMainTask("");
//             }}
//             className={`${studioTailwindStyles.form_text} max-w-[200px] p-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-accent mt-1`}
//             disabled={projectsLoading || tasksLoading || invoicesLoading || !vendorId}
//           >
//             <option value="">All Projects</option>
//             {vendorProjects.map((p) => (
//               <option key={p.id} value={p.id}>
//                 {p.project_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {selectedProject && (
//           <div className="w-full sm:w-1/2">
//             <label className={`${studioTailwindStyles.form_label} pr-0 md:pr-2`}>Filter by Main Task</label>
//             <select
//               value={selectedMainTask}
//               onChange={(e) => setSelectedMainTask(e.target.value)}
//               className={`${studioTailwindStyles.form_text} max-w-[200px] p-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-accent mt-1`}
//               disabled={projectsLoading || tasksLoading || invoicesLoading || !vendorId}
//             >
//               <option value="">All Main Tasks</option>
//               {mainTasks.map((t) => (
//                 <option key={t.id} value={t.id}>
//                   {t.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//       </div>

//       <div className="space-y-4">
//         {filteredInvoices.length === 0 ? (
//           <p className={studioTailwindStyles.form_text}>No invoices found.</p>
//         ) : (
//           <>
//             <div className="table-container hidden sm:block">
//               <table className="w-full glassmorphic rounded-lg overflow-hidden table-auto">
//                 <thead className="bg-primary text-white">
//                   <tr>
//                     {["Project","Invoice No", "Week No", "Amount", "Status", "Payment Expected Date"].map((header) => (
//                       <th key={header} className={`${studioTailwindStyles.form_text} p-3 text-left`}>
//                         {header}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredInvoices.map((p) => (
//                     <tr
//                       key={p.inv_id || p.id}
//                       className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
//                     >
//                       <td className={`${studioTailwindStyles.form_text} p-3`}>
//                         {(projects || []).find((proj) => proj.id === p.proj_id)?.project_name || p.project_name || "N/A"}
//                       </td>
//                        <td className={`${studioTailwindStyles.form_text} p-3`}>
//                         {p.inv_info || "N/A"}
//                       </td>
//                       <td className={`${studioTailwindStyles.form_text} p-3`}>
//                         {p.wk_no || "N/A"}
//                       </td>
//                       <td className={`${studioTailwindStyles.form_text} p-3`}>
//                         {p.weekly_cost_amount?.toFixed(2) || "0.00"}
//                       </td>
//                       <td className={`${studioTailwindStyles.form_text} p-3 status-${p.status}`}>
//                         {p.status_code || "N/A"}
//                       </td>
//                      <td className={`${studioTailwindStyles.form_text} p-3`}>
//   {p.pymt_due_date 
//     ? new Date(p.pymt_due_date).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//       }) 
//     : "N/A"}
// </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className="grid grid-cols-1 gap-4 sm:hidden">
//               {filteredInvoices.map((p) => (
//                 <div key={p.inv_id || p.id} className="glassmorphic rounded-lg p-4">
//                   <p className={studioTailwindStyles.form_text}>
//                     <strong>Project:</strong>{" "}
//                     {(projects || []).find((proj) => proj.id === p.proj_id)?.project_name || p.project_name || "N/A"}
//                   </p>
//                    <p className={studioTailwindStyles.form_text}>
//                     <strong>Invoice No:</strong> {p.inv_info || "N/A"}
//                   </p>
//                   <p className={studioTailwindStyles.form_text}>
//                     <strong>Week No:</strong> {p.wk_no || "N/A"}
//                   </p>
//                   <p className={studioTailwindStyles.form_text}>
//                     <strong>Amount:</strong> ${p.weekly_cost_amount?.toFixed(2) || "0.00"}
//                   </p>
//                   <p className={studioTailwindStyles.form_text}>
//                     <strong>Status:</strong>{" "}
//                     <span className={`status-${p.inv_status}`}>{p.status_code || "N/A"}</span>
//                   </p>
//                   <p className={studioTailwindStyles.form_text}>
//                     <strong>Payment Expected Date:</strong> {p.pymt_due_date 
//     ? new Date(p.pymt_due_date).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//       }) 
//     : "N/A"}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VendorPayments;


// import React, { useState, useEffect, useCallback } from "react";
// import VendorPaymentRequestForm from "../StudioVendorPayments/StdVenPaymentRequestForm";
// import { studioTailwindStyles } from '../../../utils/studioTailwindStyles';
// import { useRoleStore } from '../../../store/roleStore';
// import useStudioProjectsStore from '../../../store/studioProjectFilterStore';
// import useStudioTasksStore from '../../../store/std_main_tasks_store';
// import useStudioPaymentsStore from '../../../store/stdInvoice';

// const VendorPayments = ({ showToast, openModal }) => {
//   const { userData } = useRoleStore();
//   const vendorId = userData?.id;

//   const { projects = [], getProjects, loading: projectsLoading, error: projectsError } = useStudioProjectsStore();
//   const { tasks = [], getStudioTasks, loading: tasksLoading, error: tasksError } = useStudioTasksStore();
//   const { invoices = [], loadInvoices, loading: invoicesLoading, error: invoicesError } = useStudioPaymentsStore();

//   const [selectedProject, setSelectedProject] = useState("");
//   const [selectedMainTask, setSelectedMainTask] = useState("");

//   // Fetch all projects first
//   const fetchProjects = useCallback(async () => {
//     try {
//       // Pass empty params to fetch all for admin, or vendorId if needed
//       await getProjects();
//     } catch (err) {
//       showToast("Failed to fetch projects. Retrying...", "error");
//       setTimeout(fetchProjects, 3000);
//     }
//   }, [getProjects, showToast]);

//   // Fetch tasks per project and filter by vendorId
//   const fetchTasks = useCallback(async () => {
//     if (!projects || projects.length === 0 || !vendorId) return;

//     const newTasks = [];
//     for (const project of projects) {
//       if (project.vendor_id !== vendorId) continue; // Only vendor's projects
//       try {
//         const data = await getStudioTasks(project.id);
//         if (data?.result) {
//           newTasks.push(
//             ...data.result.map(task => ({
//               ...task,
//               project_id: project.id,
//               vendor_id: project.vendor_id,
//               main_task_name: task.main_task_name || "N/A",
//               status: task.status || "N/A",
//             }))
//           );
//         }
//       } catch (err) {
//         console.error(`Failed to fetch tasks for project ${project.id}:`, err.message);
//       }
//     }
//     useStudioTasksStore.setState({ tasks: newTasks, loading: false });
//   }, [projects, vendorId, getStudioTasks]);

//   // Fetch invoices filtered by project/task selection
//   const fetchInvoices = useCallback(async () => {
//     if (!vendorId) return;

//     const filters = { vendor_id: vendorId };
//     if (selectedProject) filters.project_id = parseInt(selectedProject);
//     if (selectedMainTask) filters.main_task_id = parseInt(selectedMainTask);

//     try {
//       await loadInvoices(filters);
//     } catch (err) {
//       showToast("Failed to fetch invoices.", "error");
//     }
//   }, [vendorId, selectedProject, selectedMainTask, loadInvoices, showToast]);

//   useEffect(() => { fetchProjects(); }, [fetchProjects]);
//   useEffect(() => { fetchTasks(); }, [fetchTasks]);
//   useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

//   // Filter projects/tasks for this vendor
//   const vendorProjects = projects.filter(p => p.vendor_id === vendorId);
//   const mainTasks = tasks.filter(t => t.project_id === parseInt(selectedProject));

//   const filteredInvoices = (invoices || []).filter(inv => {
//     if (!inv.rcvr_cat_id) return false;
//     if (selectedProject && inv.proj_id !== parseInt(selectedProject)) return false;
//     if (selectedMainTask && inv.main_task_id !== parseInt(selectedMainTask)) return false;
//     return true;
//   });

//   const handleRaisePayment = () => {
//     const eligibleProjects = vendorProjects.filter(p => tasks.some(t => t.project_id === p.id && t.status === "3"));
//     const eligibleTasks = tasks.filter(t => t.vendor_id === vendorId && t.status === "3");

//     if (eligibleProjects.length === 0 || eligibleTasks.length === 0) {
//       showToast("No completed subtasks available for payment request.", "error");
//       return;
//     }

//     openModal(
//       <VendorPaymentRequestForm
//         projects={eligibleProjects}
//         tasks={eligibleTasks}
//         vendorId={vendorId}
//         onSubmit={(payment) => {
//           useStudioPaymentsStore.setState((state) => ({
//             invoices: [...(state.invoices || []), {
//               ...payment,
//               week_number: payment.wk_no || "N/A",
//               project_name: projects.find(p => p.id === payment.proj_id)?.project_name || "N/A",
//               total_cost: payment.wkly_cost_amt || 0,
//               proj_id: payment.proj_id,
//               rcvr_cat_id: vendorId,
//             }],
//           }));
//           showToast("Payment request submitted successfully");
//           setSelectedProject(selectedProject);
//           setSelectedMainTask(selectedMainTask);
//         }}
//         onCancel={() => openModal(null)}
//       />
//     );
//   };

//   return (
//     <div className="p-4 sm:p-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
//         <h2 className={studioTailwindStyles.heading_2}>Payments</h2>
//         <button onClick={handleRaisePayment} className={studioTailwindStyles.main_button}>
//           <i className="ri-add-line mr-2"></i> Raise Payment Request
//         </button>
//       </div>

//       {!vendorId && <p className="text-red-500 font-medium">Vendor ID is missing. Please log in.</p>}
//       {(projectsLoading || tasksLoading || invoicesLoading) && <p>Loading data...</p>}
//       {(projectsError || tasksError || invoicesError) && <p className="text-red-500 font-medium">Error: {projectsError || tasksError || invoicesError}</p>}

//       {vendorProjects.length === 0 && !projectsLoading && !tasksLoading && vendorId && (
//         <p>No projects found for this vendor.</p>
//       )}

//       <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
//         <div className="w-full sm:w-1/2">
//           <label>Filter by Project</label>
//           <select
//             value={selectedProject}
//             onChange={(e) => { setSelectedProject(e.target.value); setSelectedMainTask(""); }}
//             className="p-2 rounded-lg bg-gray-200 w-full"
//             disabled={projectsLoading || tasksLoading || invoicesLoading || !vendorId}
//           >
//             <option value="">All Projects</option>
//             {vendorProjects.map(p => <option key={p.id} value={p.id}>{p.project_name}</option>)}
//           </select>
//         </div>

//         {selectedProject && (
//           <div className="w-full sm:w-1/2">
//             <label>Filter by Main Task</label>
//             <select
//               value={selectedMainTask}
//               onChange={(e) => setSelectedMainTask(e.target.value)}
//               className="p-2 rounded-lg bg-gray-200 w-full"
//               disabled={projectsLoading || tasksLoading || invoicesLoading || !vendorId}
//             >
//               <option value="">All Main Tasks</option>
//               {mainTasks.map(t => <option key={t.id} value={t.id}>{t.main_task_name}</option>)}
//             </select>
//           </div>
//         )}
//       </div>

//       <div className="space-y-4">
//         {filteredInvoices.length === 0 ? (
//           <p>No invoices found.</p>
//         ) : (
//           <div className="table-container hidden sm:block">
//             <table className="w-full table-auto">
//               <thead>
//                 <tr>
//                   {["Project","Invoice No","Week No","Amount","Status","Payment Date"].map(h => <th key={h}>{h}</th>)}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredInvoices.map(inv => (
//                   <tr key={inv.inv_id || inv.id}>
//                     <td>{projects.find(p => p.id === inv.proj_id)?.project_name || inv.project_name || "N/A"}</td>
//                     <td>{inv.inv_info || "N/A"}</td>
//                     <td>{inv.wk_no || "N/A"}</td>
//                     <td>{inv.weekly_cost_amount?.toFixed(2) || "0.00"}</td>
//                     <td>{inv.status_code || "N/A"}</td>
//                     <td>{inv.pymt_due_date ? new Date(inv.pymt_due_date).toLocaleDateString() : "N/A"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VendorPayments;



import React, { useState, useEffect, useCallback } from "react";
import VendorPaymentRequestForm from "../StudioVendorPayments/StdVenPaymentRequestForm";
import { studioTailwindStyles } from '../../../utils/studioTailwindStyles';
import { useRoleStore } from '../../../store/roleStore';
import useStudioTasksStore from '../../../store/std_main_tasks_store';
import useStudioPaymentsStore from '../../../store/stdInvoice';

const VendorPayments = ({ showToast, openModal }) => {
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedMainTask, setSelectedMainTask] = useState("");

  const { tasks = [], getStudioTasks, loading: tasksLoading, error: tasksError } = useStudioTasksStore();
  const { invoices = [], loadInvoices, loading: invoicesLoading, error: invoicesError } = useStudioPaymentsStore();
  const { userData } = useRoleStore();

  const vendorId = userData?.id;

  // Fetch all tasks for vendor (includes project_name)
  const fetchTasks = useCallback(async () => {
    if (!vendorId) return;
    try {
      await getStudioTasks({ vendor_id: vendorId });
    } catch (err) {
      showToast("Failed to fetch tasks. Retrying...", "error");
      setTimeout(() => getStudioTasks({ vendor_id: vendorId }), 3000);
    }
  }, [vendorId, getStudioTasks, showToast]);

  // Fetch invoices
  const fetchInvoices = useCallback(async () => {
    if (!vendorId) return;

    const filters = { vendor_id: vendorId };
    if (selectedProject) filters.project_id = parseInt(selectedProject);
    if (selectedMainTask) filters.main_task_id = parseInt(selectedMainTask);

    try {
      await loadInvoices(filters);
    } catch (err) {
      showToast("Failed to fetch invoices.", "error");
    }
  }, [vendorId, selectedProject, selectedMainTask, loadInvoices, showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Derive unique projects from tasks
  const vendorProjects = Array.from(
    new Map(
      tasks
        .filter((t) => t.vendor_id === vendorId)
        .map((t) => [t.project_id, { id: t.project_id, project_name: t.project_name }])
    ).values()
  ).sort((a, b) => a.project_name.localeCompare(b.project_name));

  // Filter main tasks for selected project
  const mainTasks = tasks
    .filter((t) => t.project_id === parseInt(selectedProject) && t.vendor_id === vendorId)
    .map((t) => ({ id: t.id, name: t.main_task_name }));

  // Filter invoices
  const filteredInvoices = invoices.filter((p) => {
    if (!p.rcvr_cat_id) return false;
    if (!selectedProject) return true;
    if (selectedMainTask && p.main_task_id) {
      return p.proj_id === parseInt(selectedProject) && p.main_task_id === parseInt(selectedMainTask);
    }
    return p.proj_id === parseInt(selectedProject);
  });

  const handleRaisePayment = () => {
    // Derive eligible tasks from current tasks where status === "3"
    const eligibleTasks = tasks.filter((t) => t.vendor_id === vendorId && t.status === "3");
    
    // Derive eligible projects from eligible tasks
    const eligibleProjects = Array.from(
      new Map(
        eligibleTasks.map((t) => [t.project_id, { id: t.project_id, project_name: t.project_name }])
      ).values()
    );
   
    if (eligibleProjects.length === 0 || eligibleTasks.length === 0) {
      showToast("No completed subtasks available for payment request.", "error");
      return;
    }
    openModal(
      <VendorPaymentRequestForm
        projects={eligibleProjects}
        tasks={eligibleTasks}
        vendorId={vendorId}
        onSubmit={(payment) => {
          useStudioPaymentsStore.setState((state) => ({
            invoices: [...(state.invoices || []), {
              ...payment,
              week_number: payment.wk_no || "N/A",
              project_name: vendorProjects.find((p) => p.id === payment.proj_id)?.project_name || "N/A",
              inv_info: payment.inv_info || "N/A",
              weekly_cost_amount: payment.wkly_cost_amt || 0,
              total_cost: payment.wkly_cost_amt || 0,
              proj_id: payment.project_id || payment.proj_id,
              rcvr_cat_id: payment.rcvr_cat_id || vendorId,
            }],
          }));
          showToast("Payment request submitted successfully");
          setSelectedProject(selectedProject);
          setSelectedMainTask(selectedMainTask);
        }}
        onCancel={() => openModal(null)}
      />
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <h2 className={studioTailwindStyles.heading_2}>Payments</h2>
        <button
          onClick={handleRaisePayment}
          className={studioTailwindStyles.main_button}
        >
          <i className="ri-add-line mr-2"></i> Raise Payment Request
        </button>
      </div>

      {!vendorId && (
        <p className={`${studioTailwindStyles.form_text} text-red-500 font-medium`}>
          Vendor ID is missing. Please log in.
        </p>
      )}

      {(tasksLoading || invoicesLoading) && (
        <p className={studioTailwindStyles.form_text}>Loading data...</p>
      )}

      {(tasksError || invoicesError) && (
        <p className={`${studioTailwindStyles.form_text} text-red-500 font-medium`}>
          Error: {tasksError || invoicesError}
        </p>
      )}

      {vendorProjects.length === 0 && !tasksLoading && !invoicesLoading && vendorId && (
        <p className={studioTailwindStyles.form_text}>No projects found for this vendor.</p>
      )}

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="w-full sm:w-1/2">
          <label className={`${studioTailwindStyles.form_label} pr-0 md:pr-2`}>Filter by Project</label>
          <select
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              setSelectedMainTask("");
            }}
            className={`${studioTailwindStyles.form_text} max-w-[200px] p-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-accent mt-1`}
            disabled={tasksLoading || invoicesLoading || !vendorId}
          >
            <option value="">All Projects</option>
            {vendorProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.project_name}
              </option>
            ))}
          </select>
        </div>

        {selectedProject && (
          <div className="w-full sm:w-1/2">
            <label className={`${studioTailwindStyles.form_label} pr-0 md:pr-2`}>Filter by Main Task</label>
            <select
              value={selectedMainTask}
              onChange={(e) => setSelectedMainTask(e.target.value)}
              className={`${studioTailwindStyles.form_text} max-w-[200px] p-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-accent mt-1`}
              disabled={tasksLoading || invoicesLoading || !vendorId}
            >
              <option value="">All Main Tasks</option>
              {mainTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredInvoices.length === 0 ? (
          <p className={studioTailwindStyles.form_text}>No invoices found.</p>
        ) : (
          <>
            <div className="table-container hidden sm:block">
              <table className="w-full glassmorphic rounded-lg overflow-hidden table-auto">
                <thead className="bg-primary text-white">
                  <tr>
                    {["Project","Invoice No", "Week No", "Amount", "Status", "Payment Expected Date"].map((header) => (
                      <th key={header} className={`${studioTailwindStyles.form_text} p-3 text-left`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((p) => (
                    <tr
                      key={p.inv_id || p.id}
                      className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <td className={`${studioTailwindStyles.form_text} p-3`}>
                        {vendorProjects.find((proj) => proj.id === p.proj_id)?.project_name || p.project_name || "N/A"}
                      </td>
                       <td className={`${studioTailwindStyles.form_text} p-3`}>
                        {p.inv_info || "N/A"}
                      </td>
                      <td className={`${studioTailwindStyles.form_text} p-3`}>
                        {p.wk_no || "N/A"}
                      </td>
                      <td className={`${studioTailwindStyles.form_text} p-3`}>
                        {p.weekly_cost_amount?.toFixed(2) || "0.00"}
                      </td>
                      <td className={`${studioTailwindStyles.form_text} p-3 status-${p.status}`}>
                        {p.status_code || "N/A"}
                      </td>
                     <td className={`${studioTailwindStyles.form_text} p-3`}>
  {p.pymt_due_date 
    ? new Date(p.pymt_due_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }) 
    : "N/A"}
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:hidden">
              {filteredInvoices.map((p) => (
                <div key={p.inv_id || p.id} className="glassmorphic rounded-lg p-4">
                  <p className={studioTailwindStyles.form_text}>
                    <strong>Project:</strong>{" "}
                    {vendorProjects.find((proj) => proj.id === p.proj_id)?.project_name || p.project_name || "N/A"}
                  </p>
                   <p className={studioTailwindStyles.form_text}>
                    <strong>Invoice No:</strong> {p.inv_info || "N/A"}
                  </p>
                  <p className={studioTailwindStyles.form_text}>
                    <strong>Week No:</strong> {p.wk_no || "N/A"}
                  </p>
                  <p className={studioTailwindStyles.form_text}>
                    <strong>Amount:</strong> ${p.weekly_cost_amount?.toFixed(2) || "0.00"}
                  </p>
                  <p className={studioTailwindStyles.form_text}>
                    <strong>Status:</strong>{" "}
                    <span className={`status-${p.inv_status}`}>{p.status_code || "N/A"}</span>
                  </p>
                  <p className={studioTailwindStyles.form_text}>
                    <strong>Payment Expected Date:</strong> {p.pymt_due_date 
    ? new Date(p.pymt_due_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }) 
    : "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VendorPayments;