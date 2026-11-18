import React, { useState } from "react";
import { studioTailwindStyles } from "../../../../utils/studioTailwindStyles";

const TasksTable = ({ tasks, openMediaModal, openDescriptionModal, showToast }) => {
  const [taskData, setTaskData] = useState(tasks);

  const updateStatusStyles = (status) => {
    if (status === "pending") return "bg-orange-100 text-orange-800";
    if (status === "in-progress") return "bg-blue-100 text-blue-800";
    if (status === "completed") return "bg-green-100 text-green-800";
    return "";
  };

  const handleStatusChange = (id, type, value) => {
    setTaskData((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id && type === "subtask") {
          const updatedTask = { ...task, status: value };
          checkAndUpdateMainTaskStatus(task.maintask.id);
          return updatedTask;
        }
        if (task.maintask.id === id && type === "maintask") {
          const updatedTask = { ...task, maintask: { ...task.maintask, status: value } };
          checkAndUpdateProjectStatus(task.project.id);
          return updatedTask;
        }
        if (task.project.id === id && type === "project") {
          return { ...task, project: { ...task.project, status: value } };
        }
        return task;
      })
    );
    showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} status updated successfully!`);
  };

  const checkAndUpdateMainTaskStatus = (maintaskId) => {
    const subtasksForMainTask = taskData.filter((task) => task.maintask.id === maintaskId);
    const allSubtasksCompleted = subtasksForMainTask.every((task) => task.status === "completed");
    if (allSubtasksCompleted) {
      setTaskData((prevTasks) =>
        prevTasks.map((task) => {
          if (task.maintask.id === maintaskId && task.maintask.status !== "completed") {
            showToast("All subtasks completed! Main task status updated automatically.");
            return { ...task, maintask: { ...task.maintask, status: "completed" } };
          }
          return task;
        })
      );
      checkAndUpdateProjectStatus(subtasksForMainTask[0].project.id);
    }
  };

  const checkAndUpdateProjectStatus = (projectId) => {
    const maintasksForProject = taskData.filter((task) => task.project.id === projectId);
    const allMaintasksCompleted = maintasksForProject.every((task) => task.maintask.status === "completed");
    if (allMaintasksCompleted) {
      setTaskData((prevTasks) =>
        prevTasks.map((task) => {
          if (task.project.id === projectId && task.project.status !== "completed") {
            showToast("All main tasks completed! Project status updated automatically.");
            return { ...task, project: { ...task.project, status: "completed" } };
          }
          return task;
        })
      );
    }
  };

  const handleUpdateStatus = (id, type) => {
    const task = taskData.find((t) => t.id === id);
    if (type === "maintask") {
      const subtasks = taskData.filter((t) => t.maintask.id === task.maintask.id);
      const allCompleted = subtasks.every((t) => t.status === "completed");
      if (allCompleted) {
        setTaskData((prevTasks) =>
          prevTasks.map((t) => {
            if (t.maintask.id === task.maintask.id) {
              return { ...t, maintask: { ...t.maintask, status: "completed" } };
            }
            return t;
          })
        );
        showToast("Main task marked as completed!");
        checkAndUpdateProjectStatus(task.project.id);
      } else {
        showToast("Cannot mark main task as completed until all subtasks are completed.");
      }
    } else if (type === "project") {
      const maintasks = taskData.filter((t) => t.project.id === task.project.id);
      const allCompleted = maintasks.every((t) => t.maintask.status === "completed");
      if (allCompleted) {
        setTaskData((prevTasks) =>
          prevTasks.map((t) => {
            if (t.project.id === task.project.id) {
              return { ...t, project: { ...t.project, status: "completed" } };
            }
            return t;
          })
        );
        showToast("Project marked as completed!");
      } else {
        showToast("Cannot mark project as completed until all main tasks are completed.");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={studioTailwindStyles.heading_2}>Vendor Requests</h2>
          <div className={studioTailwindStyles.paragraph_2}>
            <span>{taskData.length}</span> requests found
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {["Project", "Main Task", "Vendor", "Subtask", "Description", "Status", "Media", "Actions"].map((header) => (
                  <th key={header} className={`text-left py-3 px-4 ${studioTailwindStyles.form_label}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {taskData.map((task) => (
                <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors" data-project={task.project.id} data-maintask={task.maintask.id}>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div>
                        <div className={studioTailwindStyles.form_text}>{task.project.name}</div>
                        <div className={studioTailwindStyles.paragraph_2}>Project ID: {task.project.id}</div>
                      </div>
                      <select
                        className={`px-2 py-1 rounded ${studioTailwindStyles.form_text} border-none ${updateStatusStyles(task.project.status)}`}
                        value={task.project.status}
                        onChange={(e) => handleStatusChange(task.project.id, "project", e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div>
                        <div className={studioTailwindStyles.form_text}>{task.maintask.name}</div>
                        <div className={studioTailwindStyles.paragraph_2}>Task ID: {task.maintask.id}</div>
                      </div>
                      <select
                        className={`px-2 py-1 rounded ${studioTailwindStyles.form_text} border-none ${updateStatusStyles(task.maintask.status)}`}
                        value={task.maintask.status}
                        onChange={(e) => handleStatusChange(task.maintask.id, "maintask", e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className={studioTailwindStyles.form_text}>{task.vendor}</div>
                    <div className={studioTailwindStyles.paragraph_2}>{task.vendorRole}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className={studioTailwindStyles.form_text}>{task.subtask}</div>
                    <div className={studioTailwindStyles.paragraph_2}>{task.subtaskDetail}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-700 max-w-xs">
                      <span className="description-text">{task.description}</span>
                      <button
                        className="ml-2 text-[#E07A5F] hover:text-[#d16a4f]"
                        onClick={() => openDescriptionModal(task.description, document.querySelector(`[data-project="${task.project.id}"] .description-text`))}
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-edit-line text-xs"></i>
                        </div>
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      className={`px-2 py-1 rounded ${studioTailwindStyles.form_text} border-none ${updateStatusStyles(task.status)}`}
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, "subtask", e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      className="text-[#E07A5F] hover:text-[#d16a4f] text-sm font-medium"
                      onClick={() => openMediaModal(task.images, task.videos)}
                    >
                      View Media
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        className={`text-[#10B981] hover:text-green-600 ${task.maintask.status === "completed" ? "text-green-600" : ""}`}
                        onClick={() => handleUpdateStatus(task.id, "maintask")}
                        title="Update Main Task Status"
                      >
                        <div className="w-6 h-6 flex items-center justify-center">
                          <i className={task.maintask.status === "completed" ? "ri-check-double-line" : "ri-check-line"}></i>
                        </div>
                      </button>
                      <button
                        className={`text-[#E07A5F] hover:text-[#d16a4f] ${task.project.status === "completed" ? "text-green-600" : ""}`}
                        onClick={() => handleUpdateStatus(task.id, "project")}
                        title="Update Project Status"
                      >
                        <div className="w-6 h-6 flex items-center justify-center">
                          <i className={task.project.status === "completed" ? "ri-check-double-line" : "ri-building-line"}></i>
                        </div>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TasksTable;