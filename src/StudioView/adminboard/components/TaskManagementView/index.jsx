import React, { useState, useEffect } from "react";
import { fetchAllStudioTasks, fetchStudioSubTasks } from "../../../../services/studioapiservices";
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

const TaskManagementView = () => {
  const [mainTasks, setMainTasks] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSubTasks, setShowSubTasks] = useState(false);
  const [selectedMainTask, setSelectedMainTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [mainTasks, searchTerm, statusFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // For now, using mock data since we need a project_id for the API
      const mockMainTasks = [
        {
          id: 1,
          project_id: 1,
          task_name: "Site Preparation",
          description: "Prepare the construction site for renovation work",
          status: "in_progress",
          priority: "high",
          assigned_to: "John Smith",
          due_date: "2024-01-15",
          created_date: "2024-01-01",
          progress: 60,
          estimated_hours: 40,
          actual_hours: 24
        },
        {
          id: 2,
          project_id: 1,
          task_name: "Electrical Installation",
          description: "Install electrical wiring and fixtures",
          status: "pending",
          priority: "medium",
          assigned_to: "Mike Johnson",
          due_date: "2024-01-20",
          created_date: "2024-01-02",
          progress: 0,
          estimated_hours: 32,
          actual_hours: 0
        },
        {
          id: 3,
          project_id: 1,
          task_name: "Plumbing Work",
          description: "Install plumbing fixtures and connections",
          status: "completed",
          priority: "high",
          assigned_to: "Sarah Wilson",
          due_date: "2024-01-10",
          created_date: "2024-01-01",
          progress: 100,
          estimated_hours: 24,
          actual_hours: 26
        },
        {
          id: 4,
          project_id: 2,
          task_name: "Interior Design Planning",
          description: "Create detailed interior design plans",
          status: "in_progress",
          priority: "high",
          assigned_to: "Lisa Brown",
          due_date: "2024-01-25",
          created_date: "2024-01-05",
          progress: 75,
          estimated_hours: 48,
          actual_hours: 36
        },
        {
          id: 5,
          project_id: 2,
          task_name: "Material Procurement",
          description: "Source and order required materials",
          status: "on_hold",
          priority: "medium",
          assigned_to: "David Lee",
          due_date: "2024-01-30",
          created_date: "2024-01-06",
          progress: 30,
          estimated_hours: 16,
          actual_hours: 5
        }
      ];

      setMainTasks(mockMainTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = mainTasks;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.task_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      on_hold: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800"
    };

    const statusIcons = {
      pending: <Clock size={12} />,
      in_progress: <Play size={12} />,
      completed: <CheckCircle size={12} />,
      on_hold: <Pause size={12} />,
      cancelled: <XCircle size={12} />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || statusClasses.pending}`}>
        {statusIcons[status]}
        {status?.replace('_', ' ').toUpperCase() || 'PENDING'}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityClasses = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
      urgent: "bg-purple-100 text-purple-800"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityClasses[priority] || priorityClasses.medium}`}>
        {priority?.toUpperCase() || 'MEDIUM'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const handleViewSubTasks = async (mainTask) => {
    setSelectedMainTask(mainTask);
    setShowSubTasks(true);
    
    try {
      // Fetch sub-tasks for the main task
      const response = await fetchStudioSubTasks({ main_task: mainTask.id });
      setSubTasks(response.result || []);
    } catch (error) {
      console.error("Error fetching sub-tasks:", error);
      setSubTasks([]);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-5">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
        <p className="text-gray-600">Manage and track all studio project tasks</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus size={20} />
              New Task
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {task.task_name}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {task.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">
                        {task.assigned_to}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(task.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityBadge(task.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span className={`text-sm ${isOverdue(task.due_date) && task.status !== 'completed' ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {formatDate(task.due_date)}
                        {isOverdue(task.due_date) && task.status !== 'completed' && (
                          <AlertCircle className="inline h-4 w-4 ml-1 text-red-500" />
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${task.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {task.progress || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {task.actual_hours || 0}/{task.estimated_hours || 0}h
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleViewSubTasks(task)}
                        className="text-green-600 hover:text-green-900"
                        title="View Sub-tasks"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900" title="Edit Task">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Delete Task">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">No tasks found</div>
        </div>
      )}

      {/* Task Detail Modal */}
      {showModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Task Name</label>
                  <p className="text-sm text-gray-900">{selectedTask.task_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                  <p className="text-sm text-gray-900">{selectedTask.assigned_to}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900">{selectedTask.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedTask.status)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <div className="mt-1">{getPriorityBadge(selectedTask.priority)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedTask.due_date)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created Date</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedTask.created_date)}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Progress</label>
                <div className="mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${selectedTask.progress || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{selectedTask.progress || 0}%</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estimated Hours</label>
                  <p className="text-sm text-gray-900">{selectedTask.estimated_hours || 0}h</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Actual Hours</label>
                  <p className="text-sm text-gray-900">{selectedTask.actual_hours || 0}h</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Edit Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tasks Modal */}
      {showSubTasks && selectedMainTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Sub-tasks for: {selectedMainTask.task_name}
              </h2>
              <button
                onClick={() => setShowSubTasks(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {subTasks.length > 0 ? (
                <div className="space-y-2">
                  {subTasks.map((subTask, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{subTask.sub_task_name || `Sub-task ${index + 1}`}</h3>
                          <p className="text-sm text-gray-600">{subTask.description || 'No description available'}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(subTask.status || 'pending')}
                          {getPriorityBadge(subTask.priority || 'medium')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500">No sub-tasks found for this main task</div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowSubTasks(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Sub-task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagementView;
