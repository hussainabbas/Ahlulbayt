import { apiGet, apiPost } from '@/core/api/client';
import { logger } from '@/core/logging/logger';

import type { AnalyticsEvent, UserInsights } from './types';

interface IngestPayload {
  events: AnalyticsEvent[];
  platform?: string;
  appVersion?: string;
}

export const analyticsApi = {
  ingest: (payload: IngestPayload) =>
    apiPost<{ accepted: number }, IngestPayload>('/analytics/events', payload).catch((err) => {
      logger.warn('Analytics ingest failed', err);
      throw err;
    }),

  recordPrayer: (prayer: string, completedDate?: string) =>
    apiPost<{ recorded: boolean }, { prayer: string; completedDate?: string }>(
      '/analytics/prayer',
      { prayer, completedDate },
    ).catch((err) => {
      logger.warn('Prayer analytics sync failed', err);
      throw err;
    }),

  recordReading: (body: {
    contentType: string;
    surah?: number;
    ayahFrom?: number;
    ayahTo?: number;
    durationSeconds?: number;
    ayahsRead?: number;
  }) =>
    apiPost<{ id: string }, typeof body>('/analytics/reading', body).catch((err) => {
      logger.warn('Reading analytics sync failed', err);
      throw err;
    }),

  getMyInsights: (days = 30) =>
    apiGet<UserInsights>('/analytics/me', { params: { days } }),
};
