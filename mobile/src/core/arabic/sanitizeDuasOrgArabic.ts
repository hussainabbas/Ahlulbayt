/**
 * duas.org Najaf font encodes hamza as private-use codepoints (U+E822–E825).
 * System fonts show these as empty □ boxes — normalize before display.
 */
export function sanitizeDuasOrgArabic(text: string): string {
  return text
    .replace(/[\u200B-\u200F\uFEFF]/g, '')
    .replace(/ا([\uE800-\uF8FF])/g, 'أ')
    .replace(/([\uE800-\uF8FF])/g, 'أ')
    .replace(/اأُ/g, 'أُ')
    .replace(/اأ/g, 'أ');
}
