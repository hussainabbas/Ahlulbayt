import { create } from 'zustand';

interface AppState {
  isOnline: boolean;
  isHydrated: boolean;
  setIsOnline: (online: boolean) => void;
  setIsHydrated: (hydrated: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isOnline: true,
  isHydrated: false,
  setIsOnline: (isOnline) => set({ isOnline }),
  setIsHydrated: (isHydrated) => set({ isHydrated }),
}));
