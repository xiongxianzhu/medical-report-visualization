/**
 * 🎨 主题状态管理 / Theme State Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'medical' | 'forest' | 'sunset';

interface ThemeState {
  theme: ThemeType;
  isDark: boolean;
  sidebarCollapsed: boolean;
  
  // Actions
  setTheme: (theme: ThemeType) => void;
  toggleDark: () => void;
  setDark: (isDark: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'medical',
      isDark: false,
      sidebarCollapsed: false,

      setTheme: (theme) => {
        set({ theme });
        // 更新 document 类名
        const root = document.documentElement;
        root.classList.remove('theme-medical', 'theme-forest', 'theme-sunset');
        if (theme !== 'medical') {
          root.classList.add(`theme-${theme}`);
        }
      },

      toggleDark: () => {
        const newIsDark = !get().isDark;
        set({ isDark: newIsDark });
        document.documentElement.classList.toggle('dark', newIsDark);
      },

      setDark: (isDark) => {
        set({ isDark });
        document.documentElement.classList.toggle('dark', isDark);
      },

      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),

      setSidebarCollapsed: (collapsed) => set({ 
        sidebarCollapsed: collapsed 
      }),
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // 恢复主题设置
        if (state) {
          const root = document.documentElement;
          if (state.theme !== 'medical') {
            root.classList.add(`theme-${state.theme}`);
          }
          if (state.isDark) {
            root.classList.add('dark');
          }
        }
      },
    }
  )
);
