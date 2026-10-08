import { getCatalogMeta } from '../../constants/catalog';
import type { WorshipGuideBundle } from '../../types';
import { buildDetailedWuduSteps } from '../shared/wuduDetailedSteps';
import { L, WUDU_INVALIDATORS } from '../shared/taharahHelpers';

export const WUDU_STANDARD: WorshipGuideBundle = {
  meta: { ...getCatalogMeta('wudu_standard'), stepCount: 10, estimatedMinutes: 8 },
  bundleVersion: 2,
  waterRequirements: L(
    'Clean, tahir, unmixed water. Enough to wash face and arms and wet hands for masah.',
    'پاک، طاہر، غیر مخلوط پانی۔',
    'ماء طاهر غير مختلط.',
  ),
  orderRules: [
    L('Face → right arm → left arm → masah head → masah feet', 'چہرہ → دایاں بازو → بایاں → سر → پاؤں', 'الوجه → الأيمن → الأيسر → الرأس → القدمين'),
    L('Do not leave long gap between steps', 'مراحل کے درمیان لمبا وقفہ نہ چھوڑیں', 'لا فصل طويل بين الخطوات'),
  ],
  invalidators: WUDU_INVALIDATORS,
  audioCues: [{ id: 'complete', label: L('Wudu complete', 'وضو مکمل', 'اكتمل الوضو'), assetKey: 'worship/wudu/complete' }],
  steps: buildDetailedWuduSteps(),
};
