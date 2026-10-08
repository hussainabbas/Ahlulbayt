import { getCatalogMeta } from '../../../constants/catalog';
import type { WorshipGuideBundle } from '../../../types';
import { assembleGhuslBundle, GHUSL_MAYYIT_FIQH } from '../../shared/ghuslDetailedContent';
import { L } from '../../shared/taharahHelpers';

const title = { en: 'Mayyit', ur: 'میت', ar: 'الميت' };

export const GHUSL_MAYYIT: WorshipGuideBundle = {
  meta: getCatalogMeta('ghusl_mayyit'),
  bundleVersion: 2,
  ...assembleGhuslBundle(
    'mayyit',
    title,
    GHUSL_MAYYIT_FIQH,
    L(
      'Mayyit ghusl complete. Proceed to kafan and burial rites.',
      'غسل میت مکمل۔ اب کفن اور تدفین کے اعمال۔',
      'اكتمل غسل الميت. تابع تجهيز الكفن والدفن.',
    ),
    L(
      'Clean water; sidr (lotus) and camphor often used per tradition.',
      'صاف پانی؛ روایت کے مطابق اکثر سدر (بیری) اور کافور استعمال ہوتا ہے۔',
      'ماء طاهر؛ يُستعمل السدر والكافور غالباً حسب التقليد.',
    ),
  ),
};
