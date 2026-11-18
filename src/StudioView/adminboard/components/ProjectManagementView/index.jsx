import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllStudioProjects } from "../../../../services/studioapiservices";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Calendar,
  User,
  DollarSign,
  CheckSquare,
  FileText,
  CreditCard
} from "lucide-react";

const ProjectManagementView = () => {
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [activeTab, setActiveTab] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, statusFilter]);


  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetchAllStudioProjects();
      setProjects(response.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      on_hold: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || statusClasses.pending}`}>
        {status?.replace('_', ' ').toUpperCase() || 'PENDING'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleTaskButtonClick = (project) => {
    navigate(`/base/studio/AdminBoard/projects/${project.id}/tasks`);
  };

  const handleDocumentButtonClick = (project) => {
    setExpandedCards(prev => ({
      ...prev,
      [project.id]: true
    }));
    setActiveTab(prev => ({
      ...prev,
      [project.id]: 'documents'
    }));
  };

  const handlePaymentPlanButtonClick = (project) => {
    setExpandedCards(prev => ({
      ...prev,
      [project.id]: true
    }));
    setActiveTab(prev => ({
      ...prev,
      [project.id]: 'payment-plan'
    }));
  };

  const handleDetailsButtonClick = (project) => {
    setExpandedCards(prev => ({
      ...prev,
      [project.id]: true
    }));
    setActiveTab(prev => ({
      ...prev,
      [project.id]: 'details'
    }));
  };

  const toggleCardExpansion = (projectId) => {
    setExpandedCards(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const setActiveTabForProject = (projectId, tab) => {
    setActiveTab(prev => ({
      ...prev,
      [projectId]: tab
    }));
  };

  if (loading) {
    return (
      <div className="w-full p-5">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading projects...</div>
        </div>
      </div>
    );
  }


  // Show project cards view
  return (
    <div className="w-full p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
        <p className="text-gray-600">Manage and track all studio projects</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
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
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="on_hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus size={20} />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Project Cards */}
      <div className="space-y-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {project.project_name || 'Unnamed Project'}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {project.id}</p>
                </div>
                {getStatusBadge(project.status)}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span>{project.customer_name || 'N/A'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>{formatCurrency(project.budget)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(project.start_date)}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">{project.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {/* Primary Actions Row */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTaskButtonClick(project)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <CheckSquare size={14} />
                    Tasks
                  </button>
                  <button
                    onClick={() => handleDocumentButtonClick(project)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <FileText size={14} />
                    Documents
                  </button>
                </div>
                
                {/* Secondary Actions Row */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePaymentPlanButtonClick(project)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    <CreditCard size={14} />
                    Payment Plan
                  </button>
                  <button
                    onClick={() => handleDetailsButtonClick(project)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit Project"
                  >
                    <Edit size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Expandable Content */}
            {expandedCards[project.id] && (
              <div className="border-t border-gray-200 bg-gray-50">
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTabForProject(project.id, 'details')}
                    className={`px-4 py-3 text-sm font-medium ${
                      activeTab[project.id] === 'details'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Eye size={16} className="inline mr-2" />
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTabForProject(project.id, 'documents')}
                    className={`px-4 py-3 text-sm font-medium ${
                      activeTab[project.id] === 'documents'
                        ? 'text-green-600 border-b-2 border-green-600 bg-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FileText size={16} className="inline mr-2" />
                    Documents
                  </button>
                  <button
                    onClick={() => setActiveTabForProject(project.id, 'payment-plan')}
                    className={`px-4 py-3 text-sm font-medium ${
                      activeTab[project.id] === 'payment-plan'
                        ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <CreditCard size={16} className="inline mr-2" />
                    Payment Plan
                  </button>
                  <button
                    onClick={() => toggleCardExpansion(project.id)}
                    className="ml-auto px-4 py-3 text-gray-400 hover:text-gray-600"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab[project.id] === 'details' && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">Project Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Project Name</label>
                          <p className="text-sm text-gray-900">{project.project_name || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Customer</label>
                          <p className="text-sm text-gray-900">{project.customer_name || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <div className="mt-1">{getStatusBadge(project.status)}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Budget</label>
                          <p className="text-sm text-gray-900">{formatCurrency(project.budget)}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Date</label>
                          <p className="text-sm text-gray-900">{formatDate(project.start_date)}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Progress</label>
                          <div className="mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${project.progress || 0}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{project.progress || 0}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab[project.id] === 'documents' && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">Project Documents</h4>
                      <div className="text-center py-8 text-gray-500">
                        <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>No documents uploaded yet</p>
                        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                          Upload Document
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab[project.id] === 'payment-plan' && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">Payment Plan</h4>
                      <div className="text-center py-8 text-gray-500">
                        <CreditCard size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>No payment plan configured yet</p>
                        <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                          Create Payment Plan
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">No projects found</div>
        </div>
      )}

      {/* Project Detail Modal */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Project Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <p className="text-sm text-gray-900">{selectedProject.project_name || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <p className="text-sm text-gray-900">{selectedProject.customer_name || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getStatusBadge(selectedProject.status)}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Budget</label>
                <p className="text-sm text-gray-900">{formatCurrency(selectedProject.budget)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <p className="text-sm text-gray-900">{formatDate(selectedProject.start_date)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Progress</label>
                <div className="mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${selectedProject.progress || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{selectedProject.progress || 0}%</p>
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
                Edit Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagementView;
