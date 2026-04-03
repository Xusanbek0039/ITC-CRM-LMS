import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import scheduleApi from '../../api/schedule';
import { WEEKDAYS } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function SchedulePage() {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await scheduleApi.getWeekly();
        const data = res.data.data || res.data.results || res.data;
        if (Array.isArray(data)) {
          const grouped = {};
          data.forEach((item) => {
            const day = item.day_of_week;
            if (!grouped[day]) grouped[day] = [];
            grouped[day].push(item);
          });
          Object.keys(grouped).forEach((day) => {
            grouped[day].sort((a, b) => a.start_time.localeCompare(b.start_time));
          });
          setSchedule(grouped);
        } else {
          setSchedule(data || {});
        }
      } catch { toast.error("Jadvalni yuklashda xatolik"); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSpinner size="lg" className="min-h-[60vh]" />;

  const workDays = WEEKDAYS.filter((d) => d.value !== 'sunday');

  return (
    <div>
      <PageHeader title="Dars jadvali" subtitle="Haftalik jadval" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {workDays.map((day) => (
          <div key={day.value} className="bg-white rounded-xl border border-gray-200">
            <div className="bg-blue-600 text-white text-center py-2 rounded-t-xl">
              <p className="font-semibold text-sm">{day.label}</p>
            </div>
            <div className="p-3 space-y-2 min-h-[200px]">
              {(schedule[day.value] || []).length > 0 ? (
                schedule[day.value].map((item) => (
                  <div key={item.id} className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs font-semibold text-blue-700">{item.start_time?.slice(0, 5)} — {item.end_time?.slice(0, 5)}</p>
                    <p className="text-sm font-medium mt-1">{item.group?.name || '—'}</p>
                    <p className="text-xs text-gray-500">{item.room?.name || ''}</p>
                    <p className="text-xs text-gray-400">{item.teacher_name || ''}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 text-center mt-4">Bo'sh</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
