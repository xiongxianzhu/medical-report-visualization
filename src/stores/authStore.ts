/**
 * 🔐 认证状态管理 / Authentication State Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  realName?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  jobNumber?: string;
  status: 'active' | 'inactive';
  roles: string[];
  permissions: string[];
  latestLoginAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  
  // Computed
  getDisplayName: () => string;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => set({ token }),
      
      login: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      }),
      
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
      }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
      
      setLoading: (loading) => set({ loading }),

      // 获取显示名称优先级: nickname > realName > username
      getDisplayName: () => {
        const { user } = get();
        if (!user) return '';
        return user.nickname || user.realName || user.username;
      },

      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        // 超级管理员拥有所有权限
        if (user.roles.includes('super_admin')) return true;
        return user.permissions.includes(permission);
      },

      hasRole: (role) => {
        const { user } = get();
        if (!user) return false;
        return user.roles.includes(role);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
