// src/components/CommonViews/AuthModal/CloseButton.jsx
const CloseButton = ({ onClose }) => (
  <div onClick={onClose}
    className="absolute flex items-center justify-center top-4 right-4 bg-[#001433] w-7 h-7 rounded-full cursor-pointer">
    <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-300">
      X
    </button>
  </div>
);

export default CloseButton;