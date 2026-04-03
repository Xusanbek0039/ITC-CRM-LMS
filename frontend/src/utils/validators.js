export const required = (value) => value ? '' : 'Bu maydon to\'ldirilishi shart';

export const email = (value) => {
  if (!value) return '';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Email formati noto\'g\'ri';
};

export const phone = (value) => {
  if (!value) return '';
  return /^\+998[0-9]{9}$/.test(value) ? '' : 'Telefon formati: +998XXXXXXXXX';
};

export const minLength = (min) => (value) => {
  if (!value) return '';
  return value.length >= min ? '' : `Kamida ${min} ta belgi bo'lishi kerak`;
};

export const maxLength = (max) => (value) => {
  if (!value) return '';
  return value.length <= max ? '' : `Ko'pi bilan ${max} ta belgi bo'lishi kerak`;
};
