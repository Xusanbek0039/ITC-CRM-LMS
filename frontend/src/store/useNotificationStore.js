import { create } from 'zustand';
import notificationsApi from '../api/notifications';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await notificationsApi.getAll(params);
      set({
        notifications: response.data.results || response.data,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await notificationsApi.getUnreadCount();
      set({ unreadCount: response.data.count || response.data.unread_count || 0 });
    } catch (error) {
      // ignore
    }
  },

  markAsRead: async (id) => {
    try {
      await notificationsApi.markRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      // ignore
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationsApi.markAllRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      // ignore
    }
  },
}));

export default useNotificationStore;
