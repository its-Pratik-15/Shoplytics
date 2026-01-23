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
    // Don't automatically redirect on 401 - let components handle it
    // The AuthProvider will handle authentication state properly
    return Promise.reject(error);
  }
);

export default api;