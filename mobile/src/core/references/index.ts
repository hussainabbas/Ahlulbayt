export type {
  FiqhReference,
  IslamicReference,
  LocalizedReferenceText,
  MarjaId,
  ReferenceDisplayRow,
  ReferenceKind,
  ReferenceValidationIssue,
  ReferenceValidationResult,
  ReferenceVerificationReport,
  ReferenceVerificationStatus,
  ReferencedContent,
} from './types';

export {
  REFERENCE_UNAVAILABLE,
  filterReferencesByMarja,
  formatReferenceRows,
  formatSurahAyah,
  mergeReferences,
  normalizeReferences,
  pickReferenceText,
  referenceKindLabelKey,
  validateReference,
  verifyReferences,
} from './engine/referenceEngine';

export type { AppLocale } from './engine/referenceEngine';

export {
  auditContentReferences,
  enforceAiReferences,
  enforceContentReferences,
  shouldShowReferenceWarning,
} from './engine/verificationWorkflow';

export type {
  AiReferenceEnforcementResult,
  ContentReferencePolicy,
} from './engine/verificationWorkflow';

export { fiqhRefToIslamic, fiqhRefsToIslamic } from './adapters/fiqhAdapter';
export { hadithEntryToReferences } from './adapters/hadithAdapter';
export {
  quranAyahReference,
  quranTafsirReferences,
  tafsirToReference,
} from './adapters/quranAdapter';
export { aiCitationToReference, aiCitationsToReferences } from './adapters/aiAdapter';
export {
  calendarEventToReference,
  duaSourceToReference,
  ziyaratSourceToReference,
} from './adapters/contentAdapter';

export {
  AI_CALENDAR_REFS,
  AI_DUA_REFS,
  AI_PRAYER_GUIDANCE_REFS,
  AI_ZIYARAT_REFS,
  FAQ_REFERENCE_CATALOG,
} from './catalog/faqReferences';

export { resolveReferenceNavigation } from './navigation';
export type { ReferenceNavigationTarget } from './navigation';
