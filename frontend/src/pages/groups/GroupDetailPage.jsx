import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlinePencil, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import groupsApi from '../../api/groups';
import studentsApi from '../../api/students';
import { GROUP_STATUS, WEEKDAYS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchStudents, setSearchStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [gRes, sRes] = await Promise.all([
          groupsApi.getById(id),
          groupsApi.getStudents(id),
        ]);
        setGroup(gRes.data.data || gRes.data);
        setStudents(sRes.data.results || sRes.data || []);
      } catch { toast.error("Yuklashda xatolik"); navigate('/groups'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id, navigate]);

  const handleSearchStudents = async () => {
    if (!studentSearch.trim()) return;
    try {
      const res = await studentsApi.getAll({ search: studentSearch, status: 'active', page_size: 10 });
      setSearchStudents(res.data.results || []);
    } catch { /* ignore */ }
  };

  const handleAddStudent = async (studentId) => {
    try {
      await groupsApi.addStudent(id, { student_id: studentId });
      toast.success("O'quvchi qo'shildi");
      setAddModalOpen(false);
      const sRes = await groupsApi.getStudents(id);
      setStudents(sRes.data.results || sRes.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik");
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!confirm("O'quvchini guruhdan chiqarmoqchimisiz?")) return;
    try {
      await groupsApi.removeStudent(id, { student_id: studentId });
      toast.success("O'quvchi chiqarildi");
      setStudents(students.filter((s) => s.student?.id !== studentId && s.id !== studentId));
    } catch { toast.error("Xatolik"); }
  };

  if (loading) return <LoadingSpinner size="lg" className="min-h-[60vh]" />;
  if (!group) return null;

  const dayLabels = (group.lesson_days || []).map((d) => WEEKDAYS.find((w) => w.value === d)?.label || d).join(', ');

  return (
    <div>
      <PageHeader
        title={group.name}
        actions={<Button variant="outline" onClick={() => navigate(`/groups/${id}/edit`)}><HiOutlinePencil className="w-4 h-4 mr-1" />Tahrirlash</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Guruh ma'lumotlari</h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div><p className="text-sm text-gray-500">Kurs</p><p className="font-medium">{group.course?.name}</p></div>
            <div><p className="text-sm text-gray-500">O'qituvchi</p><p className="font-medium">{group.teacher?.user?.full_name || '—'}</p></div>
            <div><p className="text-sm text-gray-500">Xona</p><p className="font-medium">{group.room?.name || '—'}</p></div>
            <div><p className="text-sm text-gray-500">Holat</p><StatusBadge statusMap={GROUP_STATUS} status={group.status} /></div>
            <div><p className="text-sm text-gray-500">Boshlanish</p><p className="font-medium">{formatDate(group.start_date)}</p></div>
            <div><p className="text-sm text-gray-500">Tugash</p><p className="font-medium">{formatDate(group.end_date)}</p></div>
            <div><p className="text-sm text-gray-500">Dars kunlari</p><p className="font-medium">{dayLabels || '—'}</p></div>
            <div><p className="text-sm text-gray-500">Dars vaqti</p><p className="font-medium">{group.lesson_start_time} — {group.lesson_end_time}</p></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">O'quvchilar ({students.length})</h3>
            <Button size="sm" onClick={() => setAddModalOpen(true)}><HiOutlinePlus className="w-4 h-4 mr-1" />Qo'shish</Button>
          </div>
          {students.length > 0 ? (
            <ul className="space-y-2">
              {students.map((gs) => (
                <li key={gs.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{gs.student?.user?.full_name || gs.full_name || '—'}</p>
                    <p className="text-xs text-gray-500">{formatDate(gs.joined_date)}</p>
                  </div>
                  <button onClick={() => handleRemoveStudent(gs.student?.id || gs.id)} className="text-red-500 hover:text-red-700">
                    <HiOutlineX className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500">O'quvchilar mavjud emas</p>}
        </div>
      </div>

      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="O'quvchi qo'shish">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} placeholder="Ism bo'yicha qidiring..." />
            <Button onClick={handleSearchStudents}>Qidirish</Button>
          </div>
          {searchStudents.length > 0 && (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {searchStudents.map((s) => (
                <li key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">{s.user?.full_name}</span>
                  <Button size="sm" onClick={() => handleAddStudent(s.id)}>Qo'shish</Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </div>
  );
}
