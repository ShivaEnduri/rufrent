


// import React, { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import { useNavigate, useLocation } from "react-router-dom";
// import AuthModal from "../../components/CommonViews/auth/AuthModalView";
// import StudioProfileDropdown from "./StudioProfileDropdown";
// import MobileMenu from "./MobileMenu";
// import { studioTailwindStyles } from "../../utils/studioTailwindStyles";
// import { STUDIO_BASE } from "../../routes/routesPath";
// import { useRoleStore } from "../../store/roleStore";
// import useStudioSubTasksStore from "../../store/stdSubTaskStore";
// import useStudioProjectsStore from "../../store/studioProjectFilterStore";

// const jwtSecretKey = `${import.meta.env.VITE_JWT_SECRET_KEY}`;

// const Navbar = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();

//   const jwtToken = Cookies.get(jwtSecretKey);
//   const isLogin = !!jwtToken; // Ensure boolean value

//   const { userData } = useRoleStore(); // Get role and user data from store
//   const userRole = userData?.role ? userData.role.toLowerCase() : null; // Normalize role to lowercase
//   const { loadSubTasks } = useStudioSubTasksStore();
//   const { projects } = useStudioProjectsStore(); // Only access projects, don't fetch here

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 400);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);
//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//   const handleSubTasksClick = async () => {
//     // Use cust_id from userData if available
//     const custId = userData?.id;

//     if (!custId) {
//       console.warn("No cust_id available in userData. Loading all sub-tasks.");
//       await loadSubTasks(); // Fallback: load all sub-tasks
//       navigate(`${STUDIO_BASE}/taskStatus`);
//       return;
//     }

//     // Use first project's cust_id if projects are loaded, otherwise use userData.id
//     const projectCustId = projects[0]?.cust_id || custId;

//     try {
//       await loadSubTasks({ cust_id: projectCustId }); // Fetch sub-tasks filtered by cust_id
//       navigate(`${STUDIO_BASE}/taskStatus?cust_id=${projectCustId}`); // Pass cust_id in query params
//     } catch (error) {
//       console.error("Failed to load sub-tasks:", error);
//       navigate(`${STUDIO_BASE}/taskStatus`);
//     }
//   };

//   return (
//     <>
//       <nav
//         className={`bg-[#1A1F3D] md:${
//           isScrolled || location.pathname !== `${STUDIO_BASE}`
//             ? "w-full sticky top-0 left-0"
//             : "w-[calc(100vw-100px)] mx-auto"
//         } w-full py-1 px-5 md:px-10 flex flex-col justify-between items-center z-30 transition-all duration-200 ease-linear`}
//       >
//         <div className="container mx-auto py-2 flex justify-between items-center font-semibold">
//           {/* Logo / Landing Page Button */}
//           <div className="flex items-center">
//             <button onClick={() => navigate(`${STUDIO_BASE}`)}>
//               <img src="/RUFRENT6.png" className="h-6 lg:h-8" alt="RUFRENT" />
//               <div className="justify-self-start">
//                 <span
//                   className={`${studioTailwindStyles.paragraph_2} pl-1 tracking-widest text-white`}
//                 >
//                   Studio
//                 </span>
//               </div>
//             </button>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8">
//             <nav className="hidden md:flex items-center space-x-4">
//               {isLogin && userRole ? (
//                 <>
//                   {userRole === "user" && (
//                     <>
//                       <button
//                         onClick={() => navigate(`${STUDIO_BASE}/studioDashboard`)}
//                         className={`${studioTailwindStyles.header_item} text-white hover:underline px-4 py-2`}
//                       >
//                         Dashboard
//                       </button>
//                       <button
//                         onClick={handleSubTasksClick}
//                         className={`${studioTailwindStyles.header_item} text-white hover:underline px-4 py-2`}
//                       >
//                         Tasks
//                       </button>
//                     </>
//                   )}
//                   {userRole === "vendor" && (
//                     <>
//                       <button
//                         onClick={() => navigate(`${STUDIO_BASE}/vendor`)}
//                         className={`${studioTailwindStyles.header_item} text-white hover:underline px-4 py-2`}
//                       >
//                         Vendor Dashboard
//                       </button>
//                       <button
//                         onClick={() => navigate(`${STUDIO_BASE}/siteManager`)}
//                         className={`${studioTailwindStyles.header_item} text-white hover:underline px-4 py-2`}
//                       >
//                         Site Manager
//                       </button>
//                     </>
//                   )}
//                   {userRole === "admin" && (
//                     <button
//                       onClick={() => navigate(`${STUDIO_BASE}/adminBoard`)}
//                       className={`${studioTailwindStyles.header_item} text-white hover:underline px-4 py-2`}
//                     >
//                       Admin
//                     </button>
//                   )}
//                 </>
//               ) : null}
//             </nav>

//             {/* Login / Profile */}
//             {isLogin ? (
//               <StudioProfileDropdown />
//             ) : (
//               <button
//                 onClick={openModal}
//                 className={`${studioTailwindStyles.header_item} text-white hover:underline px-4 py-2`}
//               >
//                 Login
//               </button>
//             )}

//             {/* Mobile Menu Toggle */}
//             <button
//               className="md:hidden text-white hover:text-gray-300 mr-4"
//               onClick={toggleMobileMenu}
//             >
//               <div className="w-6 h-6 flex items-end justify-end">
//                 <i className="ri-menu-line text-lg"></i>
//               </div>
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Modals */}
//       <AuthModal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         triggerBy={`${STUDIO_BASE}`}
//       />
//       <MobileMenu isOpen={isMobileMenuOpen} closeMobileMenu={toggleMobileMenu} userRole={userRole} />
//     </>
//   );
// };

// export default Navbar;



//src/components/Studio/Navbar/Navbar.jsx
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import AuthModal from "../../components/CommonViews/auth/AuthModalView";
import StudioProfileDropdown from "./StudioProfileDropdown";
import MobileMenu from "./MobileMenu";
import MenuDropdown from "../../components/CommonViews/menuDropdown/MenuDropdown"; 
import { studioTailwindStyles } from "../../utils/studioTailwindStyles";
import { STUDIO_BASE } from "../../routes/routesPath";
import { useRoleStore } from "../../store/roleStore";
import useStudioSubTasksStore from "../../store/stdSubTaskStore";
import useStudioProjectsStore from "../../store/studioProjectFilterStore";

const jwtSecretKey = `${import.meta.env.VITE_JWT_SECRET_KEY}`;

const StudioNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const jwtToken = Cookies.get(jwtSecretKey);
  const isLogin = !!jwtToken;

  const { userData } = useRoleStore();
  const userRole = userData?.role?.toLowerCase();
  const { loadSubTasks } = useStudioSubTasksStore();
  const { projects } = useStudioProjectsStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSubTasksClick = async () => {
    const custId = projects[0]?.cust_id || userData?.id;
    try {
      await loadSubTasks({ cust_id: custId });
      navigate(`${STUDIO_BASE}/taskStatus?cust_id=${custId}`);
    } catch {
      navigate(`${STUDIO_BASE}/taskStatus`);
    }
  };

  return (
    <>
      <nav
        className={`bg-[#1A1F3D] md:${
          isScrolled || location.pathname !== `${STUDIO_BASE}`
            ? "w-full sticky top-0 left-0"
            : "w-[calc(100vw-100px)] mx-auto"
        } w-full py-1 px-5 md:px-10 flex flex-col justify-between items-center z-30 transition-all duration-200 ease-linear`}
      >
        <div className="container mx-auto py-2 flex justify-between items-center font-semibold">
          {/* Logo */}
          <button onClick={() => navigate(`${STUDIO_BASE}`)}>
            <img src="/RUFRENT6.png" className="h-6 lg:h-8" alt="RUFRENT" />
             <div className="justify-self-start">
            <span className={`${studioTailwindStyles.paragraph_2} pl-1 tracking-widest text-white`}>
              Studio
            </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8">
            <nav className="hidden md:flex items-center space-x-4">
              {isLogin && userRole && (
                <>
                  {userRole === "user" && (
                    <>
                      <button
                        onClick={() => navigate(`${STUDIO_BASE}/studioDashboard`)}
                        className={`${studioTailwindStyles.header_item} text-white hover:underline px-4 py-2`}
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleSubTasksClick}
                        className={`${studioTailwindStyles.header_item} text-white hover:underline px-4 py-2`}
                      >
                        Tasks
                      </button>
                    </>
                  )}
                  {userRole === "vendor" && (
                    <>
                      <button
                        onClick={() => navigate(`${STUDIO_BASE}/vendor`)}
                        className={`${studioTailwindStyles.header_item} text-white hover:underline px-4 py-2`}
                      >
                        Vendor Dashboard
                      </button>
                      <button
                        onClick={() => navigate(`${STUDIO_BASE}/siteManager`)}
                        className={`${studioTailwindStyles.header_item} text-white hover:underline px-4 py-2`}
                      >
                        Site Manager
                      </button>
                    </>
                  )}
                  {userRole === "admin" && (
                    <button
                      onClick={() => navigate(`${STUDIO_BASE}/adminBoard`)}
                      className={`${studioTailwindStyles.header_item} text-white hover:underline px-4 py-2`}
                    >
                      Admin
                    </button>
                  )}
                </>
              )}
            </nav>

           

            {/* Login / Profile */}
            {isLogin ? (
              <StudioProfileDropdown />
            ) : (
              <button
                onClick={openModal}
                className={`${studioTailwindStyles.header_item} text-white hover:underline px-4 py-2`}
              >
                Login
              </button>
            )}
             {/* Menu Dropdown (Studio: only common items) */}
            <MenuDropdown app="studio" />

            {/* Mobile Toggle */}
            <button className="md:hidden text-white" onClick={toggleMobileMenu}>
              <i className="ri-menu-line text-xl"></i>
            </button>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isModalOpen} onClose={closeModal} triggerBy={STUDIO_BASE} />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        closeMobileMenu={toggleMobileMenu}
        userRole={userRole}
      />
    </>
  );
};

export default StudioNavbar;