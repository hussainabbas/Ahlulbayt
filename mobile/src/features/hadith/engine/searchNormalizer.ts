/** Arabic/Urdu text normalization for hadith search */

const ARABIC_DIACRITICS = /[\u064B-\u065F\u0670\u0640]/g;
const ALEF_VARIANTS = /[أإآٱ]/g;
const YA_VARIANTS = /[يى]/g;
const TA_MARBUTA = /ة/g;

export function normalizeSearchText(input: string): string {
  return input
    .toLowerCase()
    .replace(ARABIC_DIACRITICS, '')
    .replace(ALEF_VARIANTS, 'ا')
    .replace(YA_VARIANTS, 'ي')
    .replace(TA_MARBUTA, 'ه')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenizeQuery(query: string): string[] {
  return normalizeSearchText(query)
    .split(/\s+/)
    .filter((t) => t.length >= 2);
}
