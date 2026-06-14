import type { ZiyaratId, ZiyaratMeta } from '../types';

export const ZIYARAT_RECITERS = [
  { id: 'feiz', nameKey: 'ziyarat.reciters.feiz' },
  { id: 'abbas', nameKey: 'ziyarat.reciters.abbas' },
] as const;

export const ZIYARAT_AUDIO_CDN =
  'https://raw.githubusercontent.com/IslamicNetwork/audio/main/placeholder';

export function getZiyaratAudioDir(reciterId: string): string {
  return `ziyarat-audio/${reciterId}`;
}

export function getZiyaratAudioFileName(id: ZiyaratId): string {
  return `${id}.mp3`;
}

export function getZiyaratStreamUrl(id: ZiyaratId, reciterId: string): string {
  return `${ZIYARAT_AUDIO_CDN}/${reciterId}/${id}.mp3`;
}

export function buildZiyaratTrackId(reciterId: string, id: ZiyaratId): string {
  return `ziyarat:${reciterId}:${id}`;
}

export const ZIYARAT_CATALOG: ZiyaratMeta[] = [
  {
    id: 'ziyarat_ashura',
    slug: 'ashura',
    occasion: 'ashura',
    imam: { en: 'Imam Husayn (AS)', ur: 'امام حسینؑ', ar: 'الإمام الحسين' },
    recommendedTime: {
      en: 'Day of Ashura · Muharram 10',
      ur: 'یوم عاشور · ۱۰ محرم',
      ar: 'يوم عاشوراء · ١٠ محرم',
    },
    titles: { en: 'Ziyarat Ashura', ur: 'زیارت عاشورہ', ar: 'زيارة عاشوراء' },
    subtitles: {
      en: 'The luminous visitation of Imam Husayn (AS) on Ashura',
      ur: 'امام حسینؑ کی روشن زیارت — یوم عاشور',
    },
    description: {
      en: 'The most widely recited ziyarat, honouring the Master of Martyrs on the day of Ashura.',
      ur: 'سب سے زیادہ پڑھی جانے والی زیارت — سید الشہداءؑ کی یاد میں۔',
    },
    source: { en: 'Kamil al-Ziyarat · Mafatih al-Jinan', ur: 'کامل الزيارات · مفاتیح الجنان' },
    sectionCount: 7,
    estimatedMinutes: 15,
    hasAudio: true,
  },
  {
    id: 'ziyarat_waritha',
    slug: 'waritha',
    occasion: 'daily',
    imam: { en: 'Imam Husayn (AS)', ur: 'امام حسینؑ', ar: 'الإمام الحسين' },
    recommendedTime: {
      en: 'Any time · especially at Karbala',
      ur: 'کسی بھی وقت · خاص طور پر کربلا',
      ar: 'في أي وقت · عند كربلاء',
    },
    titles: { en: 'Ziyarat Warith', ur: 'زیارت وارث', ar: 'زيارة وارث' },
    subtitles: {
      en: 'Visitation of the heir of the Prophets at Karbala',
      ur: 'سرور انبیاءؑ کی زیارت — کربلا',
    },
    description: {
      en: 'A profound ziyarat addressing Imam Husayn (AS) as the heir of the Prophets and Messengers.',
      ur: 'امام حسینؑ سے خطاب — وارث الانبیاء کی عظیم زیارت۔',
    },
    source: { en: 'Kamil al-Ziyarat', ur: 'کامل الزيارات' },
    sectionCount: 6,
    estimatedMinutes: 12,
    hasAudio: true,
  },
  {
    id: 'ziyarat_aminullah',
    slug: 'aminullah',
    occasion: 'imam',
    imam: { en: 'All Imams (AS)', ur: 'تمام ائمہؑ', ar: 'الأئمة' },
    recommendedTime: {
      en: 'At holy shrines · any time',
      ur: 'مزاروں پر · کسی بھی وقت',
      ar: 'عند الأضرحة · في أي وقت',
    },
    titles: { en: 'Ziyarat Aminullah', ur: 'زیارت امین اللہ', ar: 'زيارة أمين الله' },
    subtitles: {
      en: 'The trusted visitation — at the graves of the Imams (AS)',
      ur: 'امین اللہ کی زیارت — ائمہؑ کے مزار پر',
    },
    description: {
      en: 'Recited when visiting the holy shrines of the Imams, affirming loyalty to Allah and the Ahlul Bayt.',
      ur: 'ائمہؑ اطہارؑ کے مزار پر پڑھی جانے والی مبارک زیارت۔',
    },
    source: { en: 'Kamil al-Ziyarat · Mafatih al-Jinan', ur: 'کامل الزيارات' },
    sectionCount: 6,
    estimatedMinutes: 10,
    hasAudio: true,
  },
  {
    id: 'ziyarat_arbaeen',
    slug: 'arbaeen',
    occasion: 'arbaeen',
    imam: { en: 'Imam Husayn (AS)', ur: 'امام حسینؑ', ar: 'الإمام الحسين' },
    recommendedTime: {
      en: 'Arbaeen · 20 Safar',
      ur: 'اربعین · ۲۰ صفر',
      ar: 'الأربعين · ٢٠ صفر',
    },
    titles: { en: 'Ziyarat Arbaeen', ur: 'زیارت اربعین', ar: 'زيارة الأربعين' },
    subtitles: {
      en: 'The forty-day visitation of Imam Husayn (AS)',
      ur: 'چalis دن بعد امام حسینؑ کی زیارت',
    },
    description: {
      en: 'Recited on Arbaeen and during the walk to Karbala — a testament of enduring love and loyalty.',
      ur: 'اربعین اور کربلا کے سفر میں پڑھی جانے والی جذباتی زیارت۔',
    },
    source: { en: 'Kamil al-Ziyarat · attributed to Imam al-Baqir (AS)', ur: 'کامل الزيارات' },
    sectionCount: 7,
    estimatedMinutes: 18,
    hasAudio: true,
  },
  {
    id: 'ziyarat_jamia_kabira',
    slug: 'jamia-kabira',
    occasion: 'general',
    imam: { en: 'All Fourteen Infallibles (AS)', ur: 'چودہ معصومینؑ', ar: 'الأئمة الأربعة عشر' },
    recommendedTime: {
      en: 'Friday · any sacred occasion',
      ur: 'جمعہ · کسی بھی مبارک موقع پر',
      ar: 'يوم الجمعة · في المناسبات',
    },
    titles: {
      en: 'Ziyarat Jamia Kabira',
      ur: 'زیارت جامعہ کبیرہ',
      ar: 'الزيارة الجامعة الكبيرة',
    },
    subtitles: {
      en: 'The great comprehensive visitation of all Imams (AS)',
      ur: 'تمام ائمہؑ کی جامع و جامعہ زیارت',
    },
    description: {
      en: 'A comprehensive ziyarat addressing all fourteen Infallibles — from the Prophet (SA) to Imam al-Mahdi (AJ).',
      ur: 'چودہ معصومینؑ — نبیؐ سے امام مہدیؑ عجل اللہ فرجہم تک — کی مکمل زیارت۔',
    },
    source: { en: 'Attributed to Imam Hasan al-Askari (AS)', ur: 'امام حسن عسکریؑ' },
    sectionCount: 8,
    estimatedMinutes: 25,
    hasAudio: true,
  },
  {
    id: 'ziyarat_ale_yasin',
    slug: 'ale-yasin',
    occasion: 'daily',
    imam: { en: 'Imam Husayn (AS)', ur: 'امام حسینؑ', ar: 'الإمام الحسين' },
    recommendedTime: {
      en: 'Any time · after Surah Yasin',
      ur: 'کسی بھی وقت · سورہ یاسین کے بعد',
      ar: 'في أي وقت · بعد يس',
    },
    titles: { en: 'Ziyarat Ale Yasin', ur: 'زیارت آل یاسین', ar: 'زيارة آل ياسين' },
    subtitles: {
      en: 'Visitation of the family of Yasin — Imam Husayn (AS)',
      ur: 'آل یاسین — امام حسینؑ کی زیارت',
    },
    description: {
      en: 'A concise yet powerful ziyarat of Imam Husayn (AS), often recited after Surah Yasin.',
      ur: 'امام حسینؑ کی مختصر مگر پرتاثیر زیارت — عموماً سورہ یاسین کے بعد۔',
    },
    source: { en: 'Mafatih al-Jinan · Bihar al-Anwar', ur: 'مفاتیح الجنان' },
    sectionCount: 5,
    estimatedMinutes: 8,
    hasAudio: true,
  },
];

export function getZiyaratMeta(id: ZiyaratId): ZiyaratMeta | undefined {
  return ZIYARAT_CATALOG.find((z) => z.id === id);
}

export const OCCASION_LABELS: Record<
  ZiyaratMeta['occasion'],
  { en: string; ur: string; ar: string }
> = {
  ashura: { en: 'Ashura', ur: 'عاشور', ar: 'عاشوراء' },
  arbaeen: { en: 'Arbaeen', ur: 'اربعین', ar: 'الأربعين' },
  daily: { en: 'Daily', ur: 'روزانہ', ar: 'يومي' },
  imam: { en: 'At Shrines', ur: 'مزار', ar: 'عند الأضرحة' },
  general: { en: 'Comprehensive', ur: 'جامع', ar: 'جامعة' },
};
