import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import teachersApi from '../../api/teachers';
import toast from 'react-hot-toast';

export default function TeacherEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', specialization: '', bio: '' });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await teachersApi.getById(id);
        const d = res.data.data || res.data;
        setForm({
          first_name: d.user?.first_name || '', last_name: d.user?.last_name || '',
          phone: d.user?.phone || '', specialization: d.specialization || '', bio: d.bio || '',
        });
      } catch { toast.error("Yuklashda xatolik"); navigate('/teachers'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await teachersApi.update(id, form);
      toast.success("Muvaffaqiyatli yangilandi");
      navigate('/teachers');
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else toast.error(error.response?.data?.message || "Xatolik");
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner size="lg" className="min-h-[60vh]" />;

  return (
    <div>
      <PageHeader title="O'qituvchini tahrirlash" />
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Ism" name="first_name" value={form.first_name} onChange={handleChange} error={errors.first_name} required />
            <Input label="Familiya" name="last_name" value={form.last_name} onChange={handleChange} error={errors.last_name} required />
            <Input label="Telefon" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
            <Input label="Mutaxassislik" name="specialization" value={form.specialization} onChange={handleChange} required />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => navigate('/teachers')}>Bekor qilish</Button>
            <Button type="submit" loading={saving}>Saqlash</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
