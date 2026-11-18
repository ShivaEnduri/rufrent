//import logo from "../assests/logo.png";
// 1. Import the hook we will create in the next step
 //import { useAuthModal } from "../context/AuthContext";

export const PGNavbar = () => {
  // 2. Get the function to open the modal
 // const { openModal } = useAuthModal();

  return (
    <nav
      className="
        sticky top-0 z-50 
        bg-[#181C3A]
        flex items-center justify-between
        px-12 py-2
        shadow-2xl
        mx-0 sm:mx-[50px] overflow-auto
      "
    >
      {/* Left Section — Logo + Title */}
      <div className="flex flex-col items-start">
        <div className="flex items-center space-x-2">
          <img
            src=""
            alt="Rufrent Logo"
            className="h-10 w-auto object-contain"
          />
        </div>
        <span className="text-white text-xl mt-1 ml-1 font-medium tracking-wide">
          MyPG
        </span>
      </div>

      {/* Right Section — Buttons */}
      <div className="flex items-center space-x-6">
        {/* 3. Make the Login button open the modal */}
        <button
          onClick=""
          className="text-white text-lg font-semibold hover:opacity-80 transition"
        >
          Login
        </button>
        <button
          className="
            bg-gradient-to-r from-[#FB432C] to-[#FF591E]
            text-white font-semibold text-lg
            px-6 py-2 rounded-xl
            shadow-md hover:opacity-90 transition
          "
        >
          Request Demo
        </button>
      </div>
    </nav>
  );
};