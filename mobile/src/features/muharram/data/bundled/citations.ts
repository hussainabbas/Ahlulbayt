import type { IslamicSourceCitation } from '../../types';

export function cite(
  book: string,
  opts: Omit<IslamicSourceCitation, 'book'> = {},
): IslamicSourceCitation {
  return { book, ...opts };
}

export const SOURCES = {
  biharKarbala: cite('Bihar al-Anwar', {
    volume: 44,
    scholar: 'Allama Majlisi',
  }),
  tabari: cite('Tarikh al-Tabari', { scholar: 'Muhammad ibn Jarir al-Tabari' }),
  maqtalKhwarazmi: cite('Maqtal al-Husayn', {
    scholar: 'Abu al-Faraj al-Khwarazmi',
  }),
  luhuf: cite('Al-Luhuf fi Qatla al-Tufuf', { scholar: 'Ibn Tawus' }),
  mafatih: cite('Mafatih al-Jinan', { scholar: 'Shaykh Abbas Qummi' }),
  kamilZiyarat: cite('Kamil al-Ziyarat', { scholar: 'Ibn Qulawayh' }),
  maalimZiyarat: cite("Ma'alim al-Ziyarat", { scholar: 'Ibn Mashhadi' }),
  irshad: cite('Kitab al-Irshad', { volume: 2, scholar: 'Shaykh al-Mufid' }),
  ansab: cite('Ansab al-Ashraf', { scholar: 'al-Baladhuri' }),
} as const;
