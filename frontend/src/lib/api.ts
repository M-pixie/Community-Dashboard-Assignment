import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Intercept responses for global error handling
import { toast } from 'sonner';

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const isAuthCheck = error.config?.url?.includes('/auth/me') && error.response.status === 401;
      
      if (!isAuthCheck) {
        console.error(`API Error [${error.response.status}] at ${error.config?.url}`);
        console.error('Backend Response:', error.response.data);
        console.error('Request Payload:', error.config?.data);

        toast.error(error.response.data?.message || 'Something went wrong', {
          description: `Error ${error.response.status}`,
        });
      }

      if (error.response.status === 401) {
        // Clear local storage and redirect to login on unauthorized
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else {
      console.error('API Error (Network/CORS):', error.message);
      toast.error('Network Error', {
        description: 'Could not connect to the server.',
      });
    }
    return Promise.reject(error);
  }
);

export default api;
