import { getCatalogMeta } from '../../../constants/catalog';
import type { WorshipGuideBundle } from '../../../types';
import {
  assembleGhuslBundle,
  GHUSL_ISTIHADA_FIQH,
  GHUSL_MUSTAHAB_FIQH,
} from '../../shared/ghuslDetailedContent';
import { L } from '../../shared/taharahHelpers';

export const GHUSL_ISTIHADA: WorshipGuideBundle = {
  meta: getCatalogMeta('ghusl_istihada'),
  bundleVersion: 2,
  ...assembleGhuslBundle(
    'istihada',
    { en: 'Istihada', ur: 'استحاضہ', ar: 'الاستحاضة' },
    GHUSL_ISTIHADA_FIQH,
    L(
      'When ghusl is required by your marja, istihada ghusl is complete.',
      'جب آپ کے مرجع کے نزدیک غسل واجب ہو تو غسل استحاضہ مکمل۔',
      'إذا أوجب مرجعك الغسل في الاستحاضة فقد اكتمل غسل الاستحاضة.',
    ),
  ),
};

export const GHUSL_MUSTAHAB: WorshipGuideBundle = {
  meta: getCatalogMeta('ghusl_mustahab'),
  bundleVersion: 2,
  ...assembleGhuslBundle(
    'mustahab',
    { en: 'Mustahab', ur: 'مستحب', ar: 'المستحب' },
    GHUSL_MUSTAHAB_FIQH,
    L(
      'Mustahab ghusl complete.',
      'مستحب غسل مکمل۔',
      'اكتمل الغسل المستحب.',
    ),
  ),
};
