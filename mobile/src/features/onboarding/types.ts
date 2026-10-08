export const ONBOARDING_STEPS = [
  'welcome',
  'language',
  'madhab',
  'location',
  'notifications',
  'interests',
  'ai',
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export const MARJA_OPTIONS = ['sistani', 'khamenei', 'shirazi', 'local', 'unsure'] as const;
export type MarjaOption = (typeof MARJA_OPTIONS)[number];

export const INTEREST_OPTIONS = [
  'quran',
  'duas',
  'ziyarat',
  'calendar',
  'prayer',
  'learning',
  'muharram',
  'community',
] as const;
export type InterestOption = (typeof INTEREST_OPTIONS)[number];

export const AI_TOPIC_OPTIONS = [
  'history',
  'quran_reflection',
  'imam_biographies',
  'daily_guidance',
  'lectures',
] as const;
export type AiTopicOption = (typeof AI_TOPIC_OPTIONS)[number];

export function getStepIndex(step: OnboardingStep): number {
  return ONBOARDING_STEPS.indexOf(step);
}

export function getNextStep(step: OnboardingStep): OnboardingStep | null {
  const index = getStepIndex(step);
  return ONBOARDING_STEPS[index + 1] ?? null;
}

export function getPrevStep(step: OnboardingStep): OnboardingStep | null {
  const index = getStepIndex(step);
  return index > 0 ? ONBOARDING_STEPS[index - 1]! : null;
}
