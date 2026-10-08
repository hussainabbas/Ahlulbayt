import type { DuaId } from '@/features/dua/types';
import type { ZiyaratId } from '@/features/ziyarat/types';
import type { IslamicReference } from '@/core/references';

export type AiIntent =
  | 'islamic_qa'
  | 'prayer_guidance'
  | 'dua_recommendation'
  | 'ziyarat_recommendation'
  | 'calendar_awareness'
  | 'greeting'
  | 'blocked';

export type AiMessageRole = 'user' | 'assistant' | 'system';

export type AiCitationKind = 'quran' | 'hadith' | 'book' | 'general';

export interface AiCitation {
  id: string;
  title: string;
  source?: string;
  kind?: AiCitationKind;
  reference?: string;
}

export interface AiAction {
  type: 'dua' | 'ziyarat' | 'calendar' | 'prayer' | 'muharram';
  labelKey: string;
  payload?: {
    duaId?: DuaId;
    ziyaratId?: ZiyaratId;
    route?: string;
  };
}

export interface AiMessage {
  id: string;
  role: AiMessageRole;
  content: string;
  intent?: AiIntent;
  citations?: AiCitation[];
  references?: IslamicReference[];
  referenceWarning?: boolean;
  actions?: AiAction[];
  createdAt: string;
  source: 'local' | 'remote';
  isStreaming?: boolean;
}

export interface AssistantContext {
  locale: string;
  marja: string;
  hijriDay: number;
  hijriMonth: number;
  hijriYear: number;
  hijriFormatted: string;
  nextPrayerName: string;
  nextPrayerTime: string;
  prayerCountdown: string;
  cityName: string;
  todayCalendarEvents: string[];
  upcomingCalendarEvents: string[];
  muharramSeason: boolean;
  muharramDay: number | null;
}

export interface AiChatResponse {
  message: AiMessage;
  blocked?: boolean;
  blockReasonKey?: string;
}

export interface AiChatRequest {
  message: string;
  context: AssistantContext;
}

export interface AiResponseDraft {
  intent: AiIntent;
  bodyKey: string;
  bodyParams?: Record<string, string | number>;
  citations?: AiCitation[];
  references?: IslamicReference[];
  referenceWarning?: boolean;
  actions?: AiAction[];
  blocked?: boolean;
  blockReasonKey?: string;
}
