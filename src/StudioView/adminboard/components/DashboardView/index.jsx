import React, { useEffect, useState } from "react";
import { fetchAllStudioProjects, fetchAllStudioTasksCount } from "../../../../services/studioapiservices";
import StudioStatsCard from "./StudioStatsCard";
import StudioLineChart from "./StudioLineChart";
import StudioPieChart from "./StudioPieChart";

// Import Lucide icons
import { 
  FolderOpen, 
  Clock, 
  CheckCircle, 
  Users, 
  DollarSign,
  FileText,
  AlertCircle
} from "lucide-react";

const StudioDashboard = () => {
  const [statsData, setStatsData] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalVendors: 0,
    totalRevenue: 0,
    pendingTasks: 0,
    overdueProjects: 0,
    totalInvoices: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch studio projects
        const projectsResponse = await fetchAllStudioProjects();
        const projects = projectsResponse.projects || [];
        
        // Calculate project statistics
        const totalProjects = projects.length;
        const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'in_progress').length;
        const completedProjects = projects.filter(p => p.status === 'completed').length;
        
        // For now, using mock data for other stats
        // In a real implementation, you would fetch these from appropriate APIs
        setStatsData({
          totalProjects,
          activeProjects,
          completedProjects,
          totalVendors: 25, // Mock data
          totalRevenue: 125000, // Mock data
          pendingTasks: 18, // Mock data
          overdueProjects: 3, // Mock data
          totalInvoices: 45, // Mock data
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Set default values on error
        setStatsData({
          totalProjects: 0,
          activeProjects: 0,
          completedProjects: 0,
          totalVendors: 0,
          totalRevenue: 0,
          pendingTasks: 0,
          overdueProjects: 0,
          totalInvoices: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-5">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Studio Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your studio operations and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StudioStatsCard
          IconComponent={FolderOpen}
          title="Total Projects"
          value={statsData.totalProjects}
          color="blue"
        />
        <StudioStatsCard
          IconComponent={Clock}
          title="Active Projects"
          value={statsData.activeProjects}
          color="yellow"
        />
        <StudioStatsCard
          IconComponent={CheckCircle}
          title="Completed Projects"
          value={statsData.completedProjects}
          color="green"
        />
        <StudioStatsCard
          IconComponent={Users}
          title="Total Vendors"
          value={statsData.totalVendors}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StudioStatsCard
          IconComponent={DollarSign}
          title="Total Revenue"
          value={`$${statsData.totalRevenue.toLocaleString()}`}
          color="green"
        />
        <StudioStatsCard
          IconComponent={AlertCircle}
          title="Pending Tasks"
          value={statsData.pendingTasks}
          color="red"
        />
        <StudioStatsCard
          IconComponent={Clock}
          title="Overdue Projects"
          value={statsData.overdueProjects}
          color="red"
        />
        <StudioStatsCard
          IconComponent={FileText}
          title="Total Invoices"
          value={statsData.totalInvoices}
          color="indigo"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudioLineChart />
        <StudioPieChart />
      </div>
    </div>
  );
};

export default StudioDashboard;
