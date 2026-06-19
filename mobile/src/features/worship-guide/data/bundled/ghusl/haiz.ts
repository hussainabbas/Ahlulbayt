import { getCatalogMeta } from '../../../constants/catalog';
import type { WorshipGuideBundle } from '../../../types';
import {
  assembleGhuslBundle,
  GHUSL_HAYD_FIQH,
  GHUSL_JUMUAH_FIQH,
  GHUSL_NIFAS_FIQH,
} from '../../shared/ghuslDetailedContent';
import { L } from '../../shared/taharahHelpers';

const haydTitle = { en: 'Hayd', ur: 'حیض', ar: 'الحيض' };
const nifasTitle = { en: 'Nifas', ur: 'نفاس', ar: 'النفاس' };
const jumuahTitle = { en: 'Jumu\'ah', ur: 'جمعہ', ar: 'الجمعة' };

export const GHUSL_HAIZ: WorshipGuideBundle = {
  meta: getCatalogMeta('ghusl_haiz'),
  bundleVersion: 2,
  ...assembleGhuslBundle(
    'haiz',
    haydTitle,
    GHUSL_HAYD_FIQH,
    L(
      'Hayd ghusl complete. You may resume salah, fasting, and other acts requiring taharah.',
      'غسل حیض مکمل۔ اب نماز، روزہ اور طہارت والے اعمال کر سکتے ہیں۔',
      'اكتمل غسل الحيض. يجوز لك استئناف الصلاة والصوم وما يشترط فيه الطهارة.',
    ),
  ),
};

export const GHUSL_NIFAS: WorshipGuideBundle = {
  meta: getCatalogMeta('ghusl_nifas'),
  bundleVersion: 2,
  ...assembleGhuslBundle(
    'nifas',
    nifasTitle,
    GHUSL_NIFAS_FIQH,
    L(
      'Nifas ghusl complete. You may resume salah and acts requiring taharah.',
      'غسل نفاس مکمل۔ اب نماز اور طہارت والے اعمال کر سکتے ہیں۔',
      'اكتمل غسل النفاس. يجوز لك استئناف الصلاة وما يشترط فيه الطهارة.',
    ),
  ),
};

export const GHUSL_JUMUAH: WorshipGuideBundle = {
  meta: getCatalogMeta('ghusl_jumuah'),
  bundleVersion: 2,
  ...assembleGhuslBundle(
    'jumuah',
    jumuahTitle,
    GHUSL_JUMUAH_FIQH,
    L(
      'Mustahab ghusl for Jumu\'ah complete.',
      'مستحب غسل جمعہ مکمل۔',
      'اكتمل غسل الجمعة المستحب.',
    ),
  ),
};
