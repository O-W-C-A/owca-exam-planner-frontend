import React, { useState, useEffect } from "react";

interface ToastErrorProps {
  message: string;
  type?: "error" | "success" | "info"; // You can add more types as needed
}

const ToastError: React.FC<ToastErrorProps> = ({ message, type = "error" }) => {
  const [show, setShow] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      setIsExiting(false);
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => setShow(false), 500); // Delay hiding for animation
      }, 5000); // Automatically hide after 5 seconds
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [message]);

  if (!show) return null;

  const getToastStyle = () => {
    switch (type) {
      case "success":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          borderColor: "border-green-400",
        };
      case "info":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
          borderColor: "border-blue-400",
        };
      case "error":
      default:
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          borderColor: "border-red-400",
        };
    }
  };

  const { bgColor, textColor, borderColor } = getToastStyle();

  return (
    <div
      className={`fixed top-4 right-0 z-50 p-4 ${isExiting ? "animate-slideOut" : "animate-slideIn"} w-2/5 max-w-xl`} // Add sliding animation
    >
      <div
        className={`flex items-center justify-between ${bgColor} ${textColor} border ${borderColor} p-3 rounded-lg shadow-lg`}
      >
        <span>{message}</span>
        <button
          onClick={() => setIsExiting(true)}
          className={`ml-4 ${textColor} hover:text-opacity-80 focus:outline-none`}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default ToastError;
