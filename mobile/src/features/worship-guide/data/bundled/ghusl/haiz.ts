import { getCatalogMeta } from '../../../constants/catalog';
import type { WorshipGuideBundle } from '../../../types';
import { ghuslTartibiSteps, L } from '../../shared/taharahHelpers';

const title = { en: 'Hayd', ur: 'حیض', ar: 'الحيض' };

export const GHUSL_HAIZ: WorshipGuideBundle = {
  meta: getCatalogMeta('ghusl_haiz'),
  bundleVersion: 1,
  steps: {
    beginner: ghuslTartibiSteps(
      'haiz',
      title,
      L('Hayd ghusl complete. Salah and fasting may resume per fiqh rules.', 'غسل حیض مکمل۔', 'اكتمل غسل الحيض.'),
    ),
    standard: [
      ...ghuslTartibiSteps('haiz', title, L('Complete.', 'مکمل۔', 'اكتمل.')),
    ],
    scholar: ghuslTartibiSteps('haiz', title, L('Complete.', 'مکمل۔', 'اكتمل.')),
  },
};

export const GHUSL_NIFAS: WorshipGuideBundle = {
  meta: getCatalogMeta('ghusl_nifas'),
  bundleVersion: 1,
  steps: {
    beginner: ghuslTartibiSteps(
      'nifas',
      { en: 'Nifas', ur: 'نفاس', ar: 'النفاس' },
      L('Nifas ghusl complete.', 'غسل نفاس مکمل۔', 'اكتمل غسل النفاس.'),
    ),
    standard: ghuslTartibiSteps(
      'nifas',
      { en: 'Nifas', ur: 'نفاس', ar: 'النفاس' },
      L('Complete.', 'مکمل۔', 'اكتمل.'),
    ),
    scholar: ghuslTartibiSteps(
      'nifas',
      { en: 'Nifas', ur: 'نفاس', ar: 'النفاس' },
      L('Complete.', 'مکمل۔', 'اكتمل.'),
    ),
  },
};

export const GHUSL_JUMUAH: WorshipGuideBundle = {
  meta: getCatalogMeta('ghusl_jumuah'),
  bundleVersion: 1,
  steps: {
    beginner: ghuslTartibiSteps(
      'jumuah',
      { en: 'Jumu\'ah', ur: 'جمعہ', ar: 'الجمعة' },
      L('Mustahab ghusl for Jumu\'ah complete.', 'غسل جمعہ مکمل۔', 'اكتمل غسل الجمعة.'),
    ),
    standard: ghuslTartibiSteps(
      'jumuah',
      { en: 'Jumu\'ah', ur: 'جمعہ', ar: 'الجمعة' },
      L('Complete.', 'مکمل۔', 'اكتمل.'),
    ),
    scholar: ghuslTartibiSteps(
      'jumuah',
      { en: 'Jumu\'ah', ur: 'جمعہ', ar: 'الجمعة' },
      L('Complete.', 'مکمل۔', 'اكتمل.'),
    ),
  },
};
