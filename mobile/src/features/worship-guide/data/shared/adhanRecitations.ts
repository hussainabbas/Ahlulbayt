import { L } from '../shared/taharahHelpers';
import type { LocalizedText } from '../../types';

/** Adhan / Iqama phrase with trilingual meaning. */
export interface AdhanRecitation {
  arabicText: string;
  transliteration: LocalizedText;
  translation: LocalizedText;
}

export function adhanPhrase(
  arabic: string,
  transliteration: string,
  meaningEn: string,
  meaningUr: string,
): AdhanRecitation {
  return {
    arabicText: arabic,
    transliteration: L(transliteration, transliteration, transliteration),
    translation: L(meaningEn, meaningUr, meaningEn),
  };
}

export const ADHAN_ALLAHU_AKBAR = adhanPhrase(
  'اَللہُ اَکۡبَر',
  'Allahu Akbar',
  'God is the greatest.',
  'اللہ سب سے بڑا ہے۔',
);

export const ADHAN_SHAHADA = adhanPhrase(
  'اَشۡہَدُ اَن لَا اِلہَ اِلّا اللہ',
  'Ash-hadu alla ilaha illallah',
  'I bear witness that there is no god except Allah.',
  'میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں۔',
);

export const ADHAN_RASUL = adhanPhrase(
  'اَشۡہَدُ اَنَّ مُحَمَّداً رَّسُوۡلُ اللہ',
  'Ash-hadu anna Muhammadan rasulullah',
  'I bear witness that Muhammad is the Messenger of Allah.',
  'میں گواہی دیتا ہوں کہ محمدؐ اللہ کے رسول ہیں۔',
);

export const ADHAN_WALI = adhanPhrase(
  'اَشۡہَدُ اَنَّ عَلِیّاً وَلِیُّ اللہِ',
  'Ash-hadu anna Aliya wali-ul-lah',
  'I bear witness that Ali is the vicegerent of Allah.',
  'میں گواہی دیتا ہوں کہ علیؑ اللہ کے ولی ہیں۔',
);

export const ADHAN_SALAH = adhanPhrase(
  'حَیَّ عَلی الصَّلوٰۃِ',
  'Hayya \'alas-salaah',
  'Make haste towards prayer.',
  'نماز کی طرف دوڑو۔',
);

export const ADHAN_FALAH = adhanPhrase(
  'حَیَّ عَلی الفَلاحِ',
  'Hayya \'alal-falah',
  'Make haste towards success.',
  'کامیابی کی طرف دوڑو۔',
);

export const ADHAN_KHAIR = adhanPhrase(
  'حَیَّ عَلیٰ خَیۡرِ الۡعَمَل',
  'Hayya ala Khairil amal',
  'Make haste towards the best of deeds.',
  'بہترین عمل کی طرف دوڑو۔',
);

export const ADHAN_LA_ILAHA = adhanPhrase(
  'لَا اِلٰہَ الّا للہُ',
  'La ilaha illallah',
  'There is no god except Allah.',
  'اللہ کے سوا کوئی معبود نہیں۔',
);

export const IQAMA_QAD_QAMAT = adhanPhrase(
  'قَدْ قامَتِ الصّلاة',
  'Qad qaamatis salaah',
  'The prayer has certainly been established.',
  'نماز کھڑی ہو گئی۔',
);
