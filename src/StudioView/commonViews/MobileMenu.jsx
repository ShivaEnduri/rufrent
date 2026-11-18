import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { studioTailwindStyles } from "../../utils/studioTailwindStyles";
import { STUDIO_BASE } from "../../routes/routesPath";
import { useRoleStore } from "../../store/roleStore";
import useStudioSubTasksStore from "../../store/stdSubTaskStore";
import useStudioProjectsStore from "../../store/studioProjectFilterStore"; 


const jwtSecretKey = `${import.meta.env.VITE_JWT_SECRET_KEY}`;

function MobileMenu({ isOpen, closeMobileMenu }) {
  const navigate = useNavigate();
  const { userData } = useRoleStore();
  const userRole = userData?.role; // "user", "admin", or null
  const { loadSubTasks } = useStudioSubTasksStore();
  const { projects, getProjects } = useStudioProjectsStore();

  const jwtToken = Cookies.get(jwtSecretKey);
  const isLogin = !!jwtToken; 

  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      closeMobileMenu();
    };

    const handleTouchOutside = (event) => {
      if (event.target.classList.contains("mobile-menu-overlay")) {
        closeMobileMenu();
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("touchstart", handleTouchOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("touchstart", handleTouchOutside);
    };
  }, [isOpen, closeMobileMenu]);

  const handleNavigate = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  const handleSubTasksClick = async () => {
    // Ensure projects are loaded
    if (projects.length === 0) {
      try {
        await getProjects();
      } catch (error) {
        console.error("Failed to load projects:", error);
        // Fallback: load all sub-tasks if projects can't be loaded
        await loadSubTasks();
        navigate(`${STUDIO_BASE}/taskStatus`);
        return;
      }
    }

    // Get cust_id from the first project
    const custId = projects[0]?.cust_id;

    if (custId) {
      await loadSubTasks({ cust_id: custId }); // Fetch sub-tasks filtered by cust_id
      navigate(`${STUDIO_BASE}/taskStatus?cust_id=${custId}`); // Pass cust_id in query params
    } else {
      console.warn("No cust_id found in projects. Loading all sub-tasks.");
      await loadSubTasks(); // Fallback: load all sub-tasks
      navigate(`${STUDIO_BASE}/taskStatus`);
    }
  };
  const handleLoginClick = () => {
    navigate(`${STUDIO_BASE}`); // Navigate to base path to trigger AuthModal
    closeMobileMenu();
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-40 mobile-menu-overlay ${
        isOpen ? "" : "hidden"
      } md:hidden`}
    >
      <div
        className={`fixed top-0 left-0 max-w-xs w-full h-auto bg-[#1A1F3D] shadow-xl transform ${
          isOpen ? "" : "-translate-x-full"
        } transition-transform duration-300 flex flex-col items-center`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between w-full border-b border-gray-600">
          <div className="flex flex-col">
            <img src="/RUFRENT6.png" className="h-6" alt="Rufrent Logo" />
            <span
              className={`${studioTailwindStyles.paragraph_2} mt-1 text-lg text-white tracking-widest`}
            >
              Studio
            </span>
          </div>
          <button
            className="text-white hover:text-gray-300"
            onClick={closeMobileMenu}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-close-line text-lg"></i>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-2 flex flex-col items-center space-y-2 w-full">
          {isLogin && userRole ? (
            <>
              {userRole === "user" && (
                <>
                  <button
                    onClick={() =>
                      handleNavigate(`${STUDIO_BASE}/StudioDashboard`)
                    }
                    className={`${studioTailwindStyles.header_item} flex items-center px-4 py-2 text-white hover:underline w-full text-center`}
                  >
                    <div className="w-6 h-6 flex items-center justify-center mr-2">
                      <i className="ri-dashboard-line text-lg"></i>
                    </div>
                    Dashboard
                  </button>
                  <button
                    onClick={handleSubTasksClick}
                    className={`${studioTailwindStyles.header_item} flex items-center px-4 py-2 text-white hover:underline w-full text-center`}
                  >
                    <div className="w-6 h-6 flex items-center justify-center mr-2">
                      <i className="ri-task-line text-lg"></i>
                    </div>
                    Tasks
                  </button>
                </>
              )}
               {userRole === "vendor" && (
                 <button
                  onClick={() => navigate(`${STUDIO_BASE}/vendor`)}
                  className={`${studioTailwindStyles.header_item} text-white hover:underline px-4 py-2`}>
                  Vendor Dashboard
                  </button>
               )}
              {userRole === "admin" && (
                <button
                  onClick={() => handleNavigate(`${STUDIO_BASE}/adminBoard`)}
                  className={`${studioTailwindStyles.header_item} flex items-center px-4 py-2 text-white hover:underline w-full text-center`}
                >
                  <div className="w-6 h-6 flex items-center justify-center mr-2">
                    <i className="ri-shield-user-line text-lg"></i>
                  </div>
                  Admin
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className={`${studioTailwindStyles.header_item} flex items-center px-4 py-2 text-white hover:underline w-full text-center`}
            >
              <div className="w-6 h-6 flex items-center justify-center mr-2">
                <i className="ri-login-box-line text-lg"></i>
              </div>
              Login
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}

export default MobileMenu;