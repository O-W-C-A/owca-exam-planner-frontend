'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/utils/axiosInstance';

type User = {
  firstname: string;
  lastname: string;
  email: string;
  role?: string;
  group?: string;
  faculty?: string;
} | null;

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
  userRole: string;
  error?: string;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [error, setError] = useState<string>();
  const userRole = Cookies.get('role')?.toLowerCase() || 'student';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = Cookies.get('userId');
        console.log('Fetching user data for ID:', userId);
        
        if (!userId) {
          setError('No user ID found');
          return;
        }

        const response = await api.get(`/users/${userId}`);
        console.log('API Response:', response);

        if (response.status === 200) {
          setUser(response.data);
        } else {
          setError(`API returned status ${response.status}`);
        }
      } catch (error: any) {
        console.error('Full error:', error);
        setError(error.message || 'Failed to fetch user data');
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, userRole, error }}>
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