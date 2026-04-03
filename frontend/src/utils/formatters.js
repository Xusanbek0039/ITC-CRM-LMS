export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('uz-UZ', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('uz-UZ', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
};

export const formatMoney = (amount) => {
  if (amount == null) return '0';
  return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
};

export const formatPhone = (phone) => {
  if (!phone) return '—';
  return phone;
};
