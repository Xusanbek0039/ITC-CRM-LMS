# ITC CRM-LMS — O'quv Markaz Boshqaruv Tizimi

## 1. Loyiha Haqida

ITC CRM-LMS — o'quv markazlari uchun mo'ljallangan professional CRM (Customer Relationship Management) va LMS (Learning Management System) tizimidir. Tizim o'quv markazining barcha jarayonlarini — o'quvchilar, o'qituvchilar, guruhlar, kurslar, davomat, to'lovlar, leadlar va hisobotlarni — yagona platformada boshqarish imkonini beradi.

**Texnologik stek:**
- **Backend:** Django 5.x + Django REST Framework 3.15+
- **Frontend:** React 18+ + Tailwind CSS 3+ + Vite
- **Database:** PostgreSQL 16
- **Authentication:** JWT (djangorestframework-simplejwt)
- **State Management:** Zustand
- **HTTP Client:** Axios
- **API yondashuvi:** RESTful, API-first

**Asosiy tamoyillar:**
- Separation of Concerns (Backend va Frontend mustaqil)
- Service Layer Pattern (business logic viewlardan ajratilgan)
- Soft Delete (ma'lumotlar o'chirilmaydi, arxivlanadi)
- Audit Trail (barcha o'zgarishlar loglanadi)
- Role-Based Access Control (RBAC)
- Mobile-ready API

---

## 2. Backend Arxitekturasi

```
backend/
├── config/                     # Asosiy loyiha konfiguratsiyasi
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py            # Umumiy sozlamalar
│   │   ├── development.py     # Dev muhit
│   │   ├── production.py      # Prod muhit
│   │   └── test.py            # Test muhit
│   ├── urls.py                # Asosiy URL konfiguratsiyasi
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── accounts/              # Foydalanuvchilar va autentifikatsiya
│   ├── students/              # O'quvchilar moduli
│   ├── teachers/              # O'qituvchilar moduli
│   ├── courses/               # Kurslar moduli
│   ├── groups/                # Guruhlar moduli
│   ├── attendance/            # Davomat moduli
│   ├── payments/              # To'lovlar moduli
│   ├── schedule/              # Dars jadvali moduli
│   ├── leads/                 # Lead/Mijozlar moduli
│   ├── reports/               # Hisobotlar moduli
│   └── notifications/         # Bildirishnomalar moduli
├── core/                      # Umumiy utilities va base classlar
│   ├── models.py              # BaseModel (soft delete, timestamps)
│   ├── permissions.py         # Global permission classlar
│   ├── pagination.py          # Custom pagination
│   ├── exceptions.py          # Custom exception handler
│   ├── filters.py             # Umumiy filterlar
│   ├── mixins.py              # Umumiy mixinlar
│   └── utils.py               # Yordamchi funksiyalar
├── manage.py
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
└── pytest.ini
```

**Har bir app ichki strukturasi:**
```
apps/students/
├── __init__.py
├── admin.py
├── apps.py
├── models.py                  # Data modellari
├── serializers.py             # DRF serializerlar
├── views.py                   # ViewSetlar
├── services.py                # Business logic
├── filters.py                 # FilterSetlar
├── permissions.py             # Modul permissionlari
├── signals.py                 # Django signals
├── urls.py                    # URL routing
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_views.py
│   └── test_services.py
└── migrations/
```

---

## 3. Django App'lar va Vazifalari

| App | Vazifasi |
|-----|----------|
| `accounts` | Custom User model, rollar, JWT auth, profil boshqaruvi, permission tizimi |
| `students` | O'quvchi CRUD, guruhga biriktirish, holat boshqaruvi, tarix |
| `teachers` | O'qituvchi CRUD, fan va mutaxassislik, ish grafigi |
| `courses` | Kurs CRUD, narxlash, kategoriyalash |
| `groups` | Guruh CRUD, o'quvchi va o'qituvchi biriktirish, jadval |
| `attendance` | Davomat yaratish, statistika, hisobot |
| `payments` | To'lov CRUD, qarz monitoring, chegirma, to'lov tarixi |
| `schedule` | Haftalik jadval, xona bandligi, conflict detection |
| `leads` | Lead CRUD, status pipeline, konversiya tracking |
| `reports` | Dashboard KPI, analitika, hisobot generatsiya |
| `notifications` | Bildirishnoma yaratish, yuborish, SMS/Telegram tayyor arxitektura |

---

## 4. Modellar va Fieldlar

### 4.1 accounts.User
```
- id: UUID (PK)
- email: EmailField (unique)
- phone: CharField (unique)
- first_name: CharField
- last_name: CharField
- role: CharField (choices: superadmin, admin, manager, teacher, student)
- avatar: ImageField (optional)
- is_active: BooleanField
- date_joined: DateTimeField
- last_login: DateTimeField
```

### 4.2 students.Student
```
- id: UUID (PK)
- user: OneToOneField -> User
- parent_phone: CharField
- address: TextField
- birth_date: DateField
- status: CharField (choices: active, frozen, graduated, left)
- notes: TextField (optional)
- enrolled_date: DateField
- created_at: DateTimeField
- updated_at: DateTimeField
- is_deleted: BooleanField (soft delete)
```

### 4.3 teachers.Teacher
```
- id: UUID (PK)
- user: OneToOneField -> User
- specialization: CharField
- subjects: ManyToManyField -> Course
- work_start_time: TimeField
- work_end_time: TimeField
- work_days: JSONField (list of weekdays)
- bio: TextField (optional)
- created_at: DateTimeField
- updated_at: DateTimeField
- is_deleted: BooleanField
```

### 4.4 courses.Course
```
- id: UUID (PK)
- name: CharField
- description: TextField
- duration_months: PositiveIntegerField
- price: DecimalField
- payment_type: CharField (choices: monthly, full)
- is_active: BooleanField
- created_at: DateTimeField
- updated_at: DateTimeField
- is_deleted: BooleanField
```

### 4.5 groups.Group
```
- id: UUID (PK)
- name: CharField
- course: ForeignKey -> Course
- teacher: ForeignKey -> Teacher
- start_date: DateField
- end_date: DateField
- lesson_days: JSONField (e.g., ["monday", "wednesday", "friday"])
- lesson_start_time: TimeField
- lesson_end_time: TimeField
- room: ForeignKey -> Room
- status: CharField (choices: forming, active, completed, cancelled)
- max_students: PositiveIntegerField
- created_at: DateTimeField
- updated_at: DateTimeField
- is_deleted: BooleanField
```

### 4.6 groups.Room
```
- id: UUID (PK)
- name: CharField
- capacity: PositiveIntegerField
- is_active: BooleanField
```

### 4.7 groups.GroupStudent (M2M through)
```
- id: UUID (PK)
- group: ForeignKey -> Group
- student: ForeignKey -> Student
- joined_date: DateField
- left_date: DateField (nullable)
- status: CharField (choices: active, frozen, left, graduated)
```

### 4.8 attendance.Attendance
```
- id: UUID (PK)
- group: ForeignKey -> Group
- date: DateField
- created_by: ForeignKey -> User
- created_at: DateTimeField
```

### 4.9 attendance.AttendanceRecord
```
- id: UUID (PK)
- attendance: ForeignKey -> Attendance
- student: ForeignKey -> Student
- status: CharField (choices: present, absent, late, excused)
- note: TextField (optional)
```

### 4.10 payments.Payment
```
- id: UUID (PK)
- student: ForeignKey -> Student
- group: ForeignKey -> Group
- amount: DecimalField
- discount: DecimalField (default=0)
- payment_type: CharField (choices: cash, card, bank, click, payme)
- payment_date: DateField
- period_month: DateField (qaysi oy uchun to'lov)
- note: TextField (optional)
- created_by: ForeignKey -> User
- created_at: DateTimeField
- is_deleted: BooleanField
```

### 4.11 schedule.Schedule
```
- id: UUID (PK)
- group: ForeignKey -> Group
- day_of_week: CharField (choices: monday...sunday)
- start_time: TimeField
- end_time: TimeField
- room: ForeignKey -> Room
```

### 4.12 leads.Lead
```
- id: UUID (PK)
- full_name: CharField
- phone: CharField
- source: CharField (choices: phone, telegram, instagram, website, referral, ad, walk_in, other)
- course_interest: ForeignKey -> Course (nullable)
- status: CharField (choices: new, contacted, trial_scheduled, enrolled, cancelled)
- assigned_to: ForeignKey -> User (nullable)
- notes: TextField (optional)
- created_at: DateTimeField
- updated_at: DateTimeField
- is_deleted: BooleanField
```

### 4.13 leads.LeadHistory
```
- id: UUID (PK)
- lead: ForeignKey -> Lead
- old_status: CharField
- new_status: CharField
- changed_by: ForeignKey -> User
- note: TextField (optional)
- created_at: DateTimeField
```

### 4.14 notifications.Notification
```
- id: UUID (PK)
- recipient: ForeignKey -> User
- title: CharField
- message: TextField
- notification_type: CharField (choices: payment_reminder, lesson_reminder, attendance_warning, system)
- is_read: BooleanField
- created_at: DateTimeField
```

### 4.15 core.AuditLog
```
- id: UUID (PK)
- user: ForeignKey -> User
- action: CharField (choices: create, update, delete, login, logout)
- model_name: CharField
- object_id: CharField
- changes: JSONField
- ip_address: GenericIPAddressField
- created_at: DateTimeField
```

---

## 5. Model Relationship'lar

```
User (1) ──── (1) Student
User (1) ──── (1) Teacher
Course (1) ──── (N) Group
Teacher (1) ──── (N) Group
Room (1) ──── (N) Group
Group (N) ──── (N) Student  [through GroupStudent]
Teacher (N) ──── (N) Course [subjects]
Group (1) ──── (N) Attendance
Attendance (1) ──── (N) AttendanceRecord
Student (1) ──── (N) AttendanceRecord
Student (1) ──── (N) Payment
Group (1) ──── (N) Payment
Group (1) ──── (N) Schedule
Lead (N) ──── (1) Course [interest]
Lead (1) ──── (N) LeadHistory
User (1) ──── (N) Notification
User (1) ──── (N) AuditLog
```

---

## 6. API Endpointlar

### Authentication
```
POST   /api/v1/auth/login/              # JWT token olish
POST   /api/v1/auth/refresh/            # Token yangilash
POST   /api/v1/auth/logout/             # Logout
GET    /api/v1/auth/me/                 # Joriy foydalanuvchi
PUT    /api/v1/auth/me/                 # Profilni yangilash
POST   /api/v1/auth/change-password/    # Parol o'zgartirish
```

### Users (Superadmin/Admin)
```
GET    /api/v1/users/                   # Foydalanuvchilar ro'yxati
POST   /api/v1/users/                   # Yangi foydalanuvchi
GET    /api/v1/users/{id}/              # Bitta foydalanuvchi
PUT    /api/v1/users/{id}/              # Yangilash
DELETE /api/v1/users/{id}/              # O'chirish (soft)
```

### Students
```
GET    /api/v1/students/                # Ro'yxat (filter, search, pagination)
POST   /api/v1/students/                # Yangi o'quvchi
GET    /api/v1/students/{id}/           # Bitta o'quvchi
PUT    /api/v1/students/{id}/           # Yangilash
DELETE /api/v1/students/{id}/           # O'chirish (soft)
GET    /api/v1/students/{id}/groups/    # O'quvchi guruhlari
GET    /api/v1/students/{id}/payments/  # To'lov tarixi
GET    /api/v1/students/{id}/attendance/# Davomat tarixi
POST   /api/v1/students/{id}/freeze/    # Muzlatish
POST   /api/v1/students/{id}/activate/  # Faollashtirish
```

### Teachers
```
GET    /api/v1/teachers/                # Ro'yxat
POST   /api/v1/teachers/                # Yangi o'qituvchi
GET    /api/v1/teachers/{id}/           # Bitta o'qituvchi
PUT    /api/v1/teachers/{id}/           # Yangilash
DELETE /api/v1/teachers/{id}/           # O'chirish (soft)
GET    /api/v1/teachers/{id}/groups/    # O'qituvchi guruhlari
GET    /api/v1/teachers/{id}/schedule/  # Dars jadvali
```

### Courses
```
GET    /api/v1/courses/                 # Ro'yxat
POST   /api/v1/courses/                 # Yangi kurs
GET    /api/v1/courses/{id}/            # Bitta kurs
PUT    /api/v1/courses/{id}/            # Yangilash
DELETE /api/v1/courses/{id}/            # O'chirish (soft)
GET    /api/v1/courses/{id}/groups/     # Kurs guruhlari
```

### Groups
```
GET    /api/v1/groups/                  # Ro'yxat
POST   /api/v1/groups/                  # Yangi guruh
GET    /api/v1/groups/{id}/             # Bitta guruh
PUT    /api/v1/groups/{id}/             # Yangilash
DELETE /api/v1/groups/{id}/             # O'chirish (soft)
GET    /api/v1/groups/{id}/students/    # Guruh o'quvchilari
POST   /api/v1/groups/{id}/add-student/ # O'quvchi qo'shish
POST   /api/v1/groups/{id}/remove-student/ # O'quvchi chiqarish
```

### Rooms
```
GET    /api/v1/rooms/                   # Ro'yxat
POST   /api/v1/rooms/                   # Yangi xona
GET    /api/v1/rooms/{id}/              # Bitta xona
PUT    /api/v1/rooms/{id}/              # Yangilash
DELETE /api/v1/rooms/{id}/              # O'chirish
GET    /api/v1/rooms/{id}/availability/ # Band vaqtlar
```

### Attendance
```
GET    /api/v1/attendance/              # Ro'yxat (filter: group, date)
POST   /api/v1/attendance/              # Davomat yaratish
GET    /api/v1/attendance/{id}/         # Bitta davomat
PUT    /api/v1/attendance/{id}/         # Yangilash
GET    /api/v1/attendance/stats/        # Statistika
```

### Payments
```
GET    /api/v1/payments/                # Ro'yxat
POST   /api/v1/payments/                # Yangi to'lov
GET    /api/v1/payments/{id}/           # Bitta to'lov
PUT    /api/v1/payments/{id}/           # Yangilash
DELETE /api/v1/payments/{id}/           # O'chirish (soft)
GET    /api/v1/payments/debtors/        # Qarzdorlar
GET    /api/v1/payments/monthly-report/ # Oylik hisobot
```

### Schedule
```
GET    /api/v1/schedule/                # Haftalik jadval
GET    /api/v1/schedule/by-teacher/     # O'qituvchi bo'yicha
GET    /api/v1/schedule/by-room/        # Xona bo'yicha
POST   /api/v1/schedule/               # Yangi jadval
PUT    /api/v1/schedule/{id}/           # Yangilash
DELETE /api/v1/schedule/{id}/           # O'chirish
```

### Leads
```
GET    /api/v1/leads/                   # Ro'yxat
POST   /api/v1/leads/                   # Yangi lead
GET    /api/v1/leads/{id}/              # Bitta lead
PUT    /api/v1/leads/{id}/              # Yangilash
DELETE /api/v1/leads/{id}/              # O'chirish (soft)
POST   /api/v1/leads/{id}/convert/      # O'quvchiga aylantirish
GET    /api/v1/leads/{id}/history/      # Status tarixi
```

### Reports
```
GET    /api/v1/reports/dashboard/       # Asosiy KPI
GET    /api/v1/reports/students/        # O'quvchi statistika
GET    /api/v1/reports/financial/       # Moliyaviy hisobot
GET    /api/v1/reports/attendance/      # Davomat hisobot
GET    /api/v1/reports/leads/           # Lead analitika
```

### Notifications
```
GET    /api/v1/notifications/           # Bildirishnomalar
POST   /api/v1/notifications/mark-read/ # O'qilgan deb belgilash
GET    /api/v1/notifications/unread-count/ # O'qilmaganlar soni
```

---

## 7. Authentication va Authorization

### JWT Flow:
1. Foydalanuvchi `email + password` yuboradi → `/api/v1/auth/login/`
2. Server `access_token` (15 min) + `refresh_token` (7 kun) qaytaradi
3. Har bir so'rovda `Authorization: Bearer <access_token>` header yuboriladi
4. Token muddati o'tganda `refresh_token` orqali yangilanadi

### Role-Based Permissions:
| Amal | Superadmin | Admin | Manager | Teacher | Student |
|------|:---:|:---:|:---:|:---:|:---:|
| Barcha CRUD | ✅ | ✅ | ❌ | ❌ | ❌ |
| O'quvchi CRUD | ✅ | ✅ | ✅ | ❌ | ❌ |
| O'qituvchi CRUD | ✅ | ✅ | ❌ | ❌ | ❌ |
| Kurs/Guruh CRUD | ✅ | ✅ | ✅ | ❌ | ❌ |
| Davomat yozish | ✅ | ✅ | ✅ | ✅ | ❌ |
| To'lov qabul qilish | ✅ | ✅ | ✅ | ❌ | ❌ |
| Lead boshqarish | ✅ | ✅ | ✅ | ❌ | ❌ |
| O'z profilini ko'rish | ✅ | ✅ | ✅ | ✅ | ✅ |
| O'z davomatini ko'rish | ❌ | ❌ | ❌ | ❌ | ✅ |
| Hisobotlar | ✅ | ✅ | ✅ (cheklangan) | ❌ | ❌ |
| Foydalanuvchi yaratish | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 8-9-10. Frontend Arxitekturasi

### Papkalar strukturasi:
```
frontend/
├── public/
├── src/
│   ├── api/                    # API service layer
│   │   ├── axios.js           # Axios instance (interceptors)
│   │   ├── auth.js            # Auth API
│   │   ├── students.js        # Students API
│   │   ├── teachers.js        # Teachers API
│   │   ├── courses.js         # Courses API
│   │   ├── groups.js          # Groups API
│   │   ├── attendance.js      # Attendance API
│   │   ├── payments.js        # Payments API
│   │   ├── schedule.js        # Schedule API
│   │   ├── leads.js           # Leads API
│   │   ├── reports.js         # Reports API
│   │   └── notifications.js   # Notifications API
│   ├── components/
│   │   ├── common/            # Umumiy komponentlar
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── MainLayout.jsx
│   │   │   └── MobileNav.jsx
│   │   ├── dashboard/
│   │   │   ├── StatsCard.jsx
│   │   │   ├── RevenueChart.jsx
│   │   │   ├── AttendanceChart.jsx
│   │   │   ├── LeadFunnel.jsx
│   │   │   └── RecentActivity.jsx
│   │   ├── students/
│   │   │   ├── StudentList.jsx
│   │   │   ├── StudentForm.jsx
│   │   │   ├── StudentDetail.jsx
│   │   │   └── StudentFilters.jsx
│   │   ├── teachers/
│   │   ├── courses/
│   │   ├── groups/
│   │   ├── attendance/
│   │   ├── payments/
│   │   ├── schedule/
│   │   ├── leads/
│   │   └── notifications/
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.jsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.jsx
│   │   ├── students/
│   │   │   ├── StudentsListPage.jsx
│   │   │   ├── StudentCreatePage.jsx
│   │   │   ├── StudentEditPage.jsx
│   │   │   └── StudentDetailPage.jsx
│   │   ├── teachers/
│   │   ├── courses/
│   │   ├── groups/
│   │   ├── attendance/
│   │   ├── payments/
│   │   ├── schedule/
│   │   ├── leads/
│   │   ├── reports/
│   │   ├── settings/
│   │   └── NotFoundPage.jsx
│   ├── store/                  # Zustand stores
│   │   ├── useAuthStore.js
│   │   ├── useStudentStore.js
│   │   ├── useNotificationStore.js
│   │   └── useUIStore.js
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useDebounce.js
│   │   ├── usePagination.js
│   │   └── usePermission.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env
```

### Sahifalar ro'yxati:
1. **Login** — Kirish sahifasi
2. **Dashboard** — Asosiy KPI panel
3. **O'quvchilar** — Ro'yxat, Qo'shish, Tahrirlash, Batafsil
4. **O'qituvchilar** — Ro'yxat, Qo'shish, Tahrirlash, Batafsil
5. **Kurslar** — Ro'yxat, Qo'shish, Tahrirlash
6. **Guruhlar** — Ro'yxat, Qo'shish, Tahrirlash, Batafsil (o'quvchilar)
7. **Davomat** — Guruh tanlash, Davomat yozish, Tarix
8. **To'lovlar** — Ro'yxat, To'lov qabul, Qarzdorlar
9. **Jadval** — Haftalik ko'rinish, Xona bo'yicha
10. **Leadlar** — Kanban yoki ro'yxat, Qo'shish, Tahrirlash
11. **Hisobotlar** — Moliyaviy, Davomat, O'quvchi statistika
12. **Sozlamalar** — Profil, Tizim sozlamalari
13. **404** — Topilmadi sahifasi

---

## 11. Dashboard Dizayn Logikasi

Dashboard 4 ta asosiy qismdan iborat:

1. **KPI Kartalar (yuqori qator):**
   - Jami o'quvchilar / aktiv o'quvchilar
   - Aktiv guruhlar soni
   - Oylik tushum
   - Qarzdorlar soni
   - Yangi leadlar (bu hafta)

2. **Grafiklar (o'rta qator):**
   - Oylik tushum grafigi (line chart, 12 oy)
   - Davomat foizi (bar chart, haftalik)
   - Lead konversiya funneli (funnel chart)

3. **Jadvallar (pastki qator):**
   - So'nggi to'lovlar (5 ta)
   - Qarzdorlar ro'yxati (top 10)
   - Bugungi darslar

4. **Tezkor harakatlar:**
   - Yangi o'quvchi qo'shish
   - To'lov qabul qilish
   - Davomat yozish

---

## 12. CRUD Ishlash Prinsipi

### Backend Flow:
```
Request → URL Router → Permission Check → ViewSet → Serializer (validation) 
→ Service Layer (business logic) → Model (DB) → Serializer (response) → Response
```

### Frontend Flow:
```
User Action → Component → API Service (axios) → Backend API
→ Response → Store Update → Component Re-render
```

### Namunaviy CRUD Jarayoni (O'quvchi):

**Backend:**
1. `StudentSerializer` — validatsiya va serializatsiya
2. `StudentViewSet` — CRUD endpointlar
3. `StudentService` — biznes logika (user yaratish, guruhga qo'shish)
4. `StudentFilter` — qidiruv va filtrlash

**Frontend:**
1. `StudentsListPage` — ro'yxat sahifasi (Table + Pagination + Filter)
2. `StudentCreatePage` — forma sahifasi
3. `studentApi.js` — backend bilan aloqa
4. `useStudentStore.js` — holat boshqaruvi (kerak bo'lsa)

---

## 13. Bosqichma-Bosqich Development Plan

### Bosqich 1: Infratuzilma (1-2 kun)
- [ ] Django loyiha yaratish, settings sozlash
- [ ] PostgreSQL ulanish
- [ ] Core modulni yozish (BaseModel, permissions, pagination)
- [ ] JWT auth sozlash
- [ ] CORS sozlash
- [ ] React loyiha yaratish (Vite)
- [ ] Tailwind CSS sozlash
- [ ] Axios instance va interceptors
- [ ] Routing va Layout

### Bosqich 2: Auth va Foydalanuvchilar (2-3 kun)
- [ ] Custom User model
- [ ] Login/Logout API
- [ ] JWT token boshqaruvi
- [ ] Role-based permissions
- [ ] Frontend: Login sahifasi
- [ ] Frontend: Auth context/store
- [ ] Frontend: Protected routes

### Bosqich 3: Asosiy Modullar (5-7 kun)
- [ ] Kurslar CRUD (backend + frontend)
- [ ] O'qituvchilar CRUD (backend + frontend)
- [ ] Xonalar CRUD (backend + frontend)
- [ ] O'quvchilar CRUD (backend + frontend)
- [ ] Guruhlar CRUD (backend + frontend)
- [ ] O'quvchi-guruh bog'lanishi

### Bosqich 4: Operatsion Modullar (5-7 kun)
- [ ] Davomat moduli (backend + frontend)
- [ ] To'lovlar moduli (backend + frontend)
- [ ] Dars jadvali (backend + frontend)
- [ ] Qarzdorlar monitoring

### Bosqich 5: CRM va Analitika (3-4 kun)
- [ ] Leadlar moduli (backend + frontend)
- [ ] Lead pipeline
- [ ] Dashboard va KPI
- [ ] Hisobotlar

### Bosqich 6: Qo'shimcha (2-3 kun)
- [ ] Bildirishnomalar
- [ ] Audit log
- [ ] Export (Excel/PDF)
- [ ] Optimizatsiya va test

### Bosqich 7: Deployment (1-2 kun)
- [ ] Docker konfiguratsiya
- [ ] Nginx sozlash
- [ ] Production settings
- [ ] CI/CD pipeline

---

## 14. Avval Backend — Nima Uchun?

**Backend birinchi (API-first approach)** quyidagi sabablarga ko'ra:

1. **API kontrakt** — Frontend ishlab chiquvchi API tayyor bo'lgandan keyin aniq kontrakt asosida ishlaydi
2. **Mustaqil test** — Backend API'larni Swagger/Postman orqali mustaqil test qilish mumkin
3. **Parallel ish** — API tayyor bo'lgandan keyin frontend va mobile parallel ishlay boshlaydi
4. **Ma'lumotlar modeli** — Barcha biznes logika va validatsiyalar backendda markazlashgan
5. **Swagger hujjat** — drf-spectacular orqali avtomatik API hujjatlash

---

## 15. Har Bir Modul Uchun Kod Yozish Tartibi

1. `models.py` — Ma'lumotlar modeli
2. `serializers.py` — Serializer (Create, Update, List, Detail)
3. `services.py` — Biznes logika
4. `filters.py` — FilterSet
5. `permissions.py` — Permission class
6. `views.py` — ViewSet
7. `urls.py` — URL routing
8. `admin.py` — Admin panel
9. `tests/` — Unit testlar
10. Frontend: `api/module.js` → `components/` → `pages/`

---

## 16-17. Papkalar Strukturasi

Yuqorida 2-bo'lim (Backend) va 8-bo'lim (Frontend)da batafsil yozilgan.

---

## 18. Productionga Chiqarish

1. **Docker Compose** — backend, frontend, postgres, nginx, redis
2. **Nginx** — reverse proxy, static fayllar, SSL
3. **Gunicorn** — Django WSGI server
4. **PostgreSQL** — alohida container yoki managed service
5. **Redis** — cache va celery broker (bildirishnomalar uchun)
6. **Environment variables** — .env fayllar, secrets boshqaruvi
7. **CI/CD** — GitHub Actions yoki GitLab CI
8. **Monitoring** — Sentry (xatolar), logging

---

## 19. Xavfsizlik Bo'yicha Tavsiyalar

1. **HTTPS** majburiy (productionda)
2. **CORS** faqat ruxsat berilgan domenlar
3. **Rate limiting** — login va boshqa muhim endpointlarga
4. **Input validation** — serializer darajasida
5. **SQL injection** — Django ORM himoyasi
6. **XSS** — React avtomatik escape + DRF
7. **CSRF** — JWT ishlatilgani uchun CSRF token shart emas
8. **Password hashing** — Django default (PBKDF2)
9. **JWT secret** — kuchli, environment variable'da
10. **File upload** — tur va hajm cheklash
11. **Audit log** — barcha muhim amallar loglanadi
12. **Sensitive data** — parollar, tokenlar hech qachon responseda qaytmasin

---

## 20. Mobil Ilova Uchun API Tayyorlash

1. **Versiyalash** — `/api/v1/`, `/api/v2/` — eski mobillar ishdan chiqmasin
2. **Token-based auth** — JWT mobil uchun ideal
3. **Pagination** — `cursor` yoki `limit-offset` pagination
4. **Minimal response** — kerakli fieldlarnigina qaytarish (serializer fieldlari)
5. **Push notification** — Firebase Cloud Messaging uchun device token saqlash
6. **Offline support** — `last_modified` field, delta sync
7. **File upload** — multipart/form-data qo'llab-quvvatlash
8. **Error format** — standart error response formati
9. **Rate limiting** — mobil uchun alohida limitlar
10. **API documentation** — OpenAPI/Swagger — mobil dasturchi uchun hujjat
