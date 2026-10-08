import {
  REFERENCE_UNAVAILABLE,
  mergeReferences,
  normalizeReferences,
  verifyReferences,
} from './referenceEngine';
import type {
  IslamicReference,
  ReferencedContent,
  ReferenceVerificationReport,
} from '../types';

export interface ContentReferencePolicy {
  /** Minimum verified references required to display content without warning */
  minVerified?: number;
  /** Fallback when no references supplied */
  fallback?: IslamicReference;
}

const DEFAULT_POLICY: ContentReferencePolicy = {
  minVerified: 1,
  fallback: REFERENCE_UNAVAILABLE,
};

export function enforceContentReferences<T>(
  content: T,
  references: IslamicReference[] | undefined,
  policy: ContentReferencePolicy = DEFAULT_POLICY,
): ReferencedContent<T> {
  const normalized = normalizeReferences(references);
  const verification = verifyReferences(normalized);
  const minVerified = policy.minVerified ?? 1;

  if (verification.hasVerifiedSource && verification.verified >= minVerified) {
    return { content, references: normalized, verification };
  }

  const fallback = policy.fallback ?? REFERENCE_UNAVAILABLE;
  const refs =
    normalized.length > 0 && !verification.hasVerifiedSource
      ? mergeReferences(normalized, [fallback])
      : normalized.length > 0
        ? normalized
        : [fallback];

  return {
    content,
    references: refs,
    verification: verifyReferences(refs),
  };
}

export function shouldShowReferenceWarning(report: ReferenceVerificationReport): boolean {
  return !report.hasVerifiedSource || report.unavailable > 0;
}

export interface AiReferenceEnforcementResult {
  references: IslamicReference[];
  showUnavailableWarning: boolean;
  appendDisclaimer: boolean;
}

/** Ensures AI responses never ship without explicit source attribution. */
export function enforceAiReferences(
  references: IslamicReference[] | undefined,
  citationsConverted?: IslamicReference[],
): AiReferenceEnforcementResult {
  const merged = mergeReferences(references, citationsConverted);
  const report = verifyReferences(merged);

  if (report.hasVerifiedSource) {
    return {
      references: merged,
      showUnavailableWarning: report.pending > 0,
      appendDisclaimer: false,
    };
  }

  return {
    references: [REFERENCE_UNAVAILABLE],
    showUnavailableWarning: true,
    appendDisclaimer: true,
  };
}

/** Dev-time audit helper — log content ids missing verified references. */
export function auditContentReferences(
  contentId: string,
  references: IslamicReference[] | undefined,
): ReferenceVerificationReport {
  const report = verifyReferences(normalizeReferences(references));
  if (!report.hasVerifiedSource) {
    console.warn(
      `[references] Content "${contentId}" lacks verified sources (${report.total} refs, ${report.unavailable} unavailable)`,
    );
  }
  return report;
}
