import api from './axios';

const groupsApi = {
  getAll: (params) => api.get('/groups/', { params }),
  getById: (id) => api.get(`/groups/${id}/`),
  create: (data) => api.post('/groups/', data),
  update: (id, data) => api.put(`/groups/${id}/`, data),
  delete: (id) => api.delete(`/groups/${id}/`),
  getStudents: (id) => api.get(`/groups/${id}/students/`),
  addStudent: (id, data) => api.post(`/groups/${id}/students/`, data),
  removeStudent: (id, data) => api.delete(`/groups/${id}/students/`, { data }),
};

export default groupsApi;
