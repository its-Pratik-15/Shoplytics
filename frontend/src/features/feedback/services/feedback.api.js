import api from '../../../shared/services/api';

export const feedbackAPI = {
  getFeedback: async (params = {}) => {
    const response = await api.get('/feedback', { params });
    return response.data;
  },

  createFeedback: async (feedbackData) => {
    const response = await api.post('/feedback', feedbackData);
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