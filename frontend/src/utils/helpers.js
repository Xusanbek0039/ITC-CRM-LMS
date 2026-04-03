export const getStatusColor = (statusMap, status) => {
  const colors = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    gray: 'bg-gray-100 text-gray-800',
    cyan: 'bg-cyan-100 text-cyan-800',
    teal: 'bg-teal-100 text-teal-800',
  };
  const item = statusMap[status];
  return item ? colors[item.color] || colors.gray : colors.gray;
};

export const getStatusLabel = (statusMap, status) => {
  return statusMap[status]?.label || status;
};

export const getErrorMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.detail) return error.response.data.detail;
  if (error.message) return error.message;
  return 'Xatolik yuz berdi';
};

export const buildQueryParams = (filters) => {
  const params = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      params[key] = value;
    }
  });
  return params;
};
