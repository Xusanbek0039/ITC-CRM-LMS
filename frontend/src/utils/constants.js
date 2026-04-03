export const STUDENT_STATUS = {
  active: { label: 'Aktiv', color: 'green' },
  frozen: { label: 'Muzlatilgan', color: 'blue' },
  graduated: { label: 'Bitirgan', color: 'purple' },
  left: { label: 'Tark etgan', color: 'red' },
};

export const GROUP_STATUS = {
  forming: { label: 'Shakllanmoqda', color: 'yellow' },
  active: { label: 'Aktiv', color: 'green' },
  completed: { label: 'Tugagan', color: 'gray' },
  cancelled: { label: 'Bekor qilingan', color: 'red' },
};

export const PAYMENT_TYPES = {
  cash: { label: 'Naqd', color: 'green' },
  card: { label: 'Karta', color: 'blue' },
  bank: { label: 'Bank', color: 'purple' },
  click: { label: 'Click', color: 'cyan' },
  payme: { label: 'Payme', color: 'teal' },
};

export const ATTENDANCE_STATUS = {
  present: { label: 'Keldi', color: 'green' },
  absent: { label: 'Kelmadi', color: 'red' },
  late: { label: 'Kechikdi', color: 'yellow' },
  excused: { label: 'Sababli', color: 'blue' },
};

export const LEAD_STATUS = {
  new: { label: 'Yangi', color: 'blue' },
  contacted: { label: "Bog'lanildi", color: 'yellow' },
  trial_scheduled: { label: 'Sinov darsiga yozildi', color: 'purple' },
  enrolled: { label: "O'quvchiga aylandi", color: 'green' },
  cancelled: { label: 'Bekor qilindi', color: 'red' },
};

export const LEAD_SOURCES = {
  phone: { label: 'Telefon', icon: 'phone' },
  telegram: { label: 'Telegram', icon: 'telegram' },
  instagram: { label: 'Instagram', icon: 'instagram' },
  website: { label: 'Veb-sayt', icon: 'globe' },
  referral: { label: 'Tavsiya', icon: 'users' },
  ad: { label: 'Reklama', icon: 'megaphone' },
  walk_in: { label: 'Keldi', icon: 'walk' },
  other: { label: 'Boshqa', icon: 'dots' },
};

export const ROLES = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  manager: 'Menejer',
  teacher: "O'qituvchi",
  student: "O'quvchi",
};

export const WEEKDAYS = [
  { value: 'monday', label: 'Dushanba' },
  { value: 'tuesday', label: 'Seshanba' },
  { value: 'wednesday', label: 'Chorshanba' },
  { value: 'thursday', label: 'Payshanba' },
  { value: 'friday', label: 'Juma' },
  { value: 'saturday', label: 'Shanba' },
  { value: 'sunday', label: 'Yakshanba' },
];
