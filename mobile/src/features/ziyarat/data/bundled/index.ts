import type { ZiyaratBundle, ZiyaratId } from '../../types';

import { ZIYARAT_ALE_YASIN } from './aleYasin';
import { ZIYARAT_AMINULLAH } from './aminullah';
import { ZIYARAT_ARBAEEN } from './arbaeen';
import { ZIYARAT_ASHURA } from './ashura';
import { ZIYARAT_JAMIA_KABIRA } from './jamiaKabira';
import { ZIYARAT_WARITHA } from './waritha';

export const BUNDLED_ZIYARAT: Record<ZiyaratId, ZiyaratBundle> = {
  ziyarat_ashura: ZIYARAT_ASHURA,
  ziyarat_waritha: ZIYARAT_WARITHA,
  ziyarat_aminullah: ZIYARAT_AMINULLAH,
  ziyarat_arbaeen: ZIYARAT_ARBAEEN,
  ziyarat_jamia_kabira: ZIYARAT_JAMIA_KABIRA,
  ziyarat_ale_yasin: ZIYARAT_ALE_YASIN,
};

export {
  ZIYARAT_ASHURA,
  ZIYARAT_WARITHA,
  ZIYARAT_AMINULLAH,
  ZIYARAT_ARBAEEN,
  ZIYARAT_JAMIA_KABIRA,
  ZIYARAT_ALE_YASIN,
};
