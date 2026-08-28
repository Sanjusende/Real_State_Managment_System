import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request Interceptor: Attach JWT Bearer Token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract data payload & handle global error notifications
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';

    // Avoid duplicate toast notifications on specific non-fatal routes if needed
    if (error.response?.status === 401) {
      // Unauthorized: could trigger session expiration or logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    return Promise.reject({
      statusCode: error.response?.status || 500,
      message,
      errors: error.response?.data?.errors || [],
      raw: error,
    });
  }
);

export default api;
