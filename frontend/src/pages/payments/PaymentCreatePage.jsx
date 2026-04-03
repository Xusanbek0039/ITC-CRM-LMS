import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import studentsApi from '../../api/students';
import paymentsApi from '../../api/payments';
import { PAYMENT_TYPES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function PaymentCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [students, setStudents] = useState([]);
  const [studentGroups, setStudentGroups] = useState([]);
  const [form, setForm] = useState({
    student_id: '', group_id: '', amount: '', discount: '0',
    payment_type: 'cash', payment_date: new Date().toISOString().split('T')[0],
    period_month: new Date().toISOString().slice(0, 7) + '-01', note: '',
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await studentsApi.getAll({ status: 'active', page_size: 200 });
        setStudents(res.data.results || []);
      } catch { /* ignore */ }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (!form.student_id) { setStudentGroups([]); return; }
    const fetchGroups = async () => {
      try {
        const res = await studentsApi.getGroups(form.student_id);
        setStudentGroups(res.data.results || res.data || []);
      } catch { /* ignore */ }
    };
    fetchGroups();
  }, [form.student_id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await paymentsApi.create(form);
      toast.success("To'lov muvaffaqiyatli saqlandi");
      navigate('/payments');
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else toast.error(error.response?.data?.message || "Xatolik");
    } finally { setLoading(false); }
  };

  const studentOpts = students.map((s) => ({ value: s.id, label: s.user?.full_name }));
  const groupOpts = studentGroups.map((g) => ({ value: g.group?.id || g.id, label: g.group?.name || g.name }));
  const typeOpts = Object.entries(PAYMENT_TYPES).map(([value, { label }]) => ({ value, label }));

  return (
    <div>
      <PageHeader title="Yangi to'lov" />
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="O'quvchi" name="student_id" value={form.student_id} onChange={handleChange} options={studentOpts} error={errors.student_id} required />
            <Select label="Guruh" name="group_id" value={form.group_id} onChange={handleChange} options={groupOpts} />
            <Input label="Summa" name="amount" type="number" min="0" value={form.amount} onChange={handleChange} error={errors.amount} required />
            <Input label="Chegirma" name="discount" type="number" min="0" value={form.discount} onChange={handleChange} />
            <Select label="To'lov turi" name="payment_type" value={form.payment_type} onChange={handleChange} options={typeOpts} />
            <Input label="To'lov sanasi" name="payment_date" type="date" value={form.payment_date} onChange={handleChange} required />
            <Input label="Qaysi oy uchun" name="period_month" type="date" value={form.period_month} onChange={handleChange} required />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Izoh</label>
            <textarea name="note" value={form.note} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => navigate('/payments')}>Bekor qilish</Button>
            <Button type="submit" loading={loading}>Saqlash</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
