import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import coursesApi from '../../api/courses';
import toast from 'react-hot-toast';

export default function CourseEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ name: '', description: '', duration_months: '', price: '', payment_type: '', is_active: true });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await coursesApi.getById(id);
        const d = res.data.data || res.data;
        setForm({ name: d.name, description: d.description || '', duration_months: d.duration_months, price: d.price, payment_type: d.payment_type, is_active: d.is_active });
      } catch { toast.error("Yuklashda xatolik"); navigate('/courses'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id, navigate]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await coursesApi.update(id, form);
      toast.success("Kurs yangilandi");
      navigate('/courses');
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else toast.error(error.response?.data?.message || "Xatolik");
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner size="lg" className="min-h-[60vh]" />;

  return (
    <div>
      <PageHeader title="Kursni tahrirlash" />
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <Input label="Kurs nomi" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Tavsif</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Davomiyligi (oy)" name="duration_months" type="number" min="1" value={form.duration_months} onChange={handleChange} required />
            <Input label="Narxi" name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
            <Select label="To'lov turi" name="payment_type" value={form.payment_type} onChange={handleChange}
              options={[{ value: 'monthly', label: 'Oylik' }, { value: 'full', label: "To'liq" }]} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm font-medium text-gray-700">Faol</span>
          </label>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => navigate('/courses')}>Bekor qilish</Button>
            <Button type="submit" loading={saving}>Saqlash</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
