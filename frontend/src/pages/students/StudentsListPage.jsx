import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus } from 'react-icons/hi';
import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import studentsApi from '../../api/students';
import { STUDENT_STATUS } from '../../utils/constants';
import { formatDate, formatPhone } from '../../utils/formatters';
import { buildQueryParams } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';
import usePagination from '../../hooks/usePagination';
import toast from 'react-hot-toast';

export default function StudentsListPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search);
  const pagination = usePagination();

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildQueryParams({
        search: debouncedSearch,
        status: statusFilter,
        page: pagination.page,
        page_size: pagination.pageSize,
      });
      const res = await studentsApi.getAll(params);
      setStudents(res.data.results || []);
      pagination.updateFromResponse(res.data);
    } catch {
      toast.error("O'quvchilar ro'yxatini yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, pagination.page]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);
  useEffect(() => { pagination.resetPage(); }, [debouncedSearch, statusFilter]);

  const columns = [
    {
      key: 'user', title: 'F.I.O',
      render: (user) => (
        <div>
          <p className="font-medium text-gray-900">{user?.full_name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      ),
    },
    { key: 'phone', title: 'Telefon', render: (_, row) => formatPhone(row.user?.phone) },
    { key: 'parent_phone', title: 'Ota-ona tel.', render: (val) => formatPhone(val) },
    { key: 'status', title: 'Holat', render: (s) => <StatusBadge statusMap={STUDENT_STATUS} status={s} /> },
    { key: 'enrolled_date', title: "Ro'yxatdan", render: (v) => formatDate(v) },
  ];

  const statusOpts = Object.entries(STUDENT_STATUS).map(([value, { label }]) => ({ value, label }));

  return (
    <div>
      <PageHeader
        title="O'quvchilar"
        subtitle={`Jami: ${pagination.totalCount} ta`}
        actions={<Button onClick={() => navigate('/students/create')}><HiOutlinePlus className="w-5 h-5 mr-1" />Yangi o'quvchi</Button>}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Ism, email, telefon bo'yicha..." /></div>
        <div className="w-full sm:w-48">
          <Select options={statusOpts} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} placeholder="Barcha holatlar" />
        </div>
      </div>
      <Table columns={columns} data={students} loading={loading} onRowClick={(row) => navigate(`/students/${row.id}`)} emptyMessage="O'quvchilar topilmadi" />
      <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} totalCount={pagination.totalCount} onPageChange={pagination.setPage} />
    </div>
  );
}
