import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus } from 'react-icons/hi';
import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import paymentsApi from '../../api/payments';
import { PAYMENT_TYPES } from '../../utils/constants';
import { formatDate, formatMoney } from '../../utils/formatters';
import { buildQueryParams, getStatusColor, getStatusLabel } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';
import usePagination from '../../hooks/usePagination';
import toast from 'react-hot-toast';

export default function PaymentsListPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [debtors, setDebtors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [activeTab, setActiveTab] = useState('payments');
  const debouncedSearch = useDebounce(search);
  const pagination = usePagination();

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildQueryParams({
        search: debouncedSearch, payment_type: typeFilter,
        page: pagination.page, page_size: pagination.pageSize, ordering: '-payment_date',
      });
      const res = await paymentsApi.getAll(params);
      setPayments(res.data.results || []);
      pagination.updateFromResponse(res.data);
    } catch { toast.error("To'lovlarni yuklashda xatolik"); }
    finally { setLoading(false); }
  }, [debouncedSearch, typeFilter, pagination.page]);

  const fetchDebtors = async () => {
    setLoading(true);
    try {
      const res = await paymentsApi.getDebtors();
      setDebtors(res.data.data || res.data.results || res.data || []);
    } catch { toast.error("Qarzdorlarni yuklashda xatolik"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'payments') fetchPayments();
    else fetchDebtors();
  }, [activeTab, fetchPayments]);

  useEffect(() => { pagination.resetPage(); }, [debouncedSearch, typeFilter]);

  const paymentColumns = [
    { key: 'student', title: "O'quvchi", render: (s) => <span className="font-medium">{s?.user?.full_name || '—'}</span> },
    { key: 'group', title: 'Guruh', render: (g) => g?.name || '—' },
    { key: 'amount', title: 'Summa', render: (v) => <span className="font-medium text-green-600">{formatMoney(v)}</span> },
    { key: 'discount', title: 'Chegirma', render: (v) => v > 0 ? formatMoney(v) : '—' },
    {
      key: 'payment_type', title: "To'lov turi",
      render: (v) => <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(PAYMENT_TYPES, v)}`}>{getStatusLabel(PAYMENT_TYPES, v)}</span>,
    },
    { key: 'payment_date', title: 'Sana', render: (v) => formatDate(v) },
  ];

  const debtorColumns = [
    { key: 'student_name', title: "O'quvchi", render: (v) => <span className="font-medium">{v || '—'}</span> },
    { key: 'group_name', title: 'Guruh' },
    { key: 'total_debt', title: 'Qarz', render: (v) => <span className="font-medium text-red-600">{formatMoney(v)}</span> },
  ];

  const typeOpts = Object.entries(PAYMENT_TYPES).map(([value, { label }]) => ({ value, label }));

  return (
    <div>
      <PageHeader
        title="To'lovlar"
        actions={<Button onClick={() => navigate('/payments/create')}><HiOutlinePlus className="w-5 h-5 mr-1" />To'lov qo'shish</Button>}
      />

      <div className="flex gap-2 mb-4">
        <button onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'payments' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          To'lovlar
        </button>
        <button onClick={() => setActiveTab('debtors')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'debtors' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          Qarzdorlar
        </button>
      </div>

      {activeTab === 'payments' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="O'quvchi bo'yicha..." /></div>
            <div className="w-full sm:w-48">
              <Select options={typeOpts} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} placeholder="Barcha turlar" />
            </div>
          </div>
          <Table columns={paymentColumns} data={payments} loading={loading} />
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} totalCount={pagination.totalCount} onPageChange={pagination.setPage} />
        </>
      )}

      {activeTab === 'debtors' && (
        <Table columns={debtorColumns} data={debtors} loading={loading} emptyMessage="Qarzdorlar mavjud emas" />
      )}
    </div>
  );
}
