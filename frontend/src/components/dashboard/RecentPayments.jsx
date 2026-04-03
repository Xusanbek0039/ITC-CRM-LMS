import { formatMoney, formatDate } from '../../utils/formatters';

export default function RecentPayments({ payments = [] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">So'nggi to'lovlar</h3>
      {payments.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">To'lovlar mavjud emas</p>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{p.student?.user?.full_name || '—'}</p>
                <p className="text-xs text-gray-500">{formatDate(p.payment_date)}</p>
              </div>
              <span className="text-sm font-semibold text-green-600">+{formatMoney(p.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
