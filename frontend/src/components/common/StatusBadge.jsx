import { getStatusColor, getStatusLabel } from '../../utils/helpers';

export default function StatusBadge({ statusMap, status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(statusMap, status)}`}>
      {getStatusLabel(statusMap, status)}
    </span>
  );
}
