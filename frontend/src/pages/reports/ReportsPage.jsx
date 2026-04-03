import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import reportsApi from '../../api/reports';
import { formatMoney } from '../../utils/formatters';
import { STUDENT_STATUS, LEAD_STATUS } from '../../utils/constants';
import toast from 'react-hot-toast';

const tabs = [
  { key: 'financial', label: 'Moliyaviy' },
  { key: 'students', label: "O'quvchilar" },
  { key: 'attendance', label: 'Davomat' },
  { key: 'leads', label: 'Leadlar' },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('financial');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        let res;
        switch (activeTab) {
          case 'financial': res = await reportsApi.getFinancial(); break;
          case 'students': res = await reportsApi.getStudentStats(); break;
          case 'attendance': res = await reportsApi.getAttendance(); break;
          case 'leads': res = await reportsApi.getLeads(); break;
        }
        setData(res.data.data || res.data);
      } catch { toast.error("Hisobotni yuklashda xatolik"); }
      finally { setLoading(false); }
    };
    fetch();
  }, [activeTab]);

  return (
    <div>
      <PageHeader title="Hisobotlar" />

      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner size="lg" className="min-h-[40vh]" /> : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {activeTab === 'financial' && data && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Moliyaviy hisobot</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-xl"><p className="text-sm text-gray-500">Umumiy tushum</p><p className="text-2xl font-bold text-green-700">{formatMoney(data.total_income)}</p></div>
                <div className="p-4 bg-red-50 rounded-xl"><p className="text-sm text-gray-500">Chegirmalar</p><p className="text-2xl font-bold text-red-700">{formatMoney(data.total_discount)}</p></div>
                <div className="p-4 bg-blue-50 rounded-xl"><p className="text-sm text-gray-500">Sof tushum</p><p className="text-2xl font-bold text-blue-700">{formatMoney(data.net_income)}</p></div>
              </div>
              <p className="text-sm text-gray-500">To'lovlar soni: <span className="font-medium">{data.payment_count}</span></p>
            </div>
          )}

          {activeTab === 'students' && data && (
            <div>
              <h3 className="text-lg font-semibold mb-4">O'quvchilar statistikasi</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl text-center"><p className="text-sm text-gray-500">Jami</p><p className="text-2xl font-bold">{data.total}</p></div>
                {['active', 'frozen', 'graduated', 'left'].map((s) => (
                  <div key={s} className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-sm text-gray-500">{STUDENT_STATUS[s]?.label}</p>
                    <p className="text-2xl font-bold">{data[s]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attendance' && data && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Davomat hisoboti</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl text-center"><p className="text-sm text-gray-500">Jami yozuvlar</p><p className="text-2xl font-bold">{data.total_records}</p></div>
                <div className="p-4 bg-green-50 rounded-xl text-center"><p className="text-sm text-gray-500">Keldi</p><p className="text-2xl font-bold text-green-700">{data.present}</p></div>
                <div className="p-4 bg-red-50 rounded-xl text-center"><p className="text-sm text-gray-500">Kelmadi</p><p className="text-2xl font-bold text-red-700">{data.absent}</p></div>
                <div className="p-4 bg-yellow-50 rounded-xl text-center"><p className="text-sm text-gray-500">Kechikdi</p><p className="text-2xl font-bold text-yellow-700">{data.late}</p></div>
                <div className="p-4 bg-purple-50 rounded-xl text-center"><p className="text-sm text-gray-500">Foizi</p><p className="text-2xl font-bold text-purple-700">{data.attendance_rate}%</p></div>
              </div>
            </div>
          )}

          {activeTab === 'leads' && data && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Lead analitika</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-xl text-center"><p className="text-sm text-gray-500">Jami leadlar</p><p className="text-2xl font-bold">{data.total_leads}</p></div>
                <div className="p-4 bg-green-50 rounded-xl text-center"><p className="text-sm text-gray-500">Konversiya</p><p className="text-2xl font-bold text-green-700">{data.conversion_rate}%</p></div>
              </div>
              {data.by_status?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Holat bo'yicha</h4>
                  <div className="space-y-1">
                    {data.by_status.map((item) => (
                      <div key={item.status} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                        <span>{LEAD_STATUS[item.status]?.label || item.status}</span>
                        <span className="font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
