import api from './axios';

const studentsApi = {
  getAll: (params) => api.get('/students/', { params }),
  getById: (id) => api.get(`/students/${id}/`),
  create: (data) => api.post('/students/', data),
  update: (id, data) => api.put(`/students/${id}/`, data),
  patch: (id, data) => api.patch(`/students/${id}/`, data),
  delete: (id) => api.delete(`/students/${id}/`),
  freeze: (id) => api.post(`/students/${id}/freeze/`),
  activate: (id) => api.post(`/students/${id}/activate/`),
  getGroups: (id) => api.get(`/students/${id}/groups/`),
  getPayments: (id) => api.get(`/students/${id}/payments/`),
  getAttendance: (id) => api.get(`/students/${id}/attendance/`),
};

export default studentsApi;
