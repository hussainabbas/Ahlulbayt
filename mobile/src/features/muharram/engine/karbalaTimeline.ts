import {
  getKarbalaEvents,
  getKarbalaEventsForDay,
} from './muharramRepository';
import type { KarbalaEvent } from '../types';

export interface KarbalaTimelineGroup {
  muharramDay: number;
  hijriLabel: string;
  events: KarbalaEvent[];
}

/** Full battle timeline sorted by day then order. */
export function getKarbalaTimeline(): KarbalaEvent[] {
  return getKarbalaEvents().slice().sort((a, b) => {
    if (a.muharramDay !== b.muharramDay) return a.muharramDay - b.muharramDay;
    return a.order - b.order;
  });
}

/** Events grouped by Muharram day for timeline UI. */
export function getKarbalaTimelineGroups(): KarbalaTimelineGroup[] {
  const timeline = getKarbalaTimeline();
  const groups: KarbalaTimelineGroup[] = [];

  for (const event of timeline) {
    const last = groups[groups.length - 1];
    if (last && last.muharramDay === event.muharramDay) {
      last.events.push(event);
    } else {
      groups.push({
        muharramDay: event.muharramDay,
        hijriLabel: event.hijriLabel.replace(/ \d+ Muharram/, ` ${event.muharramDay} Muharram`),
        events: [event],
      });
    }
  }

  return groups;
}

export function getAshuraEvents(): KarbalaEvent[] {
  return getKarbalaEventsForDay(10).sort((a, b) => a.order - b.order);
}

export function formatCitation(citation: KarbalaEvent['citations'][number]): string {
  const parts = [citation.book];
  if (citation.volume != null) parts.push(`Vol. ${citation.volume}`);
  if (citation.chapter) parts.push(citation.chapter);
  if (citation.page != null) parts.push(`p. ${citation.page}`);
  if (citation.hadithNumber) parts.push(`#${citation.hadithNumber}`);
  if (citation.scholar) parts.push(`(${citation.scholar})`);
  if (citation.unverified) parts.push('[unverified]');
  return parts.join(' · ');
}
