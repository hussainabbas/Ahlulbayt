export interface QuickPrompt {
  id: string;
  labelKey: string;
  messageKey: string;
  intent: string;
}

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'prayer_next',
    labelKey: 'ai.prompts.prayerNext',
    messageKey: 'ai.prompts.prayerNextMessage',
    intent: 'prayer_guidance',
  },
  {
    id: 'dua_tonight',
    labelKey: 'ai.prompts.duaTonight',
    messageKey: 'ai.prompts.duaTonightMessage',
    intent: 'dua_recommendation',
  },
  {
    id: 'ziyarat_muharram',
    labelKey: 'ai.prompts.ziyaratMuharram',
    messageKey: 'ai.prompts.ziyaratMuharramMessage',
    intent: 'ziyarat_recommendation',
  },
  {
    id: 'calendar_today',
    labelKey: 'ai.prompts.calendarToday',
    messageKey: 'ai.prompts.calendarTodayMessage',
    intent: 'calendar_awareness',
  },
  {
    id: 'who_husayn',
    labelKey: 'ai.prompts.whoHusayn',
    messageKey: 'ai.prompts.whoHusaynMessage',
    intent: 'islamic_qa',
  },
];
