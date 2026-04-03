import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import studentsApi from '../../api/students';
import toast from 'react-hot-toast';

export default function StudentCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    email: '', phone: '', first_name: '', last_name: '',
    password: '', password_confirm: '',
    parent_phone: '', address: '', birth_date: '', notes: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await studentsApi.create(form);
      toast.success("O'quvchi muvaffaqiyatli qo'shildi");
      navigate('/students');
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Yangi o'quvchi" subtitle="O'quvchi ma'lumotlarini kiriting" />
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h3 className="text-lg font-semibold border-b pb-3">Shaxsiy ma'lumotlar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Ism" name="first_name" value={form.first_name} onChange={handleChange} error={errors.first_name} required />
            <Input label="Familiya" name="last_name" value={form.last_name} onChange={handleChange} error={errors.last_name} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required />
            <Input label="Telefon" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+998901234567" required />
            <Input label="Parol" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} required />
            <Input label="Parol tasdiqlash" name="password_confirm" type="password" value={form.password_confirm} onChange={handleChange} error={errors.password_confirm} required />
          </div>
          <h3 className="text-lg font-semibold border-b pb-3 pt-2">Qo'shimcha ma'lumotlar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Ota-ona telefoni" name="parent_phone" value={form.parent_phone} onChange={handleChange} placeholder="+998901234567" />
            <Input label="Tug'ilgan sana" name="birth_date" type="date" value={form.birth_date} onChange={handleChange} />
          </div>
          <Input label="Manzil" name="address" value={form.address} onChange={handleChange} />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Izoh</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => navigate('/students')}>Bekor qilish</Button>
            <Button type="submit" loading={loading}>Saqlash</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
