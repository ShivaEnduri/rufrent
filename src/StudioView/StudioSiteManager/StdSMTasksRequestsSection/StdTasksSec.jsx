import React, { useState, useEffect } from "react";
import { studioTailwindStyles } from "../../styles/studioTailwindStyles";
import TasksTable from "./TasksTable";

const TasksSection = ({ openMediaModal, openDescriptionModal, showToast }) => {
  const [filters, setFilters] = useState({
    vendor: "",
    project: "",
    maintask: "",
    subtask: "",
    status: "",
  });

  const [filteredTasks, setFilteredTasks] = useState([
    {
      id: 1,
      project: { name: "Downtown Plaza", id: "DP-001", status: "pending" },
      maintask: { name: "Foundation Work", id: "FW-001", status: "pending" },
      vendor: "BuildCorp Solutions",
      vendorRole: "Primary Contractor",
      subtask: "Concrete Pouring",
      subtaskDetail: "Section A-1",
      description: "Completed concrete pouring for foundation section A-1 with proper curing process",
      status: "completed",
      images: [
        "https://readdy.ai/api/search-image?query=construction%20concrete%20foundation%20before%20work%20site%20preparation%20excavation%20ground&width=800&height=600&seq=1&orientation=landscape",
        "https://readdy.ai/api/search-image?query=construction%20concrete%20foundation%20after%20completed%20pouring%20smooth%20surface%20professional%20quality&width=800&height=600&seq=2&orientation=landscape",
      ],
      videos: [
        "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
      ],
    },
    {
      id: 2,
      project: { name: "Downtown Plaza", id: "DP-001", status: "pending" },
      maintask: { name: "Foundation Work", id: "FW-001", status: "pending" },
      vendor: "Elite Construction",
      vendorRole: "Electrical Specialist",
      subtask: "Wiring Installation",
      subtaskDetail: "Floor 1-3",
      description: "Installing electrical wiring system for floors 1-3 with safety compliance",
      status: "in-progress",
      images: [
        "https://readdy.ai/api/search-image?query=electrical%20wiring%20installation%20before%20empty%20walls%20conduits%20preparation%20construction%20site&width=800&height=600&seq=3&orientation=landscape",
        "https://readdy.ai/api/search-image?query=electrical%20wiring%20installation%20after%20completed%20cables%20organized%20professional%20installation&width=800&height=600&seq=4&orientation=landscape",
      ],
      videos: ["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"],
    },
    {
      id: 3,
      project: { name: "Metro Station", id: "MS-003", status: "pending" },
      maintask: { name: "Plumbing System", id: "PS-001", status: "pending" },
      vendor: "ProBuild Systems",
      vendorRole: "Plumbing Contractor",
      subtask: "Pipe Fitting",
      subtaskDetail: "Main Lines",
      description: "Main water and drainage pipe installation with pressure testing completed",
      status: "pending",
      images: [
        "https://readdy.ai/api/search-image?query=plumbing%20pipe%20installation%20before%20excavated%20trenches%20preparation%20construction%20site%20underground&width=800&height=600&seq=5&orientation=landscape",
        "https://readdy.ai/api/search-image?query=plumbing%20pipe%20installation%20after%20completed%20pipes%20connected%20professional%20installation%20underground&width=800&height=600&seq=6&orientation=landscape",
      ],
      videos: [
        "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
      ],
    },
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filtered = filteredTasks.filter((task) => {
      return (
        (!filters.vendor || task.vendor === filters.vendor) &&
        (!filters.project || task.project.name === filters.project) &&
        (!filters.maintask || task.maintask.name === filters.maintask) &&
        (!filters.subtask || task.subtask === filters.subtask) &&
        (!filters.status || task.status === filters.status)
      );
    });
    setFilteredTasks(filtered);
    showToast("Filters applied successfully!");
  };

  const resetFilters = () => {
    setFilters({ vendor: "", project: "", maintask: "", subtask: "", status: "" });
    setFilteredTasks([...filteredTasks]); // Reset to original tasks (you might want to store original tasks separately)
    showToast("Filters reset successfully!");
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <h2 className={studioTailwindStyles.heading_2}>Filter Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            {[
              { label: "Vendor Name", name: "vendor", options: ["", "BuildCorp Solutions", "Elite Construction", "ProBuild Systems", "Urban Development"] },
              { label: "Project Name", name: "project", options: ["", "Downtown Plaza", "Riverside Complex", "Metro Station", "Shopping Center"] },
              { label: "Main Task", name: "maintask", options: ["", "Foundation Work", "Electrical Installation", "Plumbing System", "Interior Finishing"] },
              { label: "Subtask Name", name: "subtask", options: ["", "Concrete Pouring", "Wiring Installation", "Pipe Fitting", "Wall Painting"] },
              { label: "Status", name: "status", options: ["", "pending", "in-progress", "completed"] },
            ].map((filter) => (
              <div key={filter.name}>
                <label className={studioTailwindStyles.form_label}>{filter.label}</label>
                <div className="relative">
                  <select
                    name={filter.name}
                    value={filters[filter.name]}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent bg-white pr-8"
                  >
                    {filter.options.map((option) => (
                      <option key={option} value={option}>
                        {option || `All ${filter.label.replace(" Name", "s")}`}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-3">
            <button onClick={applyFilters} className={studioTailwindStyles.form_main_button}>
              Apply Filters
            </button>
            <button onClick={resetFilters} className={studioTailwindStyles.form_secondary_button}>
              Reset
            </button>
          </div>
        </div>
      </div>
      <TasksTable
        tasks={filteredTasks}
        openMediaModal={openMediaModal}
        openDescriptionModal={openDescriptionModal}
        showToast={showToast}
      />
    </div>
  );
};

export default TasksSection;