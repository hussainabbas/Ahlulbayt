import type { ZiyaratBundle, ZiyaratSection } from '../../types';
import { sanitizeDuasOrgArabic } from '@/core/arabic/sanitizeDuasOrgArabic';
import { ZIYARAT_CATALOG } from '../../constants/catalog';

import imported from './ashura-imported.json';

type ImportedAshura = {
  bundleVersion: number;
  sourceUrl?: string;
  narration?: { en: string; ur: string };
  citations?: ZiyaratBundle['meta']['citations'];
  sections: ZiyaratSection[];
  sectionCount: number;
  estimatedMinutes: number;
};

const data = imported as ImportedAshura;
const baseMeta = ZIYARAT_CATALOG.find((z) => z.id === 'ziyarat_ashura')!;

const meta = {
  ...baseMeta,
  sectionCount: data.sectionCount,
  estimatedMinutes: data.estimatedMinutes,
  sourceUrl: data.sourceUrl,
  narration: data.narration,
  citations: data.citations,
};

export const ZIYARAT_ASHURA: ZiyaratBundle = {
  meta,
  bundleVersion: data.bundleVersion,
  sections: data.sections.map((section) => ({
    ...section,
    arabic: sanitizeDuasOrgArabic(section.arabic),
    lines: section.lines?.map((line) => ({
      ...line,
      arabic: sanitizeDuasOrgArabic(line.arabic),
    })),
  })),
};
