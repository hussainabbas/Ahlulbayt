import { getCatalogMeta } from '../../../constants/catalog';
import type { WorshipGuideBundle } from '../../../types';
import { ghuslTartibiSteps, L, step } from '../../shared/taharahHelpers';

export const GHUSL_ISTIHADA: WorshipGuideBundle = {
  meta: getCatalogMeta('ghusl_istihada'),
  bundleVersion: 1,
  steps: {
    beginner: [
      step({
        id: 'istihada_intro',
        kind: 'intro',
        title: L('What is istihada?', 'استحاضہ کیا ہے؟', 'ما الاستحاضة؟'),
        body: L(
          'Bleeding outside normal hayd pattern. Different rules for wudu between prayers apply — consult your marja for duration categories.',
          'حیض کے علاوہ خون۔ نمازوں کے درمیان وضو کے احکام مختلف۔',
          'نزيف خارج الحيض. أحكام الوضو بين الصلوات مختلفة.',
        ),
        isRequired: false,
      }),
      ...ghuslTartibiSteps(
        'istihada',
        { en: 'Istihada', ur: 'استحاضہ', ar: 'الاستحاضة' },
        L('When ghusl is required by your marja, this tartibi method applies.', 'جب مرجع کے نزدیک غسل واجب ہو۔', 'عند وجوب الغسل.'),
      ),
    ],
    standard: ghuslTartibiSteps(
      'istihada',
      { en: 'Istihada', ur: 'استحاضہ', ar: 'الاستحاضة' },
      L('Complete.', 'مکمل۔', 'اكتمل.'),
    ),
    scholar: ghuslTartibiSteps(
      'istihada',
      { en: 'Istihada', ur: 'استحاضہ', ar: 'الاستحاضة' },
      L('Complete.', 'مکمل۔', 'اكتمل.'),
    ),
  },
};

export const GHUSL_MUSTAHAB: WorshipGuideBundle = {
  meta: getCatalogMeta('ghusl_mustahab'),
  bundleVersion: 1,
  steps: {
    beginner: [
      step({
        id: 'mustahab_overview',
        kind: 'intro',
        title: L('Recommended occasions', 'مستحب مواقع', 'مناسبات مستحبة'),
        body: L(
          'Mustahab ghusl includes: Jumu\'ah, Eid, entering Makkah/Haram, rain ghusl, Laylat al-Qadr, and after certain sins/repentance.',
          'مستحب غسل: جمعہ، عید، حرم، بارش، شب قدر وغیرہ۔',
          'منها: الجمعة، العيد، الحرم، المطر، ليلة القدر.',
        ),
        isRequired: false,
        checklist: [
          L('Ghusl Jumu\'ah (Friday)', 'غسل جمعہ', 'غسل الجمعة'),
          L('Ghusl Eid', 'غسل عید', 'غسل العيد'),
          L('Entering Makkah', 'مکہ میں داخلہ', 'دخول مكة'),
        ],
      }),
      step({
        id: 'mustahab_method',
        kind: 'method',
        title: L('How to perform', 'طریقہ', 'كيفية الأداء'),
        body: L(
          'Use the same tartibi ghusl method with niyyah for the specific mustahab occasion.',
          'مخصوص مستحب نیت کے ساتھ ترتیبی غسل۔',
          'بالغسل الترتيبي مع نية المناسبة.',
        ),
        isRequired: false,
      }),
    ],
    standard: ghuslTartibiSteps(
      'mustahab',
      { en: 'Mustahab', ur: 'مستحب', ar: 'المستحب' },
      L('Mustahab ghusl complete.', 'مستحب غسل مکمل۔', 'اكتمل الغسل المستحب.'),
    ),
    scholar: ghuslTartibiSteps(
      'mustahab',
      { en: 'Mustahab', ur: 'مستحب', ar: 'المستحب' },
      L('Complete.', 'مکمل۔', 'اكتمل.'),
    ),
  },
};
