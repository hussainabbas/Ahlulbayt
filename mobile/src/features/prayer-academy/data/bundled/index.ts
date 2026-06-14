import type { PrayerAcademyBundle, PrayerAcademyId } from '../../types';

import { SALAT_DHUHR } from './obligatory/dhuhr';
import { SALAT_FAJR } from './obligatory/fajr';
import { SALAT_ASR } from './obligatory/asr';
import { SALAT_MAGHRIB } from './obligatory/maghrib';
import { SALAT_ISHA } from './obligatory/isha';
import { NAMAZ_E_AYAT } from './special/ayat';
import { NAMAZ_E_MAYYIT } from './special/mayyit';
import { NAMAZ_E_WAHSHAT } from './special/wahshat';
import { SALAT_EID_ADHA, SALAT_EID_FITR } from './special/eid';
import { SALAT_JUMUAH } from './special/jumuah';
import {
  NAFL_RECOMMENDED,
  SALAT_GHUFAYLA,
  SALAT_ISTIKHARA,
  SALAT_LAYL,
} from './special/nafl';

export const BUNDLED_PRAYERS: Record<PrayerAcademyId, PrayerAcademyBundle> = {
  salat_fajr: SALAT_FAJR,
  salat_dhuhr: SALAT_DHUHR,
  salat_asr: SALAT_ASR,
  salat_maghrib: SALAT_MAGHRIB,
  salat_isha: SALAT_ISHA,
  namaz_e_ayat: NAMAZ_E_AYAT,
  namaz_e_mayyit: NAMAZ_E_MAYYIT,
  namaz_e_wahshat: NAMAZ_E_WAHSHAT,
  salat_eid_fitr: SALAT_EID_FITR,
  salat_eid_adha: SALAT_EID_ADHA,
  salat_jumuah: SALAT_JUMUAH,
  salat_ghufayla: SALAT_GHUFAYLA,
  salat_layl: SALAT_LAYL,
  salat_istikhara: SALAT_ISTIKHARA,
  nafl_recommended: NAFL_RECOMMENDED,
};

export const ALL_BUNDLED_PRAYER_IDS = Object.keys(BUNDLED_PRAYERS) as PrayerAcademyId[];
