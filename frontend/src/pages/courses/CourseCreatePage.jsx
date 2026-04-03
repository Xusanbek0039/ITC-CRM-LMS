import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import coursesApi from '../../api/courses';
import toast from 'react-hot-toast';

export default function CourseCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ name: '', description: '', duration_months: '', price: '', payment_type: 'monthly' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await coursesApi.create(form);
      toast.success("Kurs muvaffaqiyatli yaratildi");
      navigate('/courses');
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else toast.error(error.response?.data?.message || "Xatolik");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="Yangi kurs" />
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <Input label="Kurs nomi" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Tavsif</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Davomiyligi (oy)" name="duration_months" type="number" min="1" value={form.duration_months} onChange={handleChange} error={errors.duration_months} required />
            <Input label="Narxi" name="price" type="number" min="0" value={form.price} onChange={handleChange} error={errors.price} required />
            <Select label="To'lov turi" name="payment_type" value={form.payment_type} onChange={handleChange}
              options={[{ value: 'monthly', label: 'Oylik' }, { value: 'full', label: "To'liq" }]} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => navigate('/courses')}>Bekor qilish</Button>
            <Button type="submit" loading={loading}>Saqlash</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
