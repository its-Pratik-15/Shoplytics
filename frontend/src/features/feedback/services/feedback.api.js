import api from '../../../shared/services/api';
import axios from 'axios';

export const feedbackAPI = {
  getFeedback: async (params = {}) => {
    const response = await api.get('/feedback', { params });
    return response.data;
  },

  getFeedbackById: async (id) => {
    const response = await api.get(`/feedback/${id}`);
    return response.data;
  },

  createFeedback: async (feedbackData) => {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },

  updateFeedback: async (id, feedbackData) => {
    const response = await api.put(`/feedback/${id}`, feedbackData);
    return response.data;
  },

  deleteFeedback: async (id) => {
    const response = await api.delete(`/feedback/${id}`);
    return response.data;
  },

  getFeedbackStats: async (params = {}) => {
    const response = await api.get('/feedback/stats', { params });
    return response.data;
  },
};

// Public API for customer feedback (no authentication required)
export const submitCustomerFeedback = async (feedbackData) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/feedback/public`, feedbackData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};