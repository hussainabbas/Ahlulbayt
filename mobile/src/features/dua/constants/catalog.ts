import type { DuaId, DuaMeta } from '../types';

export const DUA_RECITERS = [
  { id: 'feiz', nameKey: 'dua.reciters.feiz' },
  { id: 'abbas', nameKey: 'dua.reciters.abbas' },
] as const;

/** CDN base for dua recitation MP3s (bundled offline via download). */
export const DUA_AUDIO_CDN =
  'https://raw.githubusercontent.com/IslamicNetwork/audio/main/placeholder';

export function getDuaAudioDir(reciterId: string): string {
  return `dua-audio/${reciterId}`;
}

export function getDuaAudioFileName(duaId: DuaId): string {
  return `${duaId}.mp3`;
}

export function getDuaStreamUrl(duaId: DuaId, reciterId: string): string {
  return `${DUA_AUDIO_CDN}/${reciterId}/${duaId}.mp3`;
}

export function buildDuaTrackId(reciterId: string, duaId: DuaId): string {
  return `dua:${reciterId}:${duaId}`;
}

export const DUA_CATALOG: DuaMeta[] = [
  {
    id: 'dua_kumail',
    slug: 'kumail',
    category: 'weekly',
    recommendedTime: {
      en: 'Thursday eve / night',
      ur: 'جمعرات کی شام / رات',
      ar: 'ليلة الخميس',
    },
    titles: {
      en: 'Dua Kumayl',
      ur: 'دعائے کمیل',
      ar: 'دعاء كميل',
    },
    subtitles: {
      en: 'Taught by Imam Ali (AS) to Kumayl ibn Ziyad',
      ur: 'امام علیؑ نے حضرت کمیلؑ کو سکھائی',
    },
    description: {
      en: 'A comprehensive supplication of praise, repentance, and seeking forgiveness.',
      ur: 'حمد، استغفار، اور مغفرت کی جامع دعا۔',
    },
    source: {
      en: 'Mafatih al-Jinan · Kamil al-Ziyarat',
      ur: 'مفاتیح الجنان',
    },
    sectionCount: 8,
    estimatedMinutes: 25,
    hasAudio: true,
  },
  {
    id: 'dua_tawassul',
    slug: 'tawassul',
    category: 'weekly',
    recommendedTime: {
      en: 'Tuesday',
      ur: 'منگل',
      ar: 'يوم الثلاثاء',
    },
    titles: {
      en: 'Dua Tawassul',
      ur: 'دعائے توسل',
      ar: 'دعاء التوسل',
    },
    subtitles: {
      en: 'Seeking intercession through the Ahlul Bayt (AS)',
      ur: 'اہل بیتؑ کے وسیلے سے دعا',
    },
    description: {
      en: 'Supplication seeking nearness to Allah through the Holy Prophet and Imams (AS).',
      ur: 'نبیؐ اور ائمہؑ کے وسیلے سے اللہ کے قرب کی دعا۔',
    },
    source: {
      en: 'Mafatih al-Jinan',
      ur: 'مفاتیح الجنان',
    },
    sectionCount: 6,
    estimatedMinutes: 15,
    hasAudio: true,
  },
  {
    id: 'dua_ahad',
    slug: 'ahad',
    category: 'daily',
    recommendedTime: {
      en: 'After Fajr until sunrise',
      ur: 'فجر کے بعد طلوع آفتاب تک',
      ar: 'بعد الفجر حتى الشروق',
    },
    titles: {
      en: 'Dua Ahad',
      ur: 'دعائے عہد',
      ar: 'دعاء العهد',
    },
    subtitles: {
      en: 'The covenant with Imam al-Mahdi (AJ)',
      ur: 'امام مہدیؑ عجل اللہ تعالیٰ فرجہم سے عہد',
    },
    description: {
      en: 'A pledge of allegiance and daily renewal of commitment to the Awaited Imam (AJ).',
      ur: 'امام منتظرؑ سے وفاداری کا عہد۔',
    },
    source: {
      en: 'Mafatih al-Jinan · Kamil al-Ziyarat',
      ur: 'مفاتیح الجنان',
    },
    sectionCount: 5,
    estimatedMinutes: 12,
    hasAudio: true,
  },
  {
    id: 'dua_nudba',
    slug: 'nudba',
    category: 'weekly',
    recommendedTime: {
      en: 'Friday morning',
      ur: 'جمعہ کی صبح',
      ar: 'صباح يوم الجمعة',
    },
    titles: {
      en: 'Dua Nudba',
      ur: 'دعائے ندبہ',
      ar: 'دعاء الندبة',
    },
    subtitles: {
      en: 'Lamentation for the Awaited Imam (AJ)',
      ur: 'امام غائبؑ کے لیے فریاد',
    },
    description: {
      en: 'A moving supplication expressing grief over the occultation and longing for relief.',
      ur: 'غیبت اور فرج کی طلب کی جذباتی دعا۔',
    },
    source: {
      en: 'Mafatih al-Jinan',
      ur: 'مفاتیح الجنان',
    },
    sectionCount: 7,
    estimatedMinutes: 20,
    hasAudio: true,
  },
  {
    id: 'dua_sabah',
    slug: 'sabah',
    category: 'daily',
    recommendedTime: {
      en: 'Morning',
      ur: 'صبح',
      ar: 'الصباح',
    },
    titles: {
      en: 'Dua al-Sabah',
      ur: 'دعائے صبح',
      ar: 'دعاء الصباح',
    },
    subtitles: {
      en: 'Morning supplication of Imam Ali (AS)',
      ur: 'امام علیؑ کی صبح کی دعا',
    },
    description: {
      en: 'A luminous morning prayer of praise, seeking blessings for the day ahead.',
      ur: 'صبح کی روشن دعا — دن کی برکت طلب کرنے کے لیے۔',
    },
    source: {
      en: 'Sahifa al-Alawiyya · Mafatih al-Jinan',
      ur: 'صحیفہ علویہ · مفاتیح الجنان',
    },
    sectionCount: 6,
    estimatedMinutes: 18,
    hasAudio: true,
  },
  {
    id: 'dua_mashlool',
    slug: 'mashlool',
    category: 'occasion',
    recommendedTime: {
      en: 'Any time · especially in hardship',
      ur: 'کسی بھی وقت · خاص طور پر مشکل میں',
      ar: 'في أي وقت · عند الشدة',
    },
    titles: {
      en: 'Dua Mashlool',
      ur: 'دعائے مشلول',
      ar: 'دعاء المشلول',
    },
    subtitles: {
      en: 'The supplication of the paralyzed one — Imam Ali (AS)',
      ur: 'دعائے مشلول — امام علیؑ',
    },
    description: {
      en: 'A powerful dua attributed to Imam Ali (AS) for healing and relief from affliction.',
      ur: 'امام علیؑ کی دعا — شفا اور مشکلات سے نجات کے لیے۔',
    },
    source: {
      en: 'Mafatih al-Jinan · Bihar al-Anwar',
      ur: 'مفاتیح الجنان · بحار الانوار',
    },
    sectionCount: 5,
    estimatedMinutes: 10,
    hasAudio: true,
  },
];

export function getDuaMeta(id: DuaId): DuaMeta | undefined {
  return DUA_CATALOG.find((d) => d.id === id);
}
