import type { HealthCheck, UserProfile } from './types';
import { apiGet } from './client';

export const queryKeys = {
  health: ['health'] as const,
  user: ['user', 'me'] as const,
  prayer: {
    validate: (date: string) => ['prayer', 'validate', date] as const,
  },
  quran: {
    surahs: ['quran', 'surahs'] as const,
  },
  calendar: {
    events: (year: number) => ['calendar', 'events', year] as const,
  },
} as const;

export const api = {
  health: () => apiGet<HealthCheck>('/health'),
  getMe: () => apiGet<UserProfile>('/auth/me'),
} as const;
