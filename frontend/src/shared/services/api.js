import axios from 'axios';
import { config } from '../../app/config/env';

// Create axios instance
const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - cookies will be cleared by backend
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;