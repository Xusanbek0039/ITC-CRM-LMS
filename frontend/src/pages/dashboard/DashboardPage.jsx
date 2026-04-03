import { useState, useEffect } from 'react';
import { HiOutlineUsers, HiOutlineUserGroup, HiOutlineCreditCard, HiOutlineExclamation, HiOutlinePhone } from 'react-icons/hi';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import RecentPayments from '../../components/dashboard/RecentPayments';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import reportsApi from '../../api/reports';
import paymentsApi from '../../api/payments';
import { formatMoney } from '../../utils/formatters';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, paymentsRes] = await Promise.all([
          reportsApi.getDashboard(),
          paymentsApi.getAll({ page_size: 5, ordering: '-payment_date' }),
        ]);
        setStats(statsRes.data.data || statsRes.data);
        setRecentPayments(paymentsRes.data.results || []);
      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner size="lg" className="min-h-[60vh]" />;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="O'quv markaz umumiy ko'rsatkichlari" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatsCard title="Aktiv o'quvchilar" value={stats?.total_active_students || 0} icon={HiOutlineUsers} color="blue" />
        <StatsCard title="Aktiv guruhlar" value={stats?.active_groups || 0} icon={HiOutlineUserGroup} color="green" />
        <StatsCard title="Oylik tushum" value={formatMoney(stats?.monthly_income || 0)} icon={HiOutlineCreditCard} color="purple" />
        <StatsCard title="Qarzdorlar" value={stats?.debtors_count || 0} icon={HiOutlineExclamation} color="red" />
        <StatsCard title="Yangi leadlar" value={stats?.new_leads_this_week || 0} icon={HiOutlinePhone} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <RecentPayments payments={recentPayments} />
        </div>
      </div>
    </div>
  );
}
