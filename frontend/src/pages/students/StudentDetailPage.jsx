import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import studentsApi from '../../api/students';
import { STUDENT_STATUS } from '../../utils/constants';
import { formatDate, formatPhone } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await studentsApi.getById(id);
        setStudent(res.data.data || res.data);
      } catch { toast.error("O'quvchi topilmadi"); navigate('/students'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id, navigate]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await studentsApi.delete(id);
      toast.success("O'quvchi o'chirildi");
      navigate('/students');
    } catch { toast.error("O'chirishda xatolik"); }
    finally { setDeleting(false); setDeleteOpen(false); }
  };

  const handleFreeze = async () => {
    try { await studentsApi.freeze(id); toast.success("Muzlatildi"); setStudent({ ...student, status: 'frozen' }); }
    catch { toast.error("Xatolik"); }
  };

  const handleActivate = async () => {
    try { await studentsApi.activate(id); toast.success("Faollashtirildi"); setStudent({ ...student, status: 'active' }); }
    catch { toast.error("Xatolik"); }
  };

  if (loading) return <LoadingSpinner size="lg" className="min-h-[60vh]" />;
  if (!student) return null;

  return (
    <div>
      <PageHeader
        title={student.user?.full_name || "O'quvchi"}
        actions={
          <div className="flex gap-2 flex-wrap">
            {student.status === 'active' && <Button variant="outline" onClick={handleFreeze}>Muzlatish</Button>}
            {student.status === 'frozen' && <Button variant="success" onClick={handleActivate}>Faollashtirish</Button>}
            <Button variant="outline" onClick={() => navigate(`/students/${id}/edit`)}>
              <HiOutlinePencil className="w-4 h-4 mr-1" />Tahrirlash
            </Button>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <HiOutlineTrash className="w-4 h-4 mr-1" />O'chirish
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Shaxsiy ma'lumotlar</h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div><p className="text-sm text-gray-500">F.I.O</p><p className="font-medium">{student.user?.full_name}</p></div>
            <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{student.user?.email}</p></div>
            <div><p className="text-sm text-gray-500">Telefon</p><p className="font-medium">{formatPhone(student.user?.phone)}</p></div>
            <div><p className="text-sm text-gray-500">Ota-ona tel.</p><p className="font-medium">{formatPhone(student.parent_phone)}</p></div>
            <div><p className="text-sm text-gray-500">Tug'ilgan sana</p><p className="font-medium">{formatDate(student.birth_date)}</p></div>
            <div><p className="text-sm text-gray-500">Holat</p><StatusBadge statusMap={STUDENT_STATUS} status={student.status} /></div>
            <div><p className="text-sm text-gray-500">Manzil</p><p className="font-medium">{student.address || '—'}</p></div>
            <div><p className="text-sm text-gray-500">Ro'yxatdan</p><p className="font-medium">{formatDate(student.enrolled_date)}</p></div>
          </div>
          {student.notes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Izoh</p>
              <p className="text-sm mt-1">{student.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-3">Guruhlar</h3>
            {student.groups?.length > 0 ? (
              <ul className="space-y-2">
                {student.groups.map((g) => (
                  <li key={g.id} className="text-sm p-2 bg-gray-50 rounded-lg font-medium">{g.group?.name || g.name}</li>
                ))}
              </ul>
            ) : <p className="text-sm text-gray-500">Guruhlar mavjud emas</p>}
          </div>
        </div>
      </div>

      <ConfirmDialog isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete}
        title="O'quvchini o'chirish" message="Haqiqatan ham bu o'quvchini o'chirmoqchimisiz?" loading={deleting} />
    </div>
  );
}
