import { getTodayEvents, getUpcomingCalendarEvents } from '@/features/calendar/engine/calendarEngine';
import { parseHijriDate } from '@/features/calendar/engine/hijriUtils';
import { isMuharramSeason } from '@/features/muharram/engine/muharramRepository';
import { useDuaBookmarkStore } from '@/features/dua/stores/duaBookmarkStore';
import { useQuranBookmarkStore } from '@/features/quran/stores/quranBookmarkStore';
import { useSahifaBookmarkStore } from '@/features/sahifa/stores/sahifaBookmarkStore';
import { useZiyaratBookmarkStore } from '@/features/ziyarat/stores/ziyaratBookmarkStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTasbihStore } from '@/features/tasbih/stores/tasbihStore';

import { useRecommendationStore } from '../stores/recommendationStore';
import type { RecommendationContext } from '../types';

export function buildRecommendationContext(
  locale: string,
  now: Date = new Date(),
): RecommendationContext {
  const hijri = parseHijriDate(now, locale);
  const interests = useSettingsStore.getState().interests;
  const aiTopics = useSettingsStore.getState().aiTopics;

  const todayEvents = getTodayEvents(hijri.month, hijri.day);
  const upcoming = getUpcomingCalendarEvents(hijri.month, hijri.day, 8);

  const duaBookmarks = useDuaBookmarkStore.getState().bookmarks;
  const ziyaratBookmarks = useZiyaratBookmarkStore.getState().bookmarks;
  const quranBookmarks = useQuranBookmarkStore.getState().bookmarks;
  const sahifaBookmarks = useSahifaBookmarkStore.getState().bookmarks;

  const tasbihRecord = useTasbihStore.getState().getTodayRecord();
  const recStore = useRecommendationStore.getState();

  return {
    locale,
    now,
    hijriMonth: hijri.month,
    hijriDay: hijri.day,
    dayOfWeek: now.getDay(),
    hour: now.getHours(),
    interests: interests as string[],
    aiTopics: aiTopics as string[],
    todayEventIds: todayEvents.map((e) => e.id),
    upcomingEventIds: upcoming.map((e) => e.id),
    muharramSeason: isMuharramSeason(hijri.month, hijri.day),
    bookmarkedDuas: [...new Set(duaBookmarks.map((b) => b.duaId))],
    bookmarkedZiyarat: [...new Set(ziyaratBookmarks.map((b) => b.ziyaratId))],
    bookmarkedQuranRefs: quranBookmarks.map((b) => b.ref),
    bookmarkedSahifa: [...new Set(sahifaBookmarks.map((b) => b.sahifaId))],
    tasbihCyclesToday: tasbihRecord.cycles,
    dismissedIds: recStore.dismissedIds,
    recentlyShownIds: recStore.recentlyShownIds,
  };
}
