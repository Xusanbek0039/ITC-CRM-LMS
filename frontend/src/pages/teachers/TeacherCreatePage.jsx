import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import teachersApi from '../../api/teachers';
import toast from 'react-hot-toast';

export default function TeacherCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    email: '', phone: '', first_name: '', last_name: '',
    password: '', password_confirm: '', specialization: '', bio: '',
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
      await teachersApi.create(form);
      toast.success("O'qituvchi muvaffaqiyatli qo'shildi");
      navigate('/teachers');
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="Yangi o'qituvchi" />
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Ism" name="first_name" value={form.first_name} onChange={handleChange} error={errors.first_name} required />
            <Input label="Familiya" name="last_name" value={form.last_name} onChange={handleChange} error={errors.last_name} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required />
            <Input label="Telefon" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+998901234567" required />
            <Input label="Parol" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} required />
            <Input label="Parol tasdiqlash" name="password_confirm" type="password" value={form.password_confirm} onChange={handleChange} error={errors.password_confirm} required />
          </div>
          <Input label="Mutaxassislik" name="specialization" value={form.specialization} onChange={handleChange} error={errors.specialization} required />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => navigate('/teachers')}>Bekor qilish</Button>
            <Button type="submit" loading={loading}>Saqlash</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
