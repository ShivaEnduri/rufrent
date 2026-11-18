import React, { useState, useEffect } from "react";
import { studioTailwindStyles } from "../../../utils/studioTailwindStyles";
import useStudioSubTasksStore from "../../../store/stdSubTaskStore";

const VendorPaymentRequestForm = ({ projects, tasks, vendorId, onSubmit, onCancel }) => {
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedMainTask, setSelectedMainTask] = useState("");
  const [selectedSubtask, setSelectedSubtask] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [warning, setWarning] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  //  Zustand store for subtasks
  const { subTasks, loading, error, loadSubTasks } = useStudioSubTasksStore();

  // Load subtasks when project & main task change
  useEffect(() => {
    if (selectedProject && selectedMainTask && vendorId) {
      loadSubTasks({
        project_id: parseInt(selectedProject),
        main_task: parseInt(selectedMainTask),
        vendor_id: vendorId,
      });
    }
  }, [selectedProject, selectedMainTask, vendorId, loadSubTasks]);

  // Filter main tasks based on selected project + vendor
  const eligibletasks = tasks.filter(
    (mt) =>
      mt.project_id === parseInt(selectedProject) &&
      mt.vendor_id === vendorId &&
      String(mt.status) === "3" // completed
  );

  //  Subtasks come directly from store (API response already filtered)
  const eligibleSubtasks = subTasks.filter(
    (st) => parseInt(st.approval_status) === 3
  );

  // Week numbers from subtasks of selected main task
  const availableWeeks = [
    ...new Set(
      subTasks
        .filter((st) => parseInt(st.approval_status) === 3)
        .map((st) => st.week_no)
    ),
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProject || !selectedMainTask || !selectedWeek || !selectedSubtask) {
      setWarning("Please select a project, main task, week, and subtask.");
      return;
    }
    setWarning("");
    setSuccessMessage("Submission completed. The site manager will review and approve it.");

    onSubmit({
      id: Date.now(),
      projectId: parseInt(selectedProject),
      mainTaskId: parseInt(selectedMainTask),
      weekNo: parseInt(selectedWeek),
      subTaskId: parseInt(selectedSubtask),
      vendorId,
      status: "pending",
      requestDate: new Date().toISOString().split("T")[0],
    });

    setTimeout(() => {
      onCancel();
    }, 2000);
  };

  return (
    <div className="p-4">
      <h3 className={studioTailwindStyles.form_heading}>Raise Payment Request</h3>

      {warning && (
        <p className={`${studioTailwindStyles.form_text} text-red-500 font-medium`} aria-live="assertive">
          {warning}
        </p>
      )}
      {successMessage && (
        <p className={`${studioTailwindStyles.form_text} text-green-500 font-medium`} aria-live="assertive">
          {successMessage}
        </p>
      )}
      {error && <p className="text-red-500 font-medium">Error loading subtasks: {error}</p>}
      {loading && <p>Loading subtasks...</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Project */}
        <div>
          <label className={studioTailwindStyles.form_label}>Project</label>
          <select
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              setSelectedMainTask("");
              setSelectedSubtask("");
              setWarning("");
              setSuccessMessage("");
            }}
            className={`${studioTailwindStyles.form_text} w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-accent mt-1`}
            required
          >
            <option value="">Select a project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.project_name}
              </option>
            ))}
          </select>
        </div>

        {/* Main Task */}
        <div>
          <label className={studioTailwindStyles.form_label}>Main Task</label>
          <select
            value={selectedMainTask}
            onChange={(e) => {
              setSelectedMainTask(e.target.value);
              setSelectedSubtask("");
              setWarning("");
              setSuccessMessage("");
            }}
            className={`${studioTailwindStyles.form_text} w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-accent mt-1`}
            required
          >
            <option value="">Select a main task</option>
            {eligibletasks.map((mt) => (
              <option key={mt.maintTaskId} value={mt.maintTaskId}>
                {mt.main_task_name}
              </option>
            ))}
          </select>
        </div>

        {/* Subtask */}
        <div>
          <label className={studioTailwindStyles.form_label}>Subtask</label>
          <select
            value={selectedSubtask}
            onChange={(e) => {
              setSelectedSubtask(e.target.value);
              setWarning("");
              setSuccessMessage("");
            }}
            className={`${studioTailwindStyles.form_text} w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-accent mt-1`}
            required
          >
            <option value="">Select a subtask</option>
            {eligibleSubtasks.map((st) => (
              <option key={st.id} value={st.id}>
                {st.sub_task_name}
              </option>
            ))}
          </select>
        </div>

         {/* Week No */}
        <div>
          <label className={studioTailwindStyles.form_label}>Week No</label>
          <select
            value={selectedWeek}
            onChange={(e) => {
              setSelectedWeek(e.target.value);
               setWarning("");
              setSuccessMessage("");
              
            }}
           className={`${studioTailwindStyles.form_text} w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-accent mt-1`}
            required
          >
            <option value="">Select a week</option>
            {availableWeeks.map((w) => (
              <option key={w} value={w}>
                Week {w}
              </option>
            ))}
          </select>
        </div>



        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-2">
          <button type="submit" className={studioTailwindStyles.form_main_button}>
            Submit Request
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={studioTailwindStyles.form_secondary_button}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorPaymentRequestForm;
