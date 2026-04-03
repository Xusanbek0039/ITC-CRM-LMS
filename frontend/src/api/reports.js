import api from './axios';

const reportsApi = {
  getDashboard: () => api.get('/reports/dashboard/'),
  getStudentStats: () => api.get('/reports/students/'),
  getFinancial: (params) => api.get('/reports/financial/', { params }),
  getAttendance: (params) => api.get('/reports/attendance/', { params }),
  getLeads: () => api.get('/reports/leads/'),
};

export default reportsApi;
