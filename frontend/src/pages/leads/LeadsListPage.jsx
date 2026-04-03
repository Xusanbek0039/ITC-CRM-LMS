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
import leadsApi from '../../api/leads';
import { LEAD_STATUS, LEAD_SOURCES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { buildQueryParams } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';
import usePagination from '../../hooks/usePagination';
import toast from 'react-hot-toast';

export default function LeadsListPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const debouncedSearch = useDebounce(search);
  const pagination = usePagination();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildQueryParams({
        search: debouncedSearch, status: statusFilter, source: sourceFilter,
        page: pagination.page, page_size: pagination.pageSize,
      });
      const res = await leadsApi.getAll(params);
      setLeads(res.data.results || []);
      pagination.updateFromResponse(res.data);
    } catch { toast.error("Leadlarni yuklashda xatolik"); }
    finally { setLoading(false); }
  }, [debouncedSearch, statusFilter, sourceFilter, pagination.page]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { pagination.resetPage(); }, [debouncedSearch, statusFilter, sourceFilter]);

  const columns = [
    { key: 'full_name', title: 'F.I.O', render: (v) => <span className="font-medium">{v}</span> },
    { key: 'phone', title: 'Telefon' },
    {
      key: 'source', title: 'Manba',
      render: (v) => <span className="text-sm">{LEAD_SOURCES[v]?.label || v}</span>,
    },
    { key: 'course_interest', title: 'Kurs', render: (c) => c?.name || '—' },
    { key: 'status', title: 'Holat', render: (s) => <StatusBadge statusMap={LEAD_STATUS} status={s} /> },
    { key: 'assigned_to', title: "Mas'ul", render: (u) => u?.full_name || '—' },
    { key: 'created_at', title: 'Sana', render: (v) => formatDate(v) },
  ];

  const statusOpts = Object.entries(LEAD_STATUS).map(([value, { label }]) => ({ value, label }));
  const sourceOpts = Object.entries(LEAD_SOURCES).map(([value, { label }]) => ({ value, label }));

  return (
    <div>
      <PageHeader
        title="Leadlar"
        subtitle={`Jami: ${pagination.totalCount} ta`}
        actions={<Button onClick={() => navigate('/leads/create')}><HiOutlinePlus className="w-5 h-5 mr-1" />Yangi lead</Button>}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Ism, telefon bo'yicha..." /></div>
        <div className="w-full sm:w-40"><Select options={statusOpts} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} placeholder="Holat" /></div>
        <div className="w-full sm:w-40"><Select options={sourceOpts} value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} placeholder="Manba" /></div>
      </div>
      <Table columns={columns} data={leads} loading={loading} onRowClick={(row) => navigate(`/leads/${row.id}/edit`)} />
      <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} totalCount={pagination.totalCount} onPageChange={pagination.setPage} />
    </div>
  );
}
