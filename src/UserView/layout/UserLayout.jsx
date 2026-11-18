// import React from "react";
// import { Outlet } from "react-router-dom";
// import Navbar from "../../components/CommonViews/Navbar"; // Adjust the import path as necessary
// import FooterSection from "../components/InitialLandingView/InitialFooterView";

// const UserLayout = () => {
//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <Navbar />
//       <main className="flex-1">
//         <Outlet />
//       </main>
//       <FooterSection/>
//     </div>
//   );
// };

// export default UserLayout;


// src/UserView/layout/UserLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AppAwareNavbar from "../../components/CommonViews/AppAwareNavbar"; // ← NEW
import FooterSection from "../components/InitialLandingView/InitialFooterView";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AppAwareNavbar /> {/* ← Replaces old Navbar */}
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterSection />
    </div>
  );
};

export default UserLayout;