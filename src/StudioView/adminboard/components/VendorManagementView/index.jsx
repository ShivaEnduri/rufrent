import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

const VendorManagementView = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data for vendors
  const mockVendors = [
    {
      id: 1,
      name: "ABC Construction Co.",
      email: "contact@abcconstruction.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, City, State 12345",
      category: "Construction",
      rating: 4.5,
      status: "active",
      projects_completed: 15,
      join_date: "2023-01-15",
      specializations: ["Interior Design", "Renovation", "Flooring"]
    },
    {
      id: 2,
      name: "XYZ Electrical Services",
      email: "info@xyzelectrical.com",
      phone: "+1 (555) 234-5678",
      address: "456 Oak Ave, City, State 12345",
      category: "Electrical",
      rating: 4.8,
      status: "active",
      projects_completed: 22,
      join_date: "2023-02-20",
      specializations: ["Wiring", "Lighting", "Smart Home"]
    },
    {
      id: 3,
      name: "Modern Plumbing Solutions",
      email: "hello@modernplumbing.com",
      phone: "+1 (555) 345-6789",
      address: "789 Pine Rd, City, State 12345",
      category: "Plumbing",
      rating: 4.2,
      status: "pending",
      projects_completed: 8,
      join_date: "2023-03-10",
      specializations: ["Bathroom Renovation", "Pipe Installation", "Water Systems"]
    },
    {
      id: 4,
      name: "Elite Paint & Decor",
      email: "contact@elitepaint.com",
      phone: "+1 (555) 456-7890",
      address: "321 Cedar Ln, City, State 12345",
      category: "Painting",
      rating: 4.6,
      status: "active",
      projects_completed: 18,
      join_date: "2023-01-30",
      specializations: ["Interior Painting", "Exterior Painting", "Decorative Finishes"]
    },
    {
      id: 5,
      name: "Green Landscaping",
      email: "info@greenlandscaping.com",
      phone: "+1 (555) 567-8901",
      address: "654 Elm St, City, State 12345",
      category: "Landscaping",
      rating: 4.3,
      status: "inactive",
      projects_completed: 12,
      join_date: "2023-02-05",
      specializations: ["Garden Design", "Lawn Care", "Outdoor Lighting"]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVendors(mockVendors);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterVendors();
  }, [vendors, searchTerm, statusFilter]);

  const filterVendors = () => {
    let filtered = vendors;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(vendor =>
        vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(vendor => vendor.status === statusFilter);
    }

    setFilteredVendors(filtered);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      inactive: "bg-red-100 text-red-800",
      suspended: "bg-gray-100 text-gray-800"
    };

    const statusIcons = {
      active: <CheckCircle size={12} />,
      pending: <Clock size={12} />,
      inactive: <XCircle size={12} />,
      suspended: <XCircle size={12} />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || statusClasses.pending}`}>
        {statusIcons[status]}
        {status?.toUpperCase() || 'PENDING'}
      </span>
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} className="text-yellow-400 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={14} className="text-yellow-400 fill-current opacity-50" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} className="text-gray-300" />);
    }

    return stars;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="w-full p-5">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading vendors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
        <p className="text-gray-600">Manage and track all studio vendors and contractors</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search vendors..."
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
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Vendor
            </button>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                <p className="text-sm text-gray-600">{vendor.category}</p>
              </div>
              {getStatusBadge(vendor.status)}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <span className="truncate">{vendor.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <span>{vendor.phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <span className="truncate">{vendor.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="flex">{renderStars(vendor.rating)}</div>
                <span className="ml-2 text-sm text-gray-600">({vendor.rating})</span>
              </div>
              <div className="text-sm text-gray-600">
                {vendor.projects_completed} projects
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Specializations:</p>
              <div className="flex flex-wrap gap-1">
                {vendor.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedVendor(vendor);
                  setShowModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
              >
                <Eye size={16} />
                View
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-50">
                <Edit size={16} />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">No vendors found</div>
        </div>
      )}

      {/* Vendor Detail Modal */}
      {showModal && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Vendor Details</h2>
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
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{selectedVendor.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="text-sm text-gray-900">{selectedVendor.category}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedVendor.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{selectedVendor.phone}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <p className="text-sm text-gray-900">{selectedVendor.address}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rating</label>
                  <div className="flex items-center">
                    <div className="flex">{renderStars(selectedVendor.rating)}</div>
                    <span className="ml-2 text-sm text-gray-600">({selectedVendor.rating})</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Projects Completed</label>
                  <p className="text-sm text-gray-900">{selectedVendor.projects_completed}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getStatusBadge(selectedVendor.status)}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Join Date</label>
                <p className="text-sm text-gray-900">{formatDate(selectedVendor.join_date)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Specializations</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedVendor.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
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
                Edit Vendor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Vendor</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter vendor name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select category</option>
                  <option value="Construction">Construction</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Painting">Painting</option>
                  <option value="Landscaping">Landscaping</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter address"
                ></textarea>
              </div>
            </form>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManagementView;
