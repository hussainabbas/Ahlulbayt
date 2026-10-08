import { RAMADAN_SOURCES } from './citations';
import type { RamadanDayEntry } from '../types';

const { quran, quranRamadan, quranQadr, bihar, mafatih, sahifa, wasail, manLa, kamil, nahjul } =
  RAMADAN_SOURCES;

function day(
  dayNum: number,
  theme: string,
  dua: RamadanDayEntry['dua'],
  hadith: RamadanDayEntry['hadith'],
  amaal: RamadanDayEntry['amaal'],
): RamadanDayEntry {
  return {
    day: dayNum,
    theme: { en: theme },
    dua,
    hadith,
    amaal,
  };
}

const welcomeDua: RamadanDayEntry['dua'] = {
  title: { en: 'Dua al-Mubahila — seeking nearness in Ramadan' },
  translation: {
    en: 'O Allah, send blessings upon Muhammad and the family of Muhammad — the purified household through whom You removed impurity.',
  },
  duaId: 'dua_tawassul',
  citations: [mafatih, kamil],
};

const welcomeHadith: RamadanDayEntry['hadith'] = {
  text: {
    en: 'When the month of Ramadan arrives, the gates of Paradise are opened, the gates of Hell are closed, and the devils are chained.',
  },
  narrator: { en: 'The Holy Prophet (s)' },
  citations: [bihar, { ...manLa, hadithNumber: '1832', unverified: true }],
};

const welcomeAmaal: RamadanDayEntry['amaal'] = [
  {
    title: { en: 'Renew your intention for fasting' },
    body: {
      en: 'Set a sincere niyyah each night for the next day’s fast. Scholars recommend pairing intention with a short istighfar before suhoor ends.',
    },
    citations: [quranRamadan, wasail],
  },
  {
    title: { en: 'Plan your Quran schedule' },
    body: {
      en: 'Divide the Quran across the month — one juz per day is a classical goal. Adjust to your capacity and consistency.',
    },
    citations: [quran, mafatih],
  },
];

export const RAMADAN_DAILY: RamadanDayEntry[] = [
  day(1, 'Welcome to Ramadan', welcomeDua, welcomeHadith, welcomeAmaal),
  day(
    2,
    'Mercy unfolds',
    {
      title: { en: 'Morning supplication (Dua al-Sabah)' },
      translation: { en: 'Begin the day seeking forgiveness and light for your fast.' },
      duaId: 'dua_sabah',
      citations: [mafatih, sahifa],
    },
    {
      text: { en: 'Fasting is a shield — let the one who is fasting not utter obscenity or ignorance.' },
      narrator: { en: 'The Holy Prophet (s)' },
      citations: [bihar, { ...wasail, hadithNumber: '11316' }],
    },
    [
      {
        title: { en: 'Give charity quietly' },
        body: { en: 'Even a small sadaqah each day multiplies in Ramadan. Prefer discreet giving when possible.' },
        citations: [quranRamadan, bihar],
      },
    ],
  ),
  day(
    3,
    'Seeking forgiveness',
    {
      title: { en: 'Dua Kumayl (Thursday eve tradition)' },
      translation: { en: 'Comprehensive supplication of praise, repentance, and seeking forgiveness.' },
      duaId: 'dua_kumail',
      citations: [mafatih, kamil],
    },
    {
      text: { en: 'Whoever fasts Ramadan with faith and seeking reward, his past sins are forgiven.' },
      narrator: { en: 'The Holy Prophet (s)' },
      citations: [bihar, { ...manLa, hadithNumber: '1833' }],
    },
    [
      {
        title: { en: 'Night istighfar' },
        body: { en: 'Recite Astaghfirullah before sleep and after each prayer during Ramadan.' },
        citations: [wasail, mafatih],
      },
    ],
  ),
  day(
    4,
    'Quran recitation',
    {
      title: { en: 'Sahifa — Morning and Evening' },
      translation: { en: 'Daily supplication from Imam al-Sajjad (as) for morning and evening.' },
      sahifaId: 'sahifa_003',
      citations: [sahifa, mafatih],
    },
    {
      text: { en: 'The Quran intercedes for those who recite it on the Day of Resurrection.' },
      narrator: { en: 'The Holy Prophet (s)' },
      citations: [bihar, { ...wasail, unverified: true }],
    },
    [
      {
        title: { en: 'Complete one juz today' },
        body: { en: 'Recite with tajweed and reflection. Pause at verses of mercy and guidance.' },
        citations: [quran, mafatih],
      },
    ],
  ),
  day(
    5,
    'Patience and gratitude',
    {
      title: { en: 'Dua Ahad — loyalty to the Mahdi (aj)' },
      translation: { en: 'Friday tradition: renew allegiance to Imam al-Mahdi (aj).' },
      duaId: 'dua_ahad',
      citations: [mafatih, kamil],
    },
    {
      text: { en: 'Patience is half of faith.' },
      narrator: { en: 'Imam Ali (as)' },
      citations: [nahjul, bihar],
    },
    [
      {
        title: { en: 'Avoid quarrels while fasting' },
        body: { en: 'If provoked, say “I am fasting” and turn away — preserving the spirit of the fast.' },
        citations: [wasail, quranRamadan],
      },
    ],
  ),
  day(
    6,
    'Feeding the fasting',
    {
      title: { en: 'Dua for breaking the fast' },
      translation: { en: 'O Allah, for You I fasted and with Your provision I break my fast.' },
      sahifaId: 'sahifa_050',
      citations: [sahifa, mafatih],
    },
    {
      text: { en: 'Whoever feeds a fasting person earns the reward of his fast without diminishing the faster’s reward.' },
      narrator: { en: 'The Holy Prophet (s)' },
      citations: [bihar, wasail],
    },
    [
      {
        title: { en: 'Invite or sponsor iftar' },
        body: { en: 'Arrange iftar for family, neighbors, or the needy — even dates and water count.' },
        citations: [wasail, mafatih],
      },
    ],
  ),
  day(
    7,
    'Night prayer',
    {
      title: { en: 'Dua Mashlool (Wednesday)' },
      translation: { en: 'Supplication of the paralyzed one — seeking healing and forgiveness.' },
      duaId: 'dua_mashlool',
      citations: [mafatih],
    },
    {
      text: { en: 'The best prayer after the obligatory is the night prayer.' },
      narrator: { en: 'The Holy Prophet (s)' },
      citations: [bihar, manLa],
    },
    [
      {
        title: { en: 'Pray two rak‘at after Maghrib' },
        body: { en: 'Short nightly nafilah builds the habit for Qiyam al-Layl in the last ten nights.' },
        citations: [wasail, mafatih],
      },
    ],
  ),
  day(
    8,
    'Du‘a al-Nudba',
    {
      title: { en: 'Dua Nudba (Friday morning)' },
      translation: { en: 'Lamentation and longing for the Imam of the Age (aj).' },
      duaId: 'dua_nudba',
      citations: [mafatih, kamil],
    },
    {
      text: { en: 'Ramadan is the month in which the Quran was revealed as guidance for mankind.' },
      citations: [quranRamadan],
    },
    [
      {
        title: { en: 'Reflect on one surah' },
        body: { en: 'Read tafsir notes for a surah you recited today — even a few verses deeply.' },
        citations: [quran, mafatih],
      },
    ],
  ),
  day(
    9,
    'Preparing for the last ten',
    {
      title: { en: 'Seeking Laylat al-Qadr' },
      translation: { en: 'O Allah, bless Muhammad and his Household and grant me the Night of Qadr.' },
      sahifaId: 'sahifa_051',
      citations: [sahifa, mafatih],
    },
    {
      text: { en: 'Search for Laylat al-Qadr in the odd nights of the last ten days of Ramadan.' },
      narrator: { en: 'The Holy Prophet (s)' },
      citations: [bihar, manLa],
    },
    [
      {
        title: { en: 'Clear your schedule for the last ten' },
        body: { en: 'Reduce distractions; plan i‘tikaf at home or mosque if possible.' },
        citations: [mafatih, wasail],
      },
    ],
  ),
  day(
    10,
    'Mid-Ramadan renewal',
    {
      title: { en: 'Tawassul through Ahlul Bayt' },
      translation: { en: 'Seek nearness to Allah through the Prophet and Imams (as).' },
      duaId: 'dua_tawassul',
      citations: [mafatih, kamil],
    },
    {
      text: { en: 'The sleep of the fasting person is worship.' },
      narrator: { en: 'Imam al-Sadiq (as)' },
      citations: [bihar, wasail],
    },
    [
      {
        title: { en: 'Audit your Ramadan goals' },
        body: { en: 'Review Quran progress, charity, and prayer habits — adjust with mercy, not guilt.' },
        citations: [mafatih],
      },
    ],
  ),
  ...buildMidMonthDays(11, 14),
  day(
    15,
    'Birth of Imam Hasan (as)',
    {
      title: { en: 'Salawat upon the Ahlul Bayt' },
      translation: { en: 'Allah and His angels send blessings upon the Prophet — O believers, invoke blessings upon him.' },
      citations: [quran, { ...bihar, chapter: 'Wiladat Imam Hasan' }],
    },
    {
      text: { en: 'Imam Hasan (as) was born in Medina in the middle of Ramadan — a beacon of patience and peace.' },
      citations: [{ ...bihar, volume: 44, page: '45', scholar: 'Allama Majlisi' }],
    },
    [
      {
        title: { en: 'Recite Ziyarat of Imam Hasan (as)' },
        body: { en: 'Visit his shrine in spirit through ziyarat and salawat today.' },
        citations: [kamil, mafatih],
      },
    ],
  ),
  ...buildMidMonthDays(16, 18),
  day(
    19,
    'First odd night of Qadr search',
    {
      title: { en: 'Supplication for Laylat al-Qadr' },
      translation: { en: 'From Sahifa al-Sajjadiyya — supplication for the Night of Power.' },
      sahifaId: 'sahifa_051',
      citations: [sahifa, mafatih],
    },
    {
      text: { en: 'Laylat al-Qadr is better than a thousand months.' },
      citations: [quranQadr],
    },
    [
      {
        title: { en: 'Stay up in worship tonight' },
        body: { en: 'Recite Quran, dua, and salawat. Many scholars emphasize odd nights from the 19th onward.' },
        citations: [mafatih, wasail, { ...bihar, unverified: true, note: 'Night emphasis varies by narration' }],
      },
    ],
  ),
  day(
    20,
    'Even night — rest and prepare',
    {
      title: { en: 'Dua Kumayl' },
      translation: { en: 'Seek forgiveness before the next odd night.' },
      duaId: 'dua_kumail',
      citations: [mafatih, kamil],
    },
    {
      text: { en: 'Whoever stands in prayer on Laylat al-Qadr with faith and hope, his past sins are forgiven.' },
      narrator: { en: 'The Holy Prophet (s)' },
      citations: [bihar, manLa],
    },
    [
      {
        title: { en: 'Prepare suhoor and charity for tomorrow' },
        body: { en: 'Lay out Quran, tasbih, and charity for the 21st night.' },
        citations: [mafatih],
      },
    ],
  ),
  ...buildLastTenDays(21, 30),
];

function buildMidMonthDays(from: number, to: number): RamadanDayEntry[] {
  const entries: RamadanDayEntry[] = [];
  for (let d = from; d <= to; d++) {
    entries.push(
      day(
        d,
        `Day ${d} — steadfastness`,
        {
          title: { en: 'Daily morning supplication' },
          translation: { en: 'O Allah, bless this fast and accept our deeds.' },
          duaId: 'dua_sabah',
          citations: [mafatih, sahifa],
        },
        {
          text: { en: 'The breath of the fasting person is more fragrant to Allah than musk.' },
          narrator: { en: 'The Holy Prophet (s)' },
          citations: [bihar, wasail],
        },
        [
          {
            title: { en: 'Complete your Quran portion' },
            body: { en: `Aim for juz ${Math.min(d, 30)} or your daily target — consistency over speed.` },
            citations: [quran, mafatih],
          },
        ],
      ),
    );
  }
  return entries;
}

function buildLastTenDays(from: number, to: number): RamadanDayEntry[] {
  const entries: RamadanDayEntry[] = [];
  for (let d = from; d <= to; d++) {
    const isOdd = d % 2 === 1;
    entries.push(
      day(
        d,
        isOdd ? `Night ${d} — seek Laylat al-Qadr` : `Day ${d} — prepare for worship`,
        {
          title: { en: isOdd ? 'Dua for Laylat al-Qadr' : 'Iftar supplication' },
          translation: {
            en: isOdd
              ? 'Supplication from Imam al-Sajjad (as) for the Night of Power.'
              : 'O Allah, for You I fasted and with Your provision I break my fast.',
          },
          sahifaId: isOdd ? 'sahifa_051' : 'sahifa_050',
          citations: [sahifa, mafatih],
        },
        {
          text: {
            en: isOdd
              ? 'Whoever is deprived of the good of Laylat al-Qadr is deprived of all good.'
              : 'Break your fast with dates and water — a sunnah of the Prophet (s).',
          },
          narrator: isOdd ? { en: 'The Holy Prophet (s)' } : { en: 'The Holy Prophet (s)' },
          citations: isOdd ? [bihar, manLa] : [wasail, bihar],
        },
        [
          {
            title: { en: isOdd ? 'I‘tikaf at home tonight' : 'Rest and make dhikr' },
            body: {
              en: isOdd
                ? 'Dedicate the night to Quran, dua al-Qadr, and 100 salawat. Avoid idle talk.'
                : 'Use this even night for lighter worship and preparation for the next odd night.',
            },
            citations: [mafatih, wasail],
          },
          {
            title: { en: 'Ziyarat Ashura (optional)' },
            body: { en: 'Many believers increase salawat and ziyarat during the last ten nights.' },
            citations: [kamil, mafatih],
          },
        ],
      ),
    );
  }
  return entries;
}

export const RAMADAN_DAYS_BY_NUMBER: Record<number, RamadanDayEntry> = Object.fromEntries(
  RAMADAN_DAILY.map((e) => [e.day, e]),
);
