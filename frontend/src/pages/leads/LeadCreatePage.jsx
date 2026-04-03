import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import leadsApi from '../../api/leads';
import coursesApi from '../../api/courses';
import { LEAD_SOURCES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function LeadCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ full_name: '', phone: '', source: 'phone', course_interest: '', notes: '' });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await coursesApi.getAll({ page_size: 100 });
        setCourses(res.data.results || []);
      } catch { /* ignore */ }
    };
    fetch();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await leadsApi.create(form);
      toast.success("Lead muvaffaqiyatli qo'shildi");
      navigate('/leads');
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else toast.error(error.response?.data?.message || "Xatolik");
    } finally { setLoading(false); }
  };

  const sourceOpts = Object.entries(LEAD_SOURCES).map(([value, { label }]) => ({ value, label }));
  const courseOpts = courses.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div>
      <PageHeader title="Yangi lead" />
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="F.I.O" name="full_name" value={form.full_name} onChange={handleChange} error={errors.full_name} required />
            <Input label="Telefon" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+998901234567" required />
            <Select label="Manba" name="source" value={form.source} onChange={handleChange} options={sourceOpts} />
            <Select label="Qiziqtirgan kurs" name="course_interest" value={form.course_interest} onChange={handleChange} options={courseOpts} placeholder="Tanlanmagan" />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Izoh</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => navigate('/leads')}>Bekor qilish</Button>
            <Button type="submit" loading={loading}>Saqlash</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
