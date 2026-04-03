import { create } from 'zustand';
import authApi from '../api/auth';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  tokens: JSON.parse(localStorage.getItem('tokens') || 'null'),
  isAuthenticated: !!localStorage.getItem('tokens'),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      const { access, refresh, user } = response.data;
      const tokens = { access, refresh };
      
      localStorage.setItem('tokens', JSON.stringify(tokens));
      localStorage.setItem('user', JSON.stringify(user));
      
      set({
        user,
        tokens,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      const message = error.response?.data?.detail || error.response?.data?.message || 'Kirish xatosi';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      const { tokens } = get();
      if (tokens?.refresh) {
        await authApi.logout(tokens.refresh);
      }
    } catch (e) {
      // ignore logout errors
    } finally {
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
      });
    }
  },

  fetchProfile: async () => {
    try {
      const response = await authApi.getProfile();
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
    } catch (error) {
      // token expired
      if (error.response?.status === 401) {
        get().logout();
      }
    }
  },

  updateProfile: async (data) => {
    const response = await authApi.updateProfile(data);
    const user = response.data;
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
    return user;
  },

  clearError: () => set({ error: null }),

  hasRole: (roles) => {
    const { user } = get();
    if (!user) return false;
    if (typeof roles === 'string') return user.role === roles;
    return roles.includes(user.role);
  },

  hasPermission: (requiredRoles) => {
    const { user } = get();
    if (!user) return false;
    return requiredRoles.includes(user.role);
  },
}));

export default useAuthStore;
