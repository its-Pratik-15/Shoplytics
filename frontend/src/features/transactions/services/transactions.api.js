import api from '../../../shared/services/api';

export const transactionsAPI = {
  getTransactions: async (params = {}) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  getTransaction: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },

  updateTransactionStatus: async (id, status) => {
    const response = await api.put(`/transactions/${id}/status`, { status });
    return response.data;
  },

  getTransactionStats: async (params = {}) => {
    const response = await api.get('/transactions/stats', { params });
    return response.data;
  },
};