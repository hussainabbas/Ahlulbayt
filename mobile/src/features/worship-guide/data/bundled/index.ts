import type { WorshipGuideBundle } from '../../types';
import { WUDU_STANDARD } from './wudu';
import { GHUSL_JANABAT } from './ghusl/janabat';
import { GHUSL_HAIZ, GHUSL_JUMUAH, GHUSL_NIFAS } from './ghusl/haiz';
import { GHUSL_ISTIHADA, GHUSL_MUSTAHAB } from './ghusl/istihada';
import { GHUSL_MAYYIT } from './ghusl/mayyit';

export const BUNDLED_WORSHIP_GUIDES: Record<string, WorshipGuideBundle> = {
  wudu_standard: WUDU_STANDARD,
  ghusl_janabat: GHUSL_JANABAT,
  ghusl_mayyit: GHUSL_MAYYIT,
  ghusl_haiz: GHUSL_HAIZ,
  ghusl_nifas: GHUSL_NIFAS,
  ghusl_jumuah: GHUSL_JUMUAH,
  ghusl_istihada: GHUSL_ISTIHADA,
  ghusl_mustahab: GHUSL_MUSTAHAB,
};

export const ALL_WORSHIP_GUIDE_IDS = Object.keys(BUNDLED_WORSHIP_GUIDES);
