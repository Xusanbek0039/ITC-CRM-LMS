import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus } from 'react-icons/hi';
import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import coursesApi from '../../api/courses';
import { formatMoney } from '../../utils/formatters';
import { buildQueryParams } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';
import usePagination from '../../hooks/usePagination';
import toast from 'react-hot-toast';

export default function CoursesListPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const pagination = usePagination();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildQueryParams({ search: debouncedSearch, page: pagination.page, page_size: pagination.pageSize });
      const res = await coursesApi.getAll(params);
      setCourses(res.data.results || []);
      pagination.updateFromResponse(res.data);
    } catch { toast.error("Kurslarni yuklashda xatolik"); }
    finally { setLoading(false); }
  }, [debouncedSearch, pagination.page]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);
  useEffect(() => { pagination.resetPage(); }, [debouncedSearch]);

  const columns = [
    { key: 'name', title: 'Kurs nomi', render: (v) => <span className="font-medium">{v}</span> },
    { key: 'duration_months', title: 'Davomiyligi', render: (v) => `${v} oy` },
    { key: 'price', title: 'Narxi', render: (v) => formatMoney(v) },
    {
      key: 'payment_type', title: "To'lov turi",
      render: (v) => <span className="text-sm">{v === 'monthly' ? 'Oylik' : 'To\'liq'}</span>,
    },
    {
      key: 'is_active', title: 'Holat',
      render: (v) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${v ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {v ? 'Faol' : 'Nofaol'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Kurslar"
        subtitle={`Jami: ${pagination.totalCount} ta`}
        actions={<Button onClick={() => navigate('/courses/create')}><HiOutlinePlus className="w-5 h-5 mr-1" />Yangi kurs</Button>}
      />
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Kurs nomi bo'yicha..." /></div>
      <Table columns={columns} data={courses} loading={loading} onRowClick={(row) => navigate(`/courses/${row.id}/edit`)} />
      <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} totalCount={pagination.totalCount} onPageChange={pagination.setPage} />
    </div>
  );
}
