import { Injectable } from '@nestjs/common';

import { CacheService } from '../redis/cache.service';
import { CALENDAR_EVENTS, CalendarEvent } from './data/calendar-events';

@Injectable()
export class CalendarService {
  constructor(private readonly cache: CacheService) {}

  async listEvents(locale = 'en', month?: number, type?: string) {
    const cacheKey = `calendar:events:${month ?? 'all'}:${type ?? 'all'}`;
    const cached = await this.cache.get<CalendarEvent[]>(cacheKey);
    const events = cached ?? CALENDAR_EVENTS;
    if (!cached) await this.cache.set(cacheKey, events, 3600);

    let filtered = events;
    if (month !== undefined) filtered = filtered.filter((e) => e.hijriMonth === month);
    if (type) filtered = filtered.filter((e) => e.type === type);

    return {
      total: filtered.length,
      items: filtered
        .sort((a, b) => b.priority - a.priority)
        .map((e) => this.toSummary(e, locale)),
    };
  }

  async getToday(hijriMonth: number, hijriDay: number, locale = 'en') {
    const today = CALENDAR_EVENTS.filter(
      (e) => e.hijriMonth === hijriMonth && e.hijriDay === hijriDay,
    );
    const upcoming = CALENDAR_EVENTS.filter((e) => {
      if (e.hijriMonth > hijriMonth) return true;
      if (e.hijriMonth === hijriMonth && e.hijriDay > hijriDay) return true;
      return false;
    })
      .sort((a, b) => a.hijriMonth - b.hijriMonth || a.hijriDay - b.hijriDay)
      .slice(0, 5);

    return {
      hijriMonth,
      hijriDay,
      today: today.map((e) => this.toSummary(e, locale)),
      upcoming: upcoming.map((e) => this.toSummary(e, locale)),
      muharramSeason: hijriMonth === 1,
      muharramDay: hijriMonth === 1 ? hijriDay : null,
    };
  }

  private toSummary(event: CalendarEvent, locale: string) {
    const title =
      locale === 'ar'
        ? event.titles.ar
        : locale === 'ur'
          ? event.titles.ur
          : event.titles.en;
    return {
      id: event.id,
      title,
      type: event.type,
      hijriMonth: event.hijriMonth,
      hijriDay: event.hijriDay,
      tags: event.tags,
      priority: event.priority,
    };
  }
}
