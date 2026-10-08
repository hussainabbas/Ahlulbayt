import type { IslamicCitation, KaffaraInput, KaffaraResult } from '../types';
import { mergeReferences } from '@/core/references';
import {
  KAFFARA_CITATIONS,
  KAFFARA_RULES,
  type JafariRulingSnippet,
} from '../data/jafariRulings';

function ruleToObligation(rule: JafariRulingSnippet, daysBroken: number) {
  return {
    id: rule.id,
    summaryKey: rule.summaryKey,
    detailKey: rule.detailKey,
    quantity: rule.quantity != null ? rule.quantity * daysBroken : undefined,
    unitKey: rule.unitKey,
    citations: rule.citations,
    unverified: rule.unverified,
  };
}

function getRule(key: keyof typeof KAFFARA_RULES): JafariRulingSnippet {
  const rule = KAFFARA_RULES[key];
  if (!rule) {
    throw new Error(`Missing kaffara rule: ${String(key)}`);
  }
  return rule;
}

/**
 * Educational kaffara estimator aligned with general Jafari marja principles.
 * Not a fatwa — users must consult their marja.
 */
export function calculateKaffara(input: KaffaraInput): KaffaraResult {
  const daysBroken = Math.max(1, Math.floor(input.daysBroken));
  const marja = input.marja ?? 'general';

  if (input.breakType === 'forgetful') {
    const rule = getRule('forgetful');
    return {
      obligations: [ruleToObligation(rule, daysBroken)],
      disclaimerKey: 'fasting.calculators.disclaimer',
      consultMarja: false,
      citations: rule.citations,
    };
  }

  if (input.breakType === 'coerced') {
    const rule = getRule('coerced');
    return {
      obligations: [ruleToObligation(rule, daysBroken)],
      disclaimerKey: 'fasting.calculators.disclaimer',
      consultMarja: true,
      citations: rule.citations,
    };
  }

  if (!input.isRamadan) {
    const rule = getRule('nonRamadan');
    return {
      obligations: [ruleToObligation(rule, daysBroken)],
      disclaimerKey: 'fasting.calculators.disclaimer',
      consultMarja: true,
      citations: rule.citations,
    };
  }

  const obligations = [];
  if (input.breakType === 'intentional' || input.invalidator === 'sexual') {
    obligations.push(ruleToObligation(getRule('ramadanIntentionalFast60'), daysBroken));
    obligations.push(ruleToObligation(getRule('ramadanIntentionalFeed60'), daysBroken));
  } else {
    obligations.push(ruleToObligation(getRule('ramadanIntentionalFast60'), daysBroken));
  }

  const marjaRule = getRule(marja === 'khamenei' ? 'khameneiNote' : 'sistaniNote');
  obligations.push(ruleToObligation(marjaRule, daysBroken));

  const citations = mergeReferences(
    KAFFARA_CITATIONS,
    ...obligations.map((o) => o.citations),
  );

  return {
    obligations,
    disclaimerKey: 'fasting.calculators.disclaimer',
    consultMarja: true,
    citations,
  };
}
