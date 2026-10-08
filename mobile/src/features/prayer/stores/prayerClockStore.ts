import { create } from 'zustand';
import { AppState, type AppStateStatus } from 'react-native';

import type { SupportedLocale } from '@/core/config/constants';
import {
  formatCountdown,
  formatPrayerTime,
  getNextPrayer,
  prayerTimesToSchedule,
  type NextPrayerInfo,
  type PrayerConfig,
  type PrayerTimeEntry,
  type PrayerTimes,
} from '@/core/prayer-engine';
import { useLocationStore } from '@/stores/locationStore';
import { usePrayerStore } from '@/stores/prayerStore';

import { PrayerService } from '../services/prayerService';

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const TICK_MS = 1000;

interface PrayerClockState {
  now: Date;
  dateKey: string;
  times: PrayerTimes;
  tomorrowTimes: PrayerTimes;
  week: PrayerTimes[];
  nextPrayer: NextPrayerInfo;
  schedule: PrayerTimeEntry[];
  countdown: string;
  nextPrayerTime: string;
  timezone: string;
  cityName: string | null;
  config: PrayerConfig;
  locale: SupportedLocale;
  gpsReady: boolean;
  formatTime: (date: Date) => string;
}

interface PrayerClockActions {
  recompute: (locale: SupportedLocale) => void;
  tick: (locale: SupportedLocale) => void;
  setGpsReady: (ready: boolean) => void;
}

function computeSnapshot(now: Date, config: PrayerConfig, locale: SupportedLocale) {
  const times = PrayerService.calculateToday(config, now);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowTimes = PrayerService.calculateToday(config, tomorrow);
  const nextPrayer = getNextPrayer(times, now, tomorrowTimes);
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);

  return {
    now,
    dateKey: toDateKey(now),
    times,
    tomorrowTimes,
    week: PrayerService.calculateRange(config, 7, weekStart),
    nextPrayer,
    schedule: prayerTimesToSchedule(times),
    countdown: formatCountdown(nextPrayer.countdownMs),
    nextPrayerTime: formatPrayerTime(nextPrayer.nextTime, locale, times.timezone),
    timezone: times.timezone,
    formatTime: (date: Date) => formatPrayerTime(date, locale, times.timezone),
  };
}

function readConfig(): PrayerConfig {
  return usePrayerStore.getState().getConfig();
}

const initialNow = new Date();
const initialConfig = readConfig();
const initialLocale: SupportedLocale = 'en';

export const usePrayerClockStore = create<PrayerClockState & PrayerClockActions>()((set, get) => ({
  ...computeSnapshot(initialNow, initialConfig, initialLocale),
  cityName: useLocationStore.getState().cityName,
  config: initialConfig,
  locale: initialLocale,
  gpsReady: false,
  recompute: (locale) => {
    const config = readConfig();
    const cityName = useLocationStore.getState().cityName;
    const snapshot = computeSnapshot(get().now, config, locale);
    set({
      ...snapshot,
      config,
      cityName,
      locale,
    });
  },
  tick: (locale) => {
    const now = new Date();
    const state = get();
    if (toDateKey(now) !== state.dateKey) {
      get().recompute(locale);
      return;
    }

    const nextPrayer = getNextPrayer(state.times, now, state.tomorrowTimes);
    set({
      now,
      nextPrayer,
      countdown: formatCountdown(nextPrayer.countdownMs),
      nextPrayerTime: formatPrayerTime(nextPrayer.nextTime, locale, state.times.timezone),
    });
  },
  setGpsReady: (gpsReady) => {
    set({ gpsReady });
    get().recompute(get().locale);
  },
}));

let intervalId: ReturnType<typeof setInterval> | null = null;
let appStateSubscription: ReturnType<typeof AppState.addEventListener> | null = null;
let subscriberCount = 0;
let activeLocale: SupportedLocale = 'en';

function restartInterval() {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    usePrayerClockStore.getState().tick(activeLocale);
  }, TICK_MS);
}

function attachAppStateListener() {
  if (appStateSubscription) return;
  appStateSubscription = AppState.addEventListener('change', (state: AppStateStatus) => {
    if (state !== 'active' || subscriberCount <= 0) return;
    usePrayerClockStore.getState().tick(activeLocale);
    if (!intervalId) restartInterval();
  });
}

function detachAppStateListener() {
  appStateSubscription?.remove();
  appStateSubscription = null;
}

export function startPrayerClock(locale: SupportedLocale): void {
  activeLocale = locale;
  subscriberCount += 1;
  usePrayerClockStore.getState().recompute(locale);

  if (subscriberCount === 1) {
    attachAppStateListener();
    restartInterval();
  } else if (!intervalId) {
    restartInterval();
  }
}

export function stopPrayerClock(): void {
  subscriberCount = Math.max(0, subscriberCount - 1);
  if (subscriberCount > 0) return;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  detachAppStateListener();
}

export function refreshPrayerClock(locale: SupportedLocale): void {
  activeLocale = locale;
  usePrayerClockStore.getState().recompute(locale);
  if (subscriberCount > 0) restartInterval();
}

export function subscribePrayerInputs(onChange: () => void): () => void {
  const unsubPrayer = usePrayerStore.subscribe(onChange);
  const unsubLocation = useLocationStore.subscribe(onChange);
  return () => {
    unsubPrayer();
    unsubLocation();
  };
}
