import { NavLink } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineUserGroup,
  HiOutlineClipboardCheck,
  HiOutlineCreditCard,
  HiOutlineCalendar,
  HiOutlinePhone,
  HiOutlineChartBar,
  HiOutlineBell,
  HiOutlineCog,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import useUIStore from '../../store/useUIStore';
import useAuth from '../../hooks/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HiOutlineHome, roles: ['superadmin', 'admin', 'manager'] },
  { name: "O'quvchilar", href: '/students', icon: HiOutlineUsers, roles: ['superadmin', 'admin', 'manager'] },
  { name: "O'qituvchilar", href: '/teachers', icon: HiOutlineAcademicCap, roles: ['superadmin', 'admin'] },
  { name: 'Kurslar', href: '/courses', icon: HiOutlineBookOpen, roles: ['superadmin', 'admin', 'manager'] },
  { name: 'Guruhlar', href: '/groups', icon: HiOutlineUserGroup, roles: ['superadmin', 'admin', 'manager', 'teacher'] },
  { name: 'Davomat', href: '/attendance', icon: HiOutlineClipboardCheck, roles: ['superadmin', 'admin', 'manager', 'teacher'] },
  { name: "To'lovlar", href: '/payments', icon: HiOutlineCreditCard, roles: ['superadmin', 'admin', 'manager'] },
  { name: 'Jadval', href: '/schedule', icon: HiOutlineCalendar, roles: ['superadmin', 'admin', 'manager', 'teacher'] },
  { name: 'Leadlar', href: '/leads', icon: HiOutlinePhone, roles: ['superadmin', 'admin', 'manager'] },
  { name: 'Hisobotlar', href: '/reports', icon: HiOutlineChartBar, roles: ['superadmin', 'admin', 'manager'] },
  { name: 'Bildirishnomalar', href: '/notifications', icon: HiOutlineBell, roles: ['superadmin', 'admin', 'manager', 'teacher', 'student'] },
  { name: 'Sozlamalar', href: '/settings', icon: HiOutlineCog, roles: ['superadmin', 'admin'] },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebarCollapse } = useUIStore();
  const { user, hasPermission } = useAuth();

  const filteredNav = navigation.filter((item) => hasPermission(item.roles));

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 z-30 flex flex-col ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        {!sidebarCollapsed && (
          <h1 className="text-xl font-bold text-blue-400">ITC CRM</h1>
        )}
        <button
          onClick={toggleSidebarCollapse}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {sidebarCollapsed ? (
            <HiOutlineChevronRight className="w-5 h-5" />
          ) : (
            <HiOutlineChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User info at bottom */}
      {!sidebarCollapsed && user && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-medium">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.full_name || `${user.first_name} ${user.last_name}`}</p>
              <p className="text-xs text-gray-400 truncate">{user.role_display || user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
