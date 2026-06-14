import { getCatalogMeta } from '../../../constants/catalog';
import type { WorshipGuideBundle } from '../../../types';
import { ghuslTartibiSteps, L, step } from '../../shared/taharahHelpers';

const title = { en: 'Mayyit', ur: 'میت', ar: 'الميت' };

export const GHUSL_MAYYIT: WorshipGuideBundle = {
  meta: getCatalogMeta('ghusl_mayyit'),
  bundleVersion: 1,
  waterRequirements: L('Clean water; sidr (lotus) and camphor often used per tradition.', 'پاک پانی؛ بیر اور کافور۔', 'ماء طاهر؛ السدر والكافور.'),
  steps: {
    beginner: [
      step({
        id: 'mayyit_intro',
        kind: 'intro',
        title: L('Communal duty', 'واجب کفائی', 'واجب كفائي'),
        body: L(
          'If some Muslims perform ghusl mayyit, others are relieved. Follow local marja and funeral customs.',
          'اگر کچھ مسلمان غسل دے دیں تو سب پر سے ساقط۔',
          'إذا قام به بعض المسلمين سقط عن الباقين.',
        ),
        isRequired: false,
      }),
      ...ghuslTartibiSteps(
        'mayyit',
        title,
        L('Mayyit ghusl complete. Proceed to kafan and burial rites.', 'غسل میت مکمل۔', 'اكتمل غسل الميت.'),
      ),
    ],
    standard: [
      step({
        id: 'mayyit_rules',
        kind: 'order_rule',
        title: L('Who performs ghusl?', 'غسل کون دے؟', 'من يغسل؟'),
        body: L(
          'Prefer same gender; mahram for opposite gender when needed. Body covered except washing parts.',
          'جنس یکساں ترجیح؛ محرم جب ضرورت ہو۔',
          'يفضل من الجنس؛ المحرم عند الحاجة.',
        ),
        isRequired: false,
      }),
      ...ghuslTartibiSteps('mayyit', title, L('Complete.', 'مکمل۔', 'اكتمل.')),
    ],
    scholar: ghuslTartibiSteps('mayyit', title, L('Complete.', 'مکمل۔', 'اكتمل.')),
  },
};
