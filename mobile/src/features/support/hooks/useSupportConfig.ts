import { useCallback, useEffect, useState } from 'react';

import { useLocale } from '@/i18n/useLocale';

import { DEFAULT_SUPPORT_CONFIG } from '../data/defaultSupportConfig';
import { supportApi } from '../services/supportApi';
import { useSupportDismissStore } from '../stores/supportDismissStore';
import { useSupportReminderStore } from '../stores/supportReminderStore';
import type { SupportConfig } from '../types';

export function useSupportConfig() {
  const { locale } = useLocale();
  const [config, setConfig] = useState<SupportConfig>(DEFAULT_SUPPORT_CONFIG);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await supportApi.getConfig(locale);
      setConfig(data);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { config, loading, refresh };
}

export function useSupportHomeCard(config: SupportConfig) {
  const dismissed = useSupportDismissStore((s) => s.dismissed);
  const canShowReminder = useSupportReminderStore((s) => s.canShowReminder);
  const markReminderShown = useSupportReminderStore((s) => s.markReminderShown);

  const campaignActive = config.campaign !== null;
  const visible =
    config.homeCardEnabled &&
    !dismissed &&
    campaignActive &&
    canShowReminder(config.reminderCooldownDays);

  return { visible, markReminderShown };
}
