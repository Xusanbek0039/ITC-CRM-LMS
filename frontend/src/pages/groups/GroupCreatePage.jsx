import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import groupsApi from '../../api/groups';
import coursesApi from '../../api/courses';
import teachersApi from '../../api/teachers';
import { WEEKDAYS } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function GroupCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    name: '', course_id: '', teacher_id: '', room_id: '',
    start_date: '', end_date: '', lesson_days: [],
    lesson_start_time: '', lesson_end_time: '', max_students: 20,
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [c, t, r] = await Promise.all([
          coursesApi.getAll({ page_size: 100 }),
          teachersApi.getAll({ page_size: 100 }),
          groupsApi.getRooms ? groupsApi.getRooms({ page_size: 100 }) : Promise.resolve({ data: { results: [] } }),
        ]);
        setCourses(c.data.results || []);
        setTeachers(t.data.results || []);
        setRooms(r.data.results || r.data || []);
      } catch { /* ignore */ }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const toggleDay = (day) => {
    setForm({
      ...form,
      lesson_days: form.lesson_days.includes(day)
        ? form.lesson_days.filter((d) => d !== day)
        : [...form.lesson_days, day],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await groupsApi.create(form);
      toast.success("Guruh muvaffaqiyatli yaratildi");
      navigate('/groups');
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else toast.error(error.response?.data?.message || "Xatolik");
    } finally { setLoading(false); }
  };

  const courseOpts = courses.map((c) => ({ value: c.id, label: c.name }));
  const teacherOpts = teachers.map((t) => ({ value: t.id, label: t.user?.full_name || `${t.user?.first_name} ${t.user?.last_name}` }));
  const roomOpts = rooms.map((r) => ({ value: r.id, label: `${r.name} (${r.capacity} o'rin)` }));

  return (
    <div>
      <PageHeader title="Yangi guruh" />
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <Input label="Guruh nomi" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Kurs" name="course_id" value={form.course_id} onChange={handleChange} options={courseOpts} required />
            <Select label="O'qituvchi" name="teacher_id" value={form.teacher_id} onChange={handleChange} options={teacherOpts} required />
            <Select label="Xona" name="room_id" value={form.room_id} onChange={handleChange} options={roomOpts} />
            <Input label="Max o'quvchi" name="max_students" type="number" min="1" value={form.max_students} onChange={handleChange} />
            <Input label="Boshlanish sanasi" name="start_date" type="date" value={form.start_date} onChange={handleChange} required />
            <Input label="Tugash sanasi" name="end_date" type="date" value={form.end_date} onChange={handleChange} />
            <Input label="Dars boshlanishi" name="lesson_start_time" type="time" value={form.lesson_start_time} onChange={handleChange} required />
            <Input label="Dars tugashi" name="lesson_end_time" type="time" value={form.lesson_end_time} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Dars kunlari</label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((day) => (
                <button key={day.value} type="button" onClick={() => toggleDay(day.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${form.lesson_days.includes(day.value) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {day.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => navigate('/groups')}>Bekor qilish</Button>
            <Button type="submit" loading={loading}>Saqlash</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
