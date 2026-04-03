import { HiOutlineInbox } from 'react-icons/hi';

export default function EmptyState({ title = "Ma'lumot topilmadi", description, icon: Icon = HiOutlineInbox, action }) {
  return (
    <div className="text-center py-12">
      <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      {action && action}
    </div>
  );
}
