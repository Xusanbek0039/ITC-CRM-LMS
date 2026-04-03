import api from './axios';

const leadsApi = {
  getAll: (params) => api.get('/leads/', { params }),
  getById: (id) => api.get(`/leads/${id}/`),
  create: (data) => api.post('/leads/', data),
  update: (id, data) => api.put(`/leads/${id}/`, data),
  delete: (id) => api.delete(`/leads/${id}/`),
  convert: (id, data) => api.post(`/leads/${id}/convert/`, data),
  getHistory: (id) => api.get(`/leads/${id}/history/`),
};

export default leadsApi;
