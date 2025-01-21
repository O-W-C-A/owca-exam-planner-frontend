import React, { useState, useEffect } from "react";

// Define the interface for the ToastMessage component props
interface ToastMessageProps {
  message: string; // The message to display
  type?: "error" | "success" | "info"; // The type of toast (default is "error")
  onClose: () => void; // Function to call when the toast is closed
}

const ToastMessage: React.FC<ToastMessageProps> = ({
  message,
  type = "error",
  onClose,
}) => {
  // State to manage visibility of the toast message
  const [show, setShow] = useState(false);
  // State to manage the exiting animation of the toast
  const [isExiting, setIsExiting] = useState(false);
  
  // Effect hook to manage showing and hiding the toast message based on the message prop
  useEffect(() => {
    if (message) {
      setShow(true);
      setIsExiting(false); // Ensure animation starts from the beginning

      // Set a timer to hide the toast after 5 seconds
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setShow(false);
          onClose(); // Call onClose after the animation completes
        }, 200); // Delay hiding for animation duration
      }, 2000);

      // Cleanup the timer on component unmount or message change
      return () => {
        clearTimeout(timer);
      };
    }
  }, [message, onClose]); // Re-run the effect when message changes

  // If no message is shown, return null to prevent rendering
  if (!show) return null;

  // Function to determine the toast style based on its type
  const getToastMessageStyle = () => {
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

  // Destructure the styles for the toast message
  const { bgColor, textColor, borderColor } = getToastMessageStyle();

  return (
    <div
      key={message} // Ensure key changes to reset animation even for same message
      className={`fixed top-4 right-0 z-[9999] p-4 ${
        isExiting ? "animate-slideOut" : "animate-slideIn"
      } w-2/5 max-w-xl`}
    >
      <div
        className={`flex items-center justify-between ${bgColor} ${textColor} border ${borderColor} p-3 rounded-lg shadow-lg`}
      >
        <span>{message}</span>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => {
              setShow(false); // Hide immediately after clicking X
              onClose(); // Call onClose when the toast is closed
            }, 500); // Wait for the slide-out animation to complete
          }}
          className={`ml-4 ${textColor} hover:text-opacity-80 focus:outline-none`}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default ToastMessage;
