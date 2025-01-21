"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface Props {
  onClose?: () => void; // Optional prop to handle closure from parent
  showPopup: boolean; // Indicates whether the popup should be visible
}

const Logout: React.FC<Props> = ({ onClose, showPopup }) => {
  const router = useRouter();

  const confirmLogout = () => {
    // Clear user authentication tokens
    Cookies.remove("authToken");
    Cookies.remove("role");
    Cookies.remove("userId");
    // Redirect to the login page
    router.push("/login");
  };

  const cancelLogout = () => {
    // Close the popup if an onClose handler is provided
    if (onClose) {
      onClose();
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-50 bg-opacity-80 z-50">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg border-t-4 border-blue-500">
        <p className="text-blue-800 text-center text-lg font-bold">
          Are you sure you want to log out?
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={confirmLogout}
            className="px-6 py-3 text-lg font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow-md transition-transform transform hover:scale-105"
          >
            Yes
          </button>
          <button
            onClick={cancelLogout}
            className="px-6 py-3 text-lg font-medium text-blue-800 bg-white border border-blue-500 hover:bg-blue-50 rounded-full shadow-md transition-transform transform hover:scale-105"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
