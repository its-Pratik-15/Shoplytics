import api from '../../../shared/services/api';

export const analyticsAPI = {
  getDashboardOverview: async (params = {}) => {
    const response = await api.get('/analytics/dashboard', { params });
    return response.data;
  },

  getMostSellingProducts: async (params = {}) => {
    const response = await api.get('/analytics/products/top-selling', { params });
    return response.data;
  },

  getHighestRevenueProducts: async (params = {}) => {
    const response = await api.get('/analytics/products/top-revenue', { params });
    return response.data;
  },

  getCustomerAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/customers', { params });
    return response.data;
  },

  getSalesTrends: async (params = {}) => {
    const response = await api.get('/analytics/sales/trends', { params });
    return response.data;
  },

  getFeedbackSpendingInsights: async (params = {}) => {
    const response = await api.get('/analytics/feedback/insights', { params });
    return response.data;
  },
};