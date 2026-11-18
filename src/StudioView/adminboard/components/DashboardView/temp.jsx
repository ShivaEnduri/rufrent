import React, { useEffect, useState } from 'react';
import useAppStore from "../../../store/appstore";

function Users({ projectId, mainTaskId, navigateToView }) {
  const [mainTasks, setMainTasks] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubTasks, setIsLoadingSubTasks] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [subTaskSearchQuery, setSubTaskSearchQuery] = useState('');
  const [selectedMainTask, setSelectedMainTask] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  
  // Get statuses from store
  const { statuses, fetchStatuses } = useAppStore();

  // Fetch project details by ID
  const fetchProject = async (projectId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/project/getAllstudioprojects`);
      const data = await response.json();
      const result = data.result || [];
      const projects = Array.isArray(result) ? result : [];
      const project = projects.find(p => p.id == projectId);
      if (project) {
        setCurrentProject(project);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    if (currentProject?.id) {
      fetchMainTasks(currentProject.id);
    }
  }, [currentProject]);

  useEffect(() => {
    if (mainTaskId && mainTasks.length > 0) {
      const mainTask = mainTasks.find(t => t.id == mainTaskId);
      if (mainTask) {
        setSelectedMainTask(mainTask);
        fetchSubTasks(mainTask.id);
      }
    }
  }, [mainTaskId, mainTasks]);

  const fetchMainTasks = async (projectId) => {
      try {
        setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/maintask/getAllStudioMainTasks?proj_id=${projectId}`);
      const data = await response.json();
      
      const result = data.result || data.data || [];
      setMainTasks(Array.isArray(result) ? result : []);
      } catch (err) {
      setError('Failed to fetch main tasks');
        console.error(err);
      setMainTasks([]);
      } finally {
        setIsLoading(false);
      }
    };
    
  const fetchSubTasks = async (mainTaskId) => {
    try {
      setIsLoadingSubTasks(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/subtask/getAllStudioSubTasks?maintask_id=${mainTaskId}`);
      const data = await response.json();
      
      const result = data.result || data.data || [];
      setSubTasks(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error('Failed to fetch subtasks:', err);
      setSubTasks([]);
    } finally {
      setIsLoadingSubTasks(false);
    }
  };

  // Helper function to get status code by ID
  const getStatusCodeById = (statusId) => {
    const status = statuses.find(s => s.id === statusId);
    return status ? status.status_code : 'Unknown';
  };

  // Handle main task selection
  const handleMainTaskSelect = (mainTask) => {
    setSelectedMainTask(mainTask);
    fetchSubTasks(mainTask.id);
    // Update URL with main task ID
    navigateToView('Users', projectId, mainTask.id);
  };

  // Filter main tasks by search
  const q = searchQuery.trim().toLowerCase();
  const filteredMainTasks = q
    ? mainTasks.filter((t) => {
        const values = [
          t.id,
          t.main_task_name,
          t.vendor_id,
          t.start_date,
          t.end_date,
        ]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase());
        return values.some((v) => v.includes(q));
      })
    : mainTasks;

  // Filter subtasks by search
  const subQ = subTaskSearchQuery.trim().toLowerCase();
  const filteredSubTasks = subQ
    ? subTasks.filter((t) => {
        const values = [
          t.id,
          t.sub_task_name,
          t.sub_task_description,
          t.start_date,
          t.end_date,
        ]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase());
        return values.some((v) => v.includes(subQ));
      })
    : subTasks;

  if (!currentProject) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center">
        <div className="text-xl text-gray-500">Please select a project to view main tasks</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center">
        <div className="text-xl">Loading main tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full">
      <div className="flex items-center gap-4 mb-8 px-2 sm:px-8 pt-8">
        <h2 className="text-base sm:text-lg md:text-xl font-bold">Main Tasks & Sub Tasks - {currentProject.project_name}</h2>
      </div>
      
      {/* Two Column Layout */}
      <div className="flex gap-4 px-2 sm:px-8 pb-8 h-full">
        {/* Left Column - Main Tasks */}
        <div className="w-1/2">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-semibold">Main Tasks</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search main tasks..."
              className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto">
            {filteredMainTasks.map((mainTask) => (
              <div
                key={mainTask.id}
                className={`rounded-lg shadow p-3 border flex flex-col gap-2 text-sm cursor-pointer hover:scale-105 transition-transform relative ${
                  selectedMainTask?.id === mainTask.id 
                    ? 'bg-blue-100 border-2 border-blue-500' 
                    : 'bg-white border border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                }`}
                onClick={() => handleMainTaskSelect(mainTask)}
              >
                {/* Status Badge - Top Right Corner */}
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getStatusCodeById(mainTask.task_status)}
                  </span>
                </div>
                
                <div className="flex-1 pr-16">
                  <div className="text-gray-700 text-sm mb-0.5 font-semibold">{mainTask.main_task_name || `Task #${mainTask.id}`}</div>
                  <div className="text-gray-700 text-sm mb-0.5">Vendor ID: <span className="font-medium">{mainTask.vendor_id || 'N/A'}</span></div>
                  <div className="text-gray-700 text-sm mb-0.5">Cost: <span className="font-medium">₹{mainTask.task_cost?.toLocaleString() || 'N/A'}</span></div>
                  <div className="text-gray-700 text-sm mb-0.5">Start: <span className="font-medium">{mainTask.start_date || 'N/A'}</span></div>
                  <div className="text-gray-700 text-sm mb-1">End: <span className="font-medium">{mainTask.end_date || 'N/A'}</span></div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    className="py-1.5 px-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors text-xs font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Edit main task:', mainTask);
                    }}
                    title="Edit Main Task"
                  >
                    <i className="ri-edit-line"></i>
                  </button>
                  <button
                    className="py-1.5 px-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors text-xs font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Delete main task:', mainTask);
                    }}
                    title="Delete Main Task"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredMainTasks.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500 text-lg">No main tasks found for this project</div>
            </div>
          )}
        </div>

        {/* Right Column - Sub Tasks */}
        <div className="w-1/2">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-semibold">
              Sub Tasks {selectedMainTask && `- ${selectedMainTask.main_task_name}`}
            </h3>
            <input
              type="text"
              value={subTaskSearchQuery}
              onChange={(e) => setSubTaskSearchQuery(e.target.value)}
              placeholder="Search subtasks..."
              className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          
          {!selectedMainTask ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500 text-lg">Select a main task to view subtasks</div>
            </div>
          ) : isLoadingSubTasks ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-xl">Loading subtasks...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto">
              {filteredSubTasks.map((subTask) => (
                <div
                  key={subTask.id}
                  className="bg-white rounded-lg shadow p-3 border border-gray-200 flex flex-col gap-2 text-sm hover:scale-105 transition-transform hover:border-green-500 hover:bg-green-50 relative"
                >
                  {/* Status Badge - Top Right Corner */}
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {getStatusCodeById(subTask.task_status)}
                    </span>
                  </div>
                  
                  <div className="flex-1 pr-16">
                    <div className="text-gray-700 text-sm mb-0.5 font-semibold">{subTask.sub_task_name || `Sub Task #${subTask.id}`}</div>
                    <div className="text-gray-700 text-sm mb-0.5">Description: <span className="font-medium">{subTask.sub_task_description || 'N/A'}</span></div>
                    <div className="text-gray-700 text-sm mb-0.5">Cost: <span className="font-medium">₹{subTask.sub_task_cost?.toLocaleString() || 'N/A'}</span></div>
                    <div className="text-gray-700 text-sm mb-0.5">Start: <span className="font-medium">{subTask.start_date || 'N/A'}</span></div>
                    <div className="text-gray-700 text-sm mb-1">End: <span className="font-medium">{subTask.end_date || 'N/A'}</span></div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <button
                      className="py-1.5 px-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors text-xs font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Edit sub task:', subTask);
                      }}
                      title="Edit Sub Task"
                    >
                      <i className="ri-edit-line"></i>
                    </button>
                    <button
                      className="py-1.5 px-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors text-xs font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Add media to sub task:', subTask);
                      }}
                      title="Add Media"
                    >
                      <i className="ri-add-line"></i>
                    </button>
                    <button
                      className="py-1.5 px-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition-colors text-xs font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Show media for sub task:', subTask);
                      }}
                      title="Show Media"
                    >
                      <i className="ri-image-line"></i>
                    </button>
                    <button
                      className="py-1.5 px-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors text-xs font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Delete sub task:', subTask);
                      }}
                      title="Delete Sub Task"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
              ))}
              
              {filteredSubTasks.length === 0 && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500 text-lg">No subtasks found for this main task</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Users; 