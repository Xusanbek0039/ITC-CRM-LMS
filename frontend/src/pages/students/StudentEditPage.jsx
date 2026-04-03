import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import studentsApi from '../../api/students';
import { STUDENT_STATUS } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function StudentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '', parent_phone: '',
    address: '', birth_date: '', notes: '', status: '',
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await studentsApi.getById(id);
        const d = res.data.data || res.data;
        setForm({
          first_name: d.user?.first_name || '', last_name: d.user?.last_name || '',
          phone: d.user?.phone || '', parent_phone: d.parent_phone || '',
          address: d.address || '', birth_date: d.birth_date || '',
          notes: d.notes || '', status: d.status || '',
        });
      } catch { toast.error("Yuklashda xatolik"); navigate('/students'); }
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
      await studentsApi.update(id, form);
      toast.success("Muvaffaqiyatli yangilandi");
      navigate(`/students/${id}`);
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else toast.error(error.response?.data?.message || "Xatolik");
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner size="lg" className="min-h-[60vh]" />;

  const statusOpts = Object.entries(STUDENT_STATUS).map(([value, { label }]) => ({ value, label }));

  return (
    <div>
      <PageHeader title="O'quvchini tahrirlash" />
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Ism" name="first_name" value={form.first_name} onChange={handleChange} error={errors.first_name} required />
            <Input label="Familiya" name="last_name" value={form.last_name} onChange={handleChange} error={errors.last_name} required />
            <Input label="Telefon" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
            <Input label="Ota-ona tel." name="parent_phone" value={form.parent_phone} onChange={handleChange} />
            <Input label="Tug'ilgan sana" name="birth_date" type="date" value={form.birth_date} onChange={handleChange} />
            <Select label="Holat" name="status" value={form.status} onChange={handleChange} options={statusOpts} />
          </div>
          <Input label="Manzil" name="address" value={form.address} onChange={handleChange} />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Izoh</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => navigate(`/students/${id}`)}>Bekor qilish</Button>
            <Button type="submit" loading={saving}>Saqlash</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
