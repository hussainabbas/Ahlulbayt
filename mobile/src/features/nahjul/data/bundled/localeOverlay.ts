import { NAHJUL_LOCALE_BY_ID } from '../../constants/entries';
import { NAHJUL_LOCALE_OVERLAY, type NahjulLocaleOverlayEntry } from './locale-overlay';
import type { NahjulId, NahjulMeta, NahjulSection } from '../../types';

function isEnglishDuplicate(localized: string | undefined, english: string): boolean {
  if (!localized?.trim()) return true;
  return localized.trim() === english.trim();
}

function isStubSection(section: NahjulSection): boolean {
  const en = section.translations.en ?? '';
  return en.includes('import pending') || section.id === 'toc-excerpt';
}

function hasOverlayBodyContent(overlay: NahjulLocaleOverlayEntry): boolean {
  if (overlay.firstBodyTranslation?.ur?.trim() || overlay.firstBodyTranslation?.ar?.trim()) {
    return true;
  }
  return Boolean(
    overlay.sections?.some(
      (s) => s.translations.ur?.trim() || s.translations.ar?.trim() || s.arabic?.trim(),
    ),
  );
}

function mergeSection(base: NahjulSection, patch: NahjulSection): NahjulSection {
  return {
    ...base,
    ...patch,
    title: patch.title ? { ...base.title, ...patch.title } : base.title,
    arabic: patch.arabic?.trim() || base.arabic,
    translations: {
      ...base.translations,
      ...Object.fromEntries(
        Object.entries(patch.translations).filter(([, value]) => value?.trim()),
      ),
    },
  };
}

function applyFirstBodyTranslation(
  sections: NahjulSection[],
  overlay?: NahjulLocaleOverlayEntry,
): NahjulSection[] {
  if (!overlay?.firstBodyTranslation) return sections;

  const idx = sections.findIndex((s) => s.kind !== 'commentary');
  if (idx < 0) return sections;

  const target = sections[idx]!;
  const extra = Object.fromEntries(
    Object.entries(overlay.firstBodyTranslation).filter(([, value]) => value?.trim()),
  );
  if (!Object.keys(extra).length) return sections;

  const next = [...sections];
  next[idx] = {
    ...target,
    translations: { ...target.translations, ...extra },
    arabic: target.arabic || overlay.sections?.[0]?.arabic,
    title: target.title ?? overlay.sections?.[0]?.title,
  };
  return next;
}

function mergeOverlaySections(
  imported: NahjulSection[],
  overlay: NahjulLocaleOverlayEntry,
): NahjulSection[] {
  if (!overlay.sections?.length) {
    return applyFirstBodyTranslation(imported, overlay);
  }

  const shouldReplace = overlay.replaceSections || imported.every(isStubSection);
  if (shouldReplace) {
    const replaced = overlay.sections.map((patch, index) => {
      const base = imported[index] ?? imported.find((s) => s.id === patch.id) ?? imported[0];
      if (!base) return patch;
      return mergeSection(base, patch);
    });
    return applyFirstBodyTranslation(replaced, overlay);
  }

  const patched = imported.map((section) => {
    const patch = overlay.sections!.find((s) => s.id === section.id);
    return patch ? mergeSection(section, patch) : section;
  });

  return applyFirstBodyTranslation(patched, overlay);
}

export function applyMetaLocaleOverlay(meta: NahjulMeta): NahjulMeta {
  const entry = NAHJUL_LOCALE_BY_ID.get(meta.id);
  const overlay = NAHJUL_LOCALE_OVERLAY[meta.id];
  if (!entry && !overlay) return meta;

  const merged: NahjulMeta = {
    ...meta,
    titles: entry
      ? {
          en: meta.titles.en || entry.en,
          ur: isEnglishDuplicate(meta.titles.ur, meta.titles.en) ? entry.ur : meta.titles.ur,
          ar: meta.titles.ar?.trim() ? meta.titles.ar : entry.ar,
        }
      : meta.titles,
    subtitles: entry
      ? {
          en: entry.subtitleEn || meta.subtitles.en,
          ur: entry.subtitleUr || meta.subtitles.ur,
        }
      : meta.subtitles,
    description: entry
      ? {
          en: meta.description.en || entry.en,
          ur: isEnglishDuplicate(meta.description.ur, meta.description.en)
            ? entry.ur
            : meta.description.ur,
        }
      : meta.description,
    excerpt: entry
      ? {
          en: entry.excerptEn || meta.excerpt.en,
          ur: isEnglishDuplicate(meta.excerpt.ur, meta.excerpt.en) ? entry.excerptUr : meta.excerpt.ur,
        }
      : meta.excerpt,
    themes: entry?.themes.length ? entry.themes : meta.themes,
    estimatedMinutes: entry?.minutes || meta.estimatedMinutes,
  };

  if (!merged.bundled && (entry?.excerptUr?.trim() || (overlay && hasOverlayBodyContent(overlay)))) {
    merged.bundled = true;
  }

  return merged;
}

export function applySectionLocaleOverlay(id: NahjulId, sections: NahjulSection[]): NahjulSection[] {
  const entry = NAHJUL_LOCALE_BY_ID.get(id);
  const overlay = NAHJUL_LOCALE_OVERLAY[id];

  if (overlay) {
    return mergeOverlaySections(sections, overlay);
  }

  if (!entry) return sections;

  if (entry.category === 'saying') {
    const stubOnly = sections.length === 0 || sections.every(isStubSection);
    if (stubOnly) {
      return [
        {
          id: 'quote-1',
          kind: 'body',
          title: { en: entry.en, ur: entry.ur, ar: entry.ar },
          arabic: entry.ar,
          translations: {
            en: entry.excerptEn,
            ur: entry.excerptUr,
          },
        },
      ];
    }
  }

  return sections.map((section) => ({
    ...section,
    title: {
      en: section.title?.en ?? entry.en,
      ur: section.title?.ur ?? entry.ur,
      ar: section.title?.ar ?? entry.ar,
    },
    arabic: section.arabic?.trim() ? section.arabic : entry.ar,
    translations: {
      ...section.translations,
      ur:
        section.translations.ur?.trim() &&
        !isEnglishDuplicate(section.translations.ur, section.translations.en ?? '')
          ? section.translations.ur
          : entry.category === 'saying'
            ? entry.excerptUr
            : section.translations.ur,
    },
  }));
}
