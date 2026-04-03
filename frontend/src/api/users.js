import api from './axios';

const usersApi = {
  getAll: (params) => api.get('/users/', { params }),
  getById: (id) => api.get(`/users/${id}/`),
  create: (data) => api.post('/users/', data),
  update: (id, data) => api.put(`/users/${id}/`, data),
  delete: (id) => api.delete(`/users/${id}/`),
  toggleActive: (id) => api.post(`/users/${id}/toggle-active/`),
};

export default usersApi;
