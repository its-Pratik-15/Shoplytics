import api from '../../../shared/services/api';

export const billsAPI = {
  // Get all products for POS
  getProductsForPOS: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get customers for POS
  getCustomersForPOS: async (params = {}) => {
    const response = await api.get('/customers', { params });
    return response.data;
  },

  // Create a new customer
  createCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  // Create a new bill/transaction
  createBill: async (billData) => {
    const response = await api.post('/transactions', billData);
    return response.data;
  },

  // Get bill details by ID
  getBillById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  // Get all bills with pagination
  getBills: async (params = {}) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  // Update bill status
  updateBillStatus: async (id, status) => {
    const response = await api.patch(`/transactions/${id}/status`, { status });
    return response.data;
  }
};