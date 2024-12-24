'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/utils/axiosInstance';

type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role?: string;
  group?: string;
  faculty?: string;
} | null;

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
  userRole: Cookies.get('role')?.toLowerCase() || 'student',
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [error, setError] = useState<string>();
  const userRole = Cookies.get('role')?.toLowerCase() || 'student';

  const fetchUser = async () => {
    try {
      const userId = Cookies.get('userId');
      if (!userId) {
        setError('No user ID found');
        return;
      }
      const response = await api.get(`/users/${userId}`);
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch user data');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, userRole, error, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 