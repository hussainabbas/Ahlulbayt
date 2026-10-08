import type { LocalizedText } from '../../types';
import { L } from './contentHelpers';

export const E = (en: string, ur: string = en, ar: string = en): LocalizedText => L(en, ur, ar);

export const MF = (shared: string, male: string, female: string): string =>
  `${shared}\n\nMales: ${male}\n\nFemales: ${female}`;

export const MF_L = (
  enShared: string,
  urShared: string,
  arShared: string,
  enMale: string,
  urMale: string,
  arMale: string,
  enFemale: string,
  urFemale: string,
  arFemale: string,
): LocalizedText =>
  L(
    `${enShared}\n\nMales: ${enMale}\n\nFemales: ${enFemale}`,
    `${urShared}\n\nمرد: ${urMale}\n\nخواتین: ${urFemale}`,
    `${arShared}\n\nالرجال: ${arMale}\n\nالنساء: ${arFemale}`,
  );
