import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus } from 'react-icons/hi';
import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import teachersApi from '../../api/teachers';
import { formatPhone } from '../../utils/formatters';
import { buildQueryParams } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';
import usePagination from '../../hooks/usePagination';
import toast from 'react-hot-toast';

export default function TeachersListPage() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const pagination = usePagination();

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildQueryParams({ search: debouncedSearch, page: pagination.page, page_size: pagination.pageSize });
      const res = await teachersApi.getAll(params);
      setTeachers(res.data.results || []);
      pagination.updateFromResponse(res.data);
    } catch { toast.error("O'qituvchilar ro'yxatini yuklashda xatolik"); }
    finally { setLoading(false); }
  }, [debouncedSearch, pagination.page]);

  useEffect(() => { fetchTeachers(); }, [fetchTeachers]);
  useEffect(() => { pagination.resetPage(); }, [debouncedSearch]);

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
    { key: 'specialization', title: 'Mutaxassislik' },
    {
      key: 'is_active', title: 'Holat',
      render: (_, row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.user?.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.user?.is_active !== false ? 'Aktiv' : 'Nofaol'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="O'qituvchilar"
        subtitle={`Jami: ${pagination.totalCount} ta`}
        actions={<Button onClick={() => navigate('/teachers/create')}><HiOutlinePlus className="w-5 h-5 mr-1" />Yangi o'qituvchi</Button>}
      />
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Ism, email bo'yicha qidirish..." /></div>
      <Table columns={columns} data={teachers} loading={loading} onRowClick={(row) => navigate(`/teachers/${row.id}/edit`)} emptyMessage="O'qituvchilar topilmadi" />
      <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} totalCount={pagination.totalCount} onPageChange={pagination.setPage} />
    </div>
  );
}
