import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import groupsApi from '../../api/groups';
import attendanceApi from '../../api/attendance';
import { ATTENDANCE_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function AttendancePage() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [history, setHistory] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await groupsApi.getAll({ status: 'active', page_size: 100 });
        setGroups(res.data.results || []);
      } catch { /* ignore */ }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const [sRes, hRes] = await Promise.all([
          groupsApi.getStudents(selectedGroup),
          attendanceApi.getAll({ group: selectedGroup, page_size: 10, ordering: '-date' }),
        ]);
        const studentsList = sRes.data.results || sRes.data || [];
        setStudents(studentsList);
        const defaultRecords = {};
        studentsList.forEach((gs) => {
          const sid = gs.student?.id || gs.id;
          defaultRecords[sid] = 'present';
        });
        setRecords(defaultRecords);
        setHistory(hRes.data.results || []);
      } catch { toast.error("Yuklashda xatolik"); }
      finally { setLoadingStudents(false); }
    };
    fetchStudents();
  }, [selectedGroup]);

  const handleStatusChange = (studentId, status) => {
    setRecords({ ...records, [studentId]: status });
  };

  const handleSubmit = async () => {
    if (!selectedGroup || !date) { toast.error("Guruh va sanani tanlang"); return; }
    setSaving(true);
    try {
      const attendanceRecords = Object.entries(records).map(([student_id, status]) => ({
        student_id, status,
      }));
      await attendanceApi.create({ group_id: selectedGroup, date, records: attendanceRecords });
      toast.success("Davomat saqlandi");
      const hRes = await attendanceApi.getAll({ group: selectedGroup, page_size: 10, ordering: '-date' });
      setHistory(hRes.data.results || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik");
    } finally { setSaving(false); }
  };

  const groupOpts = groups.map((g) => ({ value: g.id, label: g.name }));
  const statusColors = { present: 'bg-green-500', absent: 'bg-red-500', late: 'bg-yellow-500', excused: 'bg-blue-500' };

  return (
    <div>
      <PageHeader title="Davomat" subtitle="Guruh bo'yicha davomat yozish" />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Select label="Guruh" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} options={groupOpts} placeholder="Guruhni tanlang..." />
          <Input label="Sana" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <div className="flex items-end">
            <Button onClick={handleSubmit} loading={saving} disabled={!selectedGroup || students.length === 0} className="w-full">
              Saqlash
            </Button>
          </div>
        </div>

        {loadingStudents ? <LoadingSpinner /> : students.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">O'quvchi</th>
                  {Object.entries(ATTENDANCE_STATUS).map(([key, { label }]) => (
                    <th key={key} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((gs) => {
                  const sid = gs.student?.id || gs.id;
                  const name = gs.student?.user?.full_name || gs.full_name || '—';
                  return (
                    <tr key={sid} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{name}</td>
                      {Object.keys(ATTENDANCE_STATUS).map((status) => (
                        <td key={status} className="px-4 py-3 text-center">
                          <input
                            type="radio"
                            name={`attendance-${sid}`}
                            checked={records[sid] === status}
                            onChange={() => handleStatusChange(sid, status)}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Davomat tarixi</h3>
          <div className="space-y-2">
            {history.map((att) => (
              <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">{formatDate(att.date)}</span>
                <div className="flex gap-3 text-sm">
                  {att.records_summary && (
                    <>
                      <span className="text-green-600">✓ {att.records_summary.present_count || 0}</span>
                      <span className="text-red-600">✗ {att.records_summary.absent_count || 0}</span>
                      <span className="text-yellow-600">⏱ {att.records_summary.late_count || 0}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
