'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { clearAllOfficeBoyPhotos } from './office-boy-photo';
import { api, authApi, attendanceApi, User } from './api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<User>;
  officeBoyLogin: (
    loginId: string,
    password: string,
    latitude: number,
    longitude: number,
  ) => Promise<void>;
  register: (data: {
    emailOrPhone: string;
    password: string;
    firstName: string;
    lastName: string;
    branchId?: string;
    officeLocationId?: string;
    joiningDate?: string;
    leavingDate?: string;
    address?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loadProfile: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (emailOrPhone, password) => {
        set({ isLoading: true });
        try {
          const data = await authApi.login(emailOrPhone, password);
          api.setTokens(data.accessToken, data.refreshToken);
          set({ user: data.user, isAuthenticated: true, isLoading: false });
          return data.user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      officeBoyLogin: async (loginId, password, latitude, longitude) => {
        set({ isLoading: true });
        try {
          const deviceInfo = typeof navigator !== 'undefined' ? navigator.userAgent : undefined;
          const data = await attendanceApi.officeBoyLogin({
            loginId,
            password,
            latitude,
            longitude,
            deviceInfo,
          });
          api.setTokens(data.accessToken, data.refreshToken);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('officeBoySessionStart', String(Date.now()));
            if (data.attendance?.loginTime || data.attendance?.logoutTime) {
              sessionStorage.setItem(
                'officeBoyLastAttendance',
                JSON.stringify(data.attendance),
              );
            } else {
              sessionStorage.removeItem('officeBoyLastAttendance');
            }
          }
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const result = await authApi.register(data);
          api.setTokens(result.accessToken, result.refreshToken);
          set({ user: result.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            await authApi.logout(refreshToken);
          } catch {
            // ignore
          }
        }
        api.clearTokens();
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('officeBoySessionStart');
          clearAllOfficeBoyPhotos();
        }
        set({ user: null, isAuthenticated: false });
      },

      loadProfile: async () => {
        try {
          const user = await authApi.profile();
          set({ user, isAuthenticated: true });
        } catch {
          api.clearTokens();
          set({ user: null, isAuthenticated: false });
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
