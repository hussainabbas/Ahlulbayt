import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getString, remove, setString } from '@/core/storage/mmkv';
import { StorageKeys } from '@/core/storage/keys';
import { mmkvStorage } from '@/core/storage/mmkv';
import type { AuthResponse, AuthUser } from '@/features/auth/types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  setAuth: (response: AuthResponse) => void;
  setLocalGuestAuth: (user: AuthUser) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: getString(StorageKeys.ACCESS_TOKEN) ?? null,
      refreshToken: getString(StorageKeys.REFRESH_TOKEN) ?? null,
      user: null,
      isAuthenticated:
        Boolean(getString(StorageKeys.ACCESS_TOKEN)) ||
        Boolean(getString(StorageKeys.LOCAL_GUEST_ID)),
      isGuest: false,
      setAuth: (response) => {
        setString(StorageKeys.ACCESS_TOKEN, response.tokens.accessToken);
        setString(StorageKeys.REFRESH_TOKEN, response.tokens.refreshToken);
        set({
          accessToken: response.tokens.accessToken,
          refreshToken: response.tokens.refreshToken,
          user: response.user,
          isAuthenticated: true,
          isGuest: response.user.isGuest,
        });
      },
      setLocalGuestAuth: (user) => {
        remove(StorageKeys.ACCESS_TOKEN);
        remove(StorageKeys.REFRESH_TOKEN);
        set({
          accessToken: null,
          refreshToken: null,
          user,
          isAuthenticated: true,
          isGuest: true,
        });
      },
      setTokens: (accessToken, refreshToken) => {
        setString(StorageKeys.ACCESS_TOKEN, accessToken);
        if (refreshToken) {
          setString(StorageKeys.REFRESH_TOKEN, refreshToken);
        }
        set({ accessToken, refreshToken: refreshToken ?? get().refreshToken, isAuthenticated: true });
      },
      setUser: (user) => set({ user, isGuest: user.isGuest }),
      clearAuth: () => {
        remove(StorageKeys.ACCESS_TOKEN);
        remove(StorageKeys.REFRESH_TOKEN);
        remove(StorageKeys.LOCAL_GUEST_ID);
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          isGuest: false,
        });
      },
      getAccessToken: () => get().accessToken,
      getRefreshToken: () => get().refreshToken ?? getString(StorageKeys.REFRESH_TOKEN) ?? null,
    }),
    {
      name: 'ahlulbayt-auth',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
      }),
    },
  ),
);
