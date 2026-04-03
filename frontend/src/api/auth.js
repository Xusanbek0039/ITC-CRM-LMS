import api from './axios';

const authApi = {
  login: (credentials) => api.post('/auth/login/', credentials),
  refresh: (refreshToken) => api.post('/auth/refresh/', { refresh: refreshToken }),
  logout: (refreshToken) => api.post('/auth/logout/', { refresh: refreshToken }),
  getProfile: () => api.get('/auth/me/'),
  updateProfile: (data) => api.put('/auth/me/', data),
  changePassword: (data) => api.post('/auth/change-password/', data),
};

export default authApi;
