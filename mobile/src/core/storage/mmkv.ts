import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

export const storage = createMMKV({ id: 'ahlulbayt-storage' });

export const mmkvStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => {
    storage.set(name, value);
  },
  removeItem: (name) => {
    storage.remove(name);
  },
};

export function getString(key: string): string | undefined {
  return storage.getString(key);
}

export function setString(key: string, value: string): void {
  storage.set(key, value);
}

export function getBoolean(key: string, fallback = false): boolean {
  return storage.getBoolean(key) ?? fallback;
}

export function setBoolean(key: string, value: boolean): void {
  storage.set(key, value);
}

export function remove(key: string): void {
  storage.remove(key);
}

export function clearAll(): void {
  storage.clearAll();
}
