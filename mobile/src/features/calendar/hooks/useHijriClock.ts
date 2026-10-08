import { useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

function msUntilNextLocalMidnight(from = new Date()): number {
  const next = new Date(from);
  next.setHours(24, 0, 0, 0);
  return Math.max(next.getTime() - from.getTime(), 1_000);
}

/** Current time, refreshed at local midnight and when the app returns to foreground. */
export function useHijriClock(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const refresh = () => setNow(new Date());

    const onAppState = (state: AppStateStatus) => {
      if (state === 'active') refresh();
    };

    const subscription = AppState.addEventListener('change', onAppState);
    let midnightTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleMidnight = () => {
      midnightTimer = setTimeout(() => {
        refresh();
        scheduleMidnight();
      }, msUntilNextLocalMidnight());
    };

    scheduleMidnight();

    return () => {
      subscription.remove();
      if (midnightTimer) clearTimeout(midnightTimer);
    };
  }, []);

  return now;
}
