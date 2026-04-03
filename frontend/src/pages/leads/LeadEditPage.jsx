import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import leadsApi from '../../api/leads';
import coursesApi from '../../api/courses';
import { LEAD_STATUS, LEAD_SOURCES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function LeadEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [errors, setErrors] = useState({});
  const [courses, setCourses] = useState([]);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ full_name: '', phone: '', source: '', course_interest: '', status: '', notes: '' });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [lRes, cRes] = await Promise.all([
          leadsApi.getById(id),
          coursesApi.getAll({ page_size: 100 }),
        ]);
        const d = lRes.data.data || lRes.data;
        setForm({
          full_name: d.full_name, phone: d.phone, source: d.source,
          course_interest: d.course_interest?.id || '', status: d.status, notes: d.notes || '',
        });
        setHistory(d.history || []);
        setCourses(cRes.data.results || []);
      } catch { toast.error("Yuklashda xatolik"); navigate('/leads'); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [id, navigate]);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await leadsApi.update(id, form);
      toast.success("Lead yangilandi");
      navigate('/leads');
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else toast.error(error.response?.data?.message || "Xatolik");
    } finally { setSaving(false); }
  };

  const handleConvert = async () => {
    setConverting(true);
    try {
      await leadsApi.convert(id, {});
      toast.success("Lead o'quvchiga aylantirildi!");
      navigate('/leads');
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik");
    } finally { setConverting(false); }
  };

  if (loading) return <LoadingSpinner size="lg" className="min-h-[60vh]" />;

  const statusOpts = Object.entries(LEAD_STATUS).map(([value, { label }]) => ({ value, label }));
  const sourceOpts = Object.entries(LEAD_SOURCES).map(([value, { label }]) => ({ value, label }));
  const courseOpts = courses.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div>
      <PageHeader
        title="Lead tahrirlash"
        actions={
          form.status !== 'enrolled' && form.status !== 'cancelled' && (
            <Button variant="success" onClick={handleConvert} loading={converting}>O'quvchiga aylantirish</Button>
          )
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="F.I.O" name="full_name" value={form.full_name} onChange={handleChange} error={errors.full_name} required />
              <Input label="Telefon" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} required />
              <Select label="Holat" name="status" value={form.status} onChange={handleChange} options={statusOpts} />
              <Select label="Manba" name="source" value={form.source} onChange={handleChange} options={sourceOpts} />
              <Select label="Kurs" name="course_interest" value={form.course_interest} onChange={handleChange} options={courseOpts} placeholder="Tanlanmagan" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Izoh</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => navigate('/leads')}>Bekor qilish</Button>
              <Button type="submit" loading={saving}>Saqlash</Button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Tarix</h3>
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{LEAD_STATUS[h.old_status]?.label} → <span className="font-medium text-gray-900">{LEAD_STATUS[h.new_status]?.label}</span></span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{h.changed_by?.full_name || '—'} • {formatDate(h.created_at)}</p>
                  {h.note && <p className="text-xs text-gray-500 mt-1">{h.note}</p>}
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-500">Tarix mavjud emas</p>}
        </div>
      </div>
    </div>
  );
}
