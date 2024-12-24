import { getDashboardRoute } from '@/utils/routes';
import api from '@/utils/axiosInstance';
import Cookies from 'js-cookie';

type LoginCredentials = {
  email: string;
  password: string;
};

export const handleLogin = async (credentials: LoginCredentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    if (response.status === 200) {
      const { token, role, userId } = response.data;
      
      // Set cookies
      Cookies.set('authToken', token);
      Cookies.set('role', role);
      Cookies.set('userId', userId);

      // Redirect to appropriate dashboard
      window.location.href = getDashboardRoute(role);
    }
  } catch (error) {
    // Handle error
  }
}; 