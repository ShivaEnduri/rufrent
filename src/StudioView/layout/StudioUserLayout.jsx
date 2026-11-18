// import React from "react";
// import { Outlet } from "react-router-dom";
// import StudioNavbar from "../commonViews/StudioNavbar";

// const StudioUserLayout = () => {
//   return (
//     <div className="flex w-full flex-col bg-white">
//       <StudioNavbar />
//       <main>
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default StudioUserLayout;


// src/StudioView/layout/StudioUserLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AppAwareNavbar from "../../components/CommonViews/AppAwareNavbar"; 

const StudioUserLayout = () => {
  return (
    <div className="flex w-full flex-col bg-white">
      <AppAwareNavbar /> {/* ← Replaces StudioNavbar */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default StudioUserLayout;