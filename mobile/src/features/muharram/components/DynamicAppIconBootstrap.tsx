import { useEffect, useMemo, useRef } from 'react';

import { syncAppIconForMuharram } from '@/core/native/dynamicAppIcon';
import { parseHijriDate } from '@/features/calendar/engine/hijriUtils';
import { useHijriClock } from '@/features/calendar/hooks/useHijriClock';
import { resolveMuharramThemeActive } from '@/features/muharram/hooks/useMuharramMode';
import { useMuharramStore } from '@/features/muharram/stores/muharramStore';
import { useSettingsStore } from '@/stores/settingsStore';

/** Switches home-screen icon to mourning red during Muharram (mirrors theme bootstrap). */
export function DynamicAppIconBootstrap() {
  const now = useHijriClock();
  const locale = useSettingsStore((s) => s.locale);
  const mode = useMuharramStore((s) => s.mode);
  const blackTheme = useMuharramStore((s) => s.blackTheme);
  const lastApplied = useRef<boolean | null>(null);

  const hijri = useMemo(() => parseHijriDate(now, locale), [now, locale]);
  const muharramIconActive = resolveMuharramThemeActive(
    mode,
    blackTheme,
    hijri.month,
    hijri.day,
  );

  useEffect(() => {
    if (lastApplied.current === muharramIconActive) return;
    lastApplied.current = muharramIconActive;
    void syncAppIconForMuharram(muharramIconActive);
  }, [muharramIconActive]);

  return null;
}
