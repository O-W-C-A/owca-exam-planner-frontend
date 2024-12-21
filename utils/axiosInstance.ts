import axios from 'axios';
import Cookies from 'js-cookie';

// Determine the environment (development or production)
const isDevelopment = process.env.NODE_ENV === 'development';

const api = axios.create({
  baseURL: isDevelopment
    ? 'https://owca-exam-planner.azurewebsites.net/'
    : 'https://localhost:7267/',
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
