import axios from 'axios';
import Cookies from 'js-cookie';
import { clearAuthData } from './tokenUtils';
import { ROUTES } from '@/utils/routes';
// Use the URL passed via the environment variable
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('authToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthData();
      window.location.href = ROUTES.LOGIN;
    }
    // Ensure we're rejecting with an Error object
    return Promise.reject(error instanceof Error ? error : new Error(error?.message || 'An error occurred'));
  }
);

export default api;
