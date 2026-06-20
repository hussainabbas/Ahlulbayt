import { apiGet } from '@/core/api/client';
import { logger } from '@/core/logging/logger';
import { networkManager } from '@/core/offline/network';

import { DEFAULT_SUPPORT_CONFIG } from '../data/defaultSupportConfig';
import type { SupportConfig } from '../types';

let cachedConfig: SupportConfig | null = null;
let cachedAt = 0;
const LOCAL_CACHE_MS = 5 * 60 * 1000;

export const supportApi = {
  async getConfig(locale = 'en'): Promise<SupportConfig> {
    if (cachedConfig && Date.now() - cachedAt < LOCAL_CACHE_MS) {
      return cachedConfig;
    }

    if (!networkManager.getIsConnected()) {
      return DEFAULT_SUPPORT_CONFIG;
    }

    try {
      const data = await apiGet<SupportConfig>('/support/config', { params: { locale } });
      cachedConfig = { ...DEFAULT_SUPPORT_CONFIG, ...data };
      cachedAt = Date.now();
      return cachedConfig;
    } catch (error) {
      logger.warn('supportApi.getConfig failed, using bundled fallback', { error });
      return DEFAULT_SUPPORT_CONFIG;
    }
  },

  clearCache(): void {
    cachedConfig = null;
    cachedAt = 0;
  },
};
