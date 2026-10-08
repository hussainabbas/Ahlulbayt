import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import type { SupportedLocale } from '@/core/config/constants';
import { setString } from '@/core/storage/mmkv';
import { StorageKeys } from '@/core/storage/keys';
import { useSettingsStore } from '@/stores/settingsStore';

import { applyRtlLayout, isRtlLocale } from './index';

export function useLocale() {
  const { i18n, t } = useTranslation();
  const locale = useSettingsStore((s) => s.locale);
  const setLocaleStore = useSettingsStore((s) => s.setLocale);

  const setLocale = useCallback(
    async (next: SupportedLocale) => {
      setLocaleStore(next);
      setString(StorageKeys.LOCALE, next);
      await i18n.changeLanguage(next);
      await applyRtlLayout(next);
    },
    [i18n, setLocaleStore],
  );

  return {
    locale,
    setLocale,
    t,
    isRtl: isRtlLocale(locale),
  };
}
