// src/components/CommonViews/AuthModal/MessageToast.jsx
import React, { useEffect, useState } from "react";
import tailwindStyles from "../../../utils/tailwindStyles";

const MessageToast = () => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      setToast(e.detail);
      setTimeout(() => setToast(null), 3000);
    };
    window.addEventListener("showToast", handler);
    return () => window.removeEventListener("showToast", handler);
  }, []);

  if (!toast) return null;

  return (
    <div className={`${tailwindStyles.paragraph} absolute top-2 w-[calc(100%-20px)] mb-4 p-2 text-center rounded ${
      toast.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}>
      {toast.text}
    </div>
  );
};

export default MessageToast;