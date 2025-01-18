"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import api from "@/utils/axiosInstance";
import { User } from "@/types/user";

type UserContextType = {
  user: User | null;
  fetchUser: () => Promise<void>;
  setUser: (user: User) => void;
  userRole: string;
  error?: string;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  fetchUser: async () => {},
  setUser: () => {},
  userRole: Cookies.get("role")?.toLowerCase() || "student",
});

export function UserProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>();
  const userRole = Cookies.get("role")?.toLowerCase() || "student";

  const fetchUser = async () => {
    try {
      const userId = Cookies.get("userId");
      if (!userId) {
        setError("No user ID found");
        return;
      }
      const response = await api.get(`/users/${userId}`);
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch user data");
    }
  };

  useEffect(() => {
    // Only fetch user if userId cookie is present
    const userId = Cookies.get("userId");
    if (userId) {
      fetchUser();
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      userRole,
      error,
      fetchUser,
    }),
    [user, userRole, error]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
