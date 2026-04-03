import api from './axios';

const notificationsApi = {
  getAll: (params) => api.get('/notifications/', { params }),
  markRead: (id) => api.post(`/notifications/${id}/read/`),
  markAllRead: () => api.post('/notifications/read-all/'),
  getUnreadCount: () => api.get('/notifications/unread-count/'),
};

export default notificationsApi;
