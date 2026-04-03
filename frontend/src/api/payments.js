import api from './axios';

const paymentsApi = {
  getAll: (params) => api.get('/payments/', { params }),
  getById: (id) => api.get(`/payments/${id}/`),
  create: (data) => api.post('/payments/', data),
  update: (id, data) => api.put(`/payments/${id}/`, data),
  delete: (id) => api.delete(`/payments/${id}/`),
  getDebtors: (params) => api.get('/payments/debtors/', { params }),
  getMonthlyReport: (params) => api.get('/payments/monthly-report/', { params }),
};

export default paymentsApi;
