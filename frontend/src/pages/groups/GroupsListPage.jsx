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
import groupsApi from '../../api/groups';
import { GROUP_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { buildQueryParams } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';
import usePagination from '../../hooks/usePagination';
import toast from 'react-hot-toast';

export default function GroupsListPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search);
  const pagination = usePagination();

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildQueryParams({ search: debouncedSearch, status: statusFilter, page: pagination.page, page_size: pagination.pageSize });
      const res = await groupsApi.getAll(params);
      setGroups(res.data.results || []);
      pagination.updateFromResponse(res.data);
    } catch { toast.error("Guruhlarni yuklashda xatolik"); }
    finally { setLoading(false); }
  }, [debouncedSearch, statusFilter, pagination.page]);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);
  useEffect(() => { pagination.resetPage(); }, [debouncedSearch, statusFilter]);

  const columns = [
    { key: 'name', title: 'Guruh nomi', render: (v) => <span className="font-medium">{v}</span> },
    { key: 'course', title: 'Kurs', render: (c) => c?.name || '—' },
    { key: 'teacher', title: "O'qituvchi", render: (t) => t?.user?.full_name || t?.full_name || '—' },
    { key: 'students_count', title: "O'quvchilar", render: (v) => <span className="font-medium">{v || 0}</span> },
    { key: 'status', title: 'Holat', render: (s) => <StatusBadge statusMap={GROUP_STATUS} status={s} /> },
    { key: 'start_date', title: 'Boshlanish', render: (v) => formatDate(v) },
  ];

  const statusOpts = Object.entries(GROUP_STATUS).map(([value, { label }]) => ({ value, label }));

  return (
    <div>
      <PageHeader
        title="Guruhlar"
        subtitle={`Jami: ${pagination.totalCount} ta`}
        actions={<Button onClick={() => navigate('/groups/create')}><HiOutlinePlus className="w-5 h-5 mr-1" />Yangi guruh</Button>}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Guruh nomi bo'yicha..." /></div>
        <div className="w-full sm:w-48">
          <Select options={statusOpts} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} placeholder="Barcha holatlar" />
        </div>
      </div>
      <Table columns={columns} data={groups} loading={loading} onRowClick={(row) => navigate(`/groups/${row.id}`)} />
      <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} totalCount={pagination.totalCount} onPageChange={pagination.setPage} />
    </div>
  );
}
