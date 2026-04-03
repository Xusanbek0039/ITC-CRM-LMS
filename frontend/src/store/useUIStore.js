import { create } from 'zustand';

const useUIStore = create((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));

export default useUIStore;
