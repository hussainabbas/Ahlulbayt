import type { IslamicSourceCitation } from '../types';

export function cite(
  book: string,
  opts: Omit<IslamicSourceCitation, 'book'> = {},
): IslamicSourceCitation {
  return { book, ...opts };
}

export const RAMADAN_SOURCES = {
  quran: cite('The Holy Quran', { scholar: 'Revelation' }),
  quranRamadan: cite('The Holy Quran', { chapter: '2:183–185', scholar: 'Revelation' }),
  quranQadr: cite('The Holy Quran', { chapter: '97:1–5', scholar: 'Revelation' }),
  bihar: cite('Bihar al-Anwar', { volume: 93, scholar: 'Allama Majlisi' }),
  mafatih: cite('Mafatih al-Jinan', { scholar: 'Shaykh Abbas Qummi' }),
  sahifa: cite('Al-Sahifa al-Sajjadiyya', { scholar: 'Imam Zayn al-Abidin (as)' }),
  wasail: cite('Wasail al-Shia', { volume: 7, scholar: 'Hurr al-Amili' }),
  manLa: cite('Man La Yahduruhu al-Faqih', { volume: 2, scholar: 'Shaykh al-Saduq' }),
  tahdhib: cite('Tahdhib al-Ahkam', { volume: 4, scholar: 'Shaykh al-Tusi' }),
  kamil: cite('Kamil al-Ziyarat', { scholar: 'Ibn Qulawayh' }),
  nahjul: cite('Nahjul Balagha', { scholar: 'Sharif al-Radi' }),
  irshad: cite('Kitab al-Irshad', { volume: 2, scholar: 'Shaykh al-Mufid' }),
} as const;
