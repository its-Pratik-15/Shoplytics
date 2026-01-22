import api from '../../../shared/services/api';

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const { userType, ...data } = userData;
    
    // Choose endpoint based on user type
    const endpoint = userType === 'employee' ? '/auth/employee/register' : '/auth/register';
    
    const response = await api.post(endpoint, data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};