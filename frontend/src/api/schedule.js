import api from './axios';

const scheduleApi = {
  getAll: (params) => api.get('/schedule/', { params }),
  create: (data) => api.post('/schedule/', data),
  update: (id, data) => api.put(`/schedule/${id}/`, data),
  delete: (id) => api.delete(`/schedule/${id}/`),
  getByTeacher: (params) => api.get('/schedule/by-teacher/', { params }),
  getByRoom: (params) => api.get('/schedule/by-room/', { params }),
  getWeekly: (params) => api.get('/schedule/weekly/', { params }),
};

export default scheduleApi;
