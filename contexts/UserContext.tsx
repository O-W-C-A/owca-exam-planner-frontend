"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import api from "@/utils/axiosInstance";
import { User } from "@/types/user";
import ToastMessage from "@/app/components/ToastMessage"; // Import ToastMessage for displaying error messages

// Define the context type for user-related state and actions
type UserContextType = {
  user: User | null;
  fetchUser: () => Promise<void>;
  setUser: (user: User) => void;
  userRole: string;
  error?: string; // Optional error message for user fetching
};

// Create the context with a default user role from cookies or 'student' as fallback
export const UserContext = createContext<UserContextType>({
  user: null,
  fetchUser: async () => {},
  setUser: () => {},
  userRole: Cookies.get("role")?.toLowerCase() || "student",
});

// UserProvider component to manage user state and provide context to children components
export function UserProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | undefined>();
  const userRole = Cookies.get("role")?.toLowerCase() || "student";

  // Function to fetch user data from API based on the userId from cookies
  const fetchUser = async () => {
    try {
      const userId = Cookies.get("userId");
      if (!userId) {
        setError("No user ID found"); // Set error if userId is not available in cookies
        return;
      }
      const response = await api.get(`/users/${userId}`);
      if (response.status === 200) {
        setUser(response.data); // Set user data if the request is successful
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch user data"); // Handle any error during the fetch process
    }
  };

  useEffect(() => {
    // Fetch user data only if the userId cookie is present
    const userId = Cookies.get("userId");
    if (userId) {
      fetchUser();
    }
  }, []);

  // Memoized value for context to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      userRole,
      error,
      fetchUser,
    }),
    [user, userRole, error] // Dependencies for re-calculating context value
  );

  return (
    <UserContext.Provider value={contextValue}>
      {children}
      {error && (
        // Show error message using ToastMessage component if error exists
        <ToastMessage
          message={error}
          type="error"
          onClose={() => setError(undefined)} // Close the toast when the button is clicked
        />
      )}
    </UserContext.Provider>
  );
}

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
