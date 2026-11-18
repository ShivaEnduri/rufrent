import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { studioTailwindStyles } from "../../../../utils/studioTailwindStyles";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  FileText,
  Home,
  ChevronDown,
  ChevronRight,
  Plus,
  ListTodo,
  CheckSquare
} from "lucide-react";

const StudioAdminSidebar = () => {
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();

  const toggleExpanded = (itemPath) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemPath]: !prev[itemPath]
    }));
  };

  // Extract project ID and main task ID from current URL
  const getProjectIdFromPath = () => {
    const pathParts = location.pathname.split('/');
    const projectIndex = pathParts.findIndex(part => part === 'projects');
    return projectIndex !== -1 && pathParts[projectIndex + 1] ? pathParts[projectIndex + 1] : null;
  };

  const getMainTaskIdFromPath = () => {
    const pathParts = location.pathname.split('/');
    const projectIndex = pathParts.findIndex(part => part === 'projects');
    if (projectIndex !== -1 && pathParts[projectIndex + 2] === 'tasks' && pathParts[projectIndex + 3]) {
      return pathParts[projectIndex + 3];
    }
    return null;
  };

  // Determine which sub-items should be visible based on current URL
  const getVisibleSubItems = (item) => {
    if (!item.hasSubItems) return [];
    
    const currentPath = location.pathname;
    const baseSubItems = item.subItems || [];
    const projectId = getProjectIdFromPath();
    const mainTaskId = getMainTaskIdFromPath();
    
    // Always show "Add Project"
    const visibleItems = baseSubItems.filter(subItem => subItem.path === "projects/add");
    
    // Show "Add Main Task" when on main task page (projects/:projectId/tasks) OR when a main task is selected
    if (currentPath.includes("/projects/") && currentPath.includes("/tasks") && projectId) {
      visibleItems.push({
        path: `projects/${projectId}/tasks/add-main-task`,
        icon: <ListTodo size={16} />,
        label: "Add Main Task",
      });
    }
    
    // Show "Add Subtask" when a specific main task is selected (projects/:projectId/tasks/:mainTaskId)
    if (currentPath.includes("/projects/") && currentPath.includes("/tasks/") && projectId && mainTaskId) {
      visibleItems.push({
        path: `projects/${projectId}/tasks/${mainTaskId}/add-subtask`,
        icon: <CheckSquare size={16} />,
        label: "Add Subtask",
      });
    }
    
    return visibleItems;
  };

  const navItems = [
    {
      path: "dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      exact: true,
    },
    {
      path: "projects",
      icon: <FolderOpen size={20} />,
      label: "Project Management",
      hasSubItems: true,
      subItems: [
        {
          path: "projects/add",
          icon: <Plus size={16} />,
          label: "Add Project",
        }
      ]
    },
    {
      path: "vendors",
      icon: <Users size={20} />,
      label: "Vendor Management",
    },
    {
      path: "rooms",
      icon: <Home size={20} />,
      label: "Rooms",
    },
    {
      path: "invoices",
      icon: <FileText size={20} />,
      label: "Invoices",
    },
  ];

  // Auto-expand parent menu when a sub-item is active
  useEffect(() => {
    const currentPath = location.pathname;
    navItems.forEach(item => {
      if (item.hasSubItems) {
        const visibleSubItems = getVisibleSubItems(item);
        const isSubItemActive = visibleSubItems.some(subItem => 
          currentPath.includes(subItem.path)
        );
        if (isSubItemActive) {
          setExpandedItems(prev => ({
            ...prev,
            [item.path]: true
          }));
        }
      }
    });
  }, [location.pathname]);

  return (
    <div className="bg-[#001433] text-gray-300 w-64 min-h-screen p-4">
      <NavLink to="/">
        <div className="mb-6">
          <img src="/RUFRENT6.png" className={`${studioTailwindStyles.logo}`} />
        </div>
      </NavLink>
      <nav>
        {navItems.map((item) => (
          <div key={item.path}>
            {item.hasSubItems ? (
              <div>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`
                  }
                  onClick={() => toggleExpanded(item.path)}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {expandedItems[item.path] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </NavLink>
                {expandedItems[item.path] && (
                  <div className="ml-6 mt-2 space-y-1">
                    {getVisibleSubItems(item).map((subItem) => (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 p-2 rounded-lg transition-colors text-sm ${
                            isActive
                              ? "bg-blue-600 text-white"
                              : "text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                          }`
                        }
                      >
                        {subItem.icon}
                        <span>{subItem.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default StudioAdminSidebar;
