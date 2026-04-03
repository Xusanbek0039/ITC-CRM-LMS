import api from './axios';

const teachersApi = {
  getAll: (params) => api.get('/teachers/', { params }),
  getById: (id) => api.get(`/teachers/${id}/`),
  create: (data) => api.post('/teachers/', data),
  update: (id, data) => api.put(`/teachers/${id}/`, data),
  delete: (id) => api.delete(`/teachers/${id}/`),
  getGroups: (id) => api.get(`/teachers/${id}/groups/`),
  getSchedule: (id) => api.get(`/teachers/${id}/schedule/`),
};

export default teachersApi;
