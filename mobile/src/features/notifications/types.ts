export type NotificationCategory =
  | 'prayer'
  | 'events'
  | 'duas'
  | 'quran'
  | 'hadith'
  | 'muharram'
  | 'amaal'
  | 'fasting'
  | 'ai';

export type NotificationPriority = 'high' | 'default';

export interface CategoryPreferences {
  enabled: boolean;
  /** Morning digest hour (0–23). Category-specific defaults apply when unset. */
  digestHour?: number;
  /** Evening reminder hour (0–23). */
  eveningHour?: number;
}

export interface NotificationPreferences {
  masterEnabled: boolean;
  quietHoursEnabled: boolean;
  /** No notifications between quietStart and quietEnd (24h). */
  quietStartHour: number;
  quietEndHour: number;
  categories: Record<NotificationCategory, CategoryPreferences>;
}

export interface ScholarlyReferencePayload {
  source?: string;
  bookName?: string;
  reference?: string;
  ayahNumber?: string;
  hadithNumber?: string;
}

export interface PlannedNotification {
  id: string;
  category: NotificationCategory;
  triggerAt: Date;
  titleKey: string;
  bodyKey: string;
  /** Pre-rendered copy for daily content (verse/hadith preview). */
  directTitle?: string;
  directBody?: string;
  titleParams?: Record<string, string | number>;
  bodyParams?: Record<string, string | number>;
  priority: NotificationPriority;
  data: NotificationPayload;
}

export interface NotificationPayload {
  category: NotificationCategory;
  route?: string;
  routeParams?: Record<string, string>;
  eventId?: string;
  duaId?: string;
  hadithId?: string;
  surah?: string;
  ayah?: string;
  ruleId?: string;
  scholarlyReference?: ScholarlyReferencePayload;
}

export interface NotificationContext {
  now: Date;
  locale: string;
  hijriYear: number;
  hijriMonth: number;
  hijriDay: number;
  dayOfWeek: number;
  isMuharramSeason: boolean;
  muharramDay: number | null;
  daysUntilAshura: number | null;
  isRamadan: boolean;
}

export interface NotificationScheduleResult {
  scheduled: number;
  cancelled: number;
  fingerprint: string;
  byCategory: Partial<Record<NotificationCategory, number>>;
}

export interface NotificationRule {
  id: string;
  category: NotificationCategory;
  /** i18n keys */
  titleKey: string;
  bodyKey: string;
  priority: NotificationPriority;
  payload: NotificationPayload;
  /** Match: day of week 0=Sun … 6=Sat */
  dayOfWeek?: number;
  /** Match: hijri month 1–12 */
  hijriMonth?: number;
  /** Match: hijri day */
  hijriDay?: number;
  /** Days before hijri event to remind (evening) */
  daysBefore?: number;
  /** Hour to fire (local). Defaults from category prefs. */
  hour?: number;
  /** Only during Muharram season */
  muharramOnly?: boolean;
  /** Only during Ramadan (month 9) */
  ramadanOnly?: boolean;
  /** Minimum priority for calendar events */
  minEventPriority?: number;
}
