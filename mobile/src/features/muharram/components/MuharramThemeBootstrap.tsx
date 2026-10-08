import { useEffect, useMemo, useRef } from 'react';

import { parseHijriDate } from '@/features/calendar/engine/hijriUtils';
import { useHijriClock } from '@/features/calendar/hooks/useHijriClock';
import { useSettingsStore } from '@/stores/settingsStore';

import { isMuharramMonth } from '../engine/muharramRepository';
import { useMuharramStore } from '../stores/muharramStore';

/** Enables mourning theme when Hijri Muharram begins (mode = auto). */
export function MuharramThemeBootstrap() {
  const now = useHijriClock();
  const locale = useSettingsStore((s) => s.locale);
  const mode = useMuharramStore((s) => s.mode);
  const setBlackTheme = useMuharramStore((s) => s.setBlackTheme);

  const hijri = useMemo(() => parseHijriDate(now, locale), [now, locale]);
  const muharramStarted = isMuharramMonth(hijri.month);
  const wasMuharramStarted = useRef(muharramStarted);

  useEffect(() => {
    const enteredMuharram = muharramStarted && !wasMuharramStarted.current;
    wasMuharramStarted.current = muharramStarted;

    if (mode !== 'auto') return;

    if (enteredMuharram || (muharramStarted && hijri.day === 1)) {
      setBlackTheme(true);
    }
  }, [muharramStarted, mode, hijri.day, setBlackTheme]);

  return null;
}
