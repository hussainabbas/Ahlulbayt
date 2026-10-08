import { getHomeWidgetPlan } from './engine/homeWidgetPlan';
import {
  getTodayContext,
  getTodayEvents,
  getTodayRecommendations,
} from './engine/recommendationBuilder';
import type { IslamicCalendarAiSnapshot } from './types';

export { getTodayContext, getTodayEvents, getTodayRecommendations } from './engine/recommendationBuilder';
export { getHomeWidgetPlan } from './engine/homeWidgetPlan';
export {
  planCalendarAiNotifications,
  scheduleTodayNotifications,
} from './engine/notificationPlanner';
export {
  EVENT_CONTENT_CATALOG,
  getEventContentSeed,
  getAllEventContentSeeds,
} from './data/eventContentCatalog';
export type * from './types';

/** Full snapshot for dashboard, widgets, and AI context consumers. */
export function getIslamicCalendarAiSnapshot(
  now: Date = new Date(),
  locale = 'en',
): IslamicCalendarAiSnapshot {
  const context = getTodayContext(now, locale);
  const todayEvents = getTodayEvents(now, locale);
  const recommendations = getTodayRecommendations(now, locale);
  const homeWidgetPlan = getHomeWidgetPlan(context);

  return {
    context,
    todayEvents,
    recommendations,
    homeWidgetPlan,
  };
}
