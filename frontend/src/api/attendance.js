import api from './axios';

const attendanceApi = {
  getAll: (params) => api.get('/attendance/', { params }),
  getById: (id) => api.get(`/attendance/${id}/`),
  create: (data) => api.post('/attendance/', data),
  update: (id, data) => api.put(`/attendance/${id}/`, data),
  getStats: (params) => api.get('/attendance/stats/', { params }),
};

export default attendanceApi;
