import api from './axios';

const coursesApi = {
  getAll: (params) => api.get('/courses/', { params }),
  getById: (id) => api.get(`/courses/${id}/`),
  create: (data) => api.post('/courses/', data),
  update: (id, data) => api.put(`/courses/${id}/`, data),
  delete: (id) => api.delete(`/courses/${id}/`),
  getGroups: (id) => api.get(`/courses/${id}/groups/`),
};

export default coursesApi;
