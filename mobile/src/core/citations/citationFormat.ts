import type { IslamicCitation } from './types';

/** Compact human-readable citation — e.g. "Bihar 44:93" or "Al-Kafi #12". */
export function formatCitation(citation: IslamicCitation, _locale?: string): string {
  if (!citation.verified) return '';

  const source = citation.source.trim();
  if (!source) return '';

  if (citation.hadithNumber) {
    const loc =
      citation.volume != null && citation.page != null
        ? ` ${citation.volume}:${citation.page}`
        : citation.volume != null
          ? ` ${citation.volume}`
          : '';
    return `${source}${loc} #${citation.hadithNumber}`;
  }

  if (citation.volume != null && citation.page != null) {
    return `${source} ${citation.volume}:${citation.page}`;
  }
  if (citation.volume != null) {
    return `${source} ${citation.volume}`;
  }
  if (citation.page != null) {
    return `${source} p.${citation.page}`;
  }

  return source;
}
