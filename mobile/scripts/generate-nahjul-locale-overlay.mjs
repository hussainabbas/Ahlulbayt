#!/usr/bin/env node
/**
 * Regenerate locale-overlay.ts from legacy entries + bundled sections (git 0294a88).
 * Usage: node scripts/generate-nahjul-locale-overlay.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'src', 'features', 'nahjul', 'data', 'bundled', 'locale-overlay.ts');
const LEGACY_COMMIT = '0294a88';

function nahjulId(category, number) {
  return `nb_${category}_${String(number).padStart(3, '0')}`;
}

function parseLegacyEntries(source) {
  const entries = [];
  const re =
    /\{\s*category:\s*'(\w+)',\s*number:\s*(\d+),\s*slug:\s*'([^']*(?:\\'[^']*)*)',\s*en:\s*'([^']*(?:\\'[^']*)*)',\s*ur:\s*'([^']*)',\s*ar:\s*'([^']*)',\s*subtitleEn:\s*'([^']*(?:\\'[^']*)*)',\s*subtitleUr:\s*'([^']*)',\s*excerptEn:\s*'([^']*(?:\\'[^']*)*)',\s*excerptUr:\s*'([^']*)',\s*themes:\s*\[([^\]]*)\]/g;

  for (const m of source.matchAll(re)) {
    const themes = m[11]
      .split(',')
      .map((t) => t.trim().replace(/^'|'$/g, ''))
      .filter(Boolean);
    entries.push({
      category: m[1],
      number: Number(m[2]),
      slug: m[3].replace(/\\'/g, "'"),
      en: m[4].replace(/\\'/g, "'"),
      ur: m[5],
      ar: m[6],
      subtitleEn: m[7].replace(/\\'/g, "'"),
      subtitleUr: m[8],
      excerptEn: m[9].replace(/\\'/g, "'"),
      excerptUr: m[10],
      themes,
    });
  }
  return entries;
}

function extractLegacyBundles(source) {
  const bundles = {};
  const bundleRe = /bundle\('(\w+)',\s*(\d+),\s*\[([\s\S]*?)\]\s*\)/g;
  for (const m of source.matchAll(bundleRe)) {
    const id = nahjulId(m[1], Number(m[2]));
    const sectionsBlock = m[3];
    const sections = [];
    const sectionRe =
      /\{\s*id:\s*'([^']+)',\s*title:\s*\{\s*en:\s*'([^']*(?:\\'[^']*)*)',\s*ur:\s*'([^']*)'\s*\},\s*arabic:\s*([^,]+?),\s*translations:\s*\{\s*en:\s*'([^']*(?:\\'[^']*)*)',\s*ur:\s*'([^']*)',\s*\}/gs;

    for (const s of sectionsBlock.matchAll(sectionRe)) {
      let arabic = s[4].trim();
      if (arabic.startsWith("'") || arabic.startsWith('"')) {
        arabic = eval(arabic); // legacy uses string concat
      }
      sections.push({
        id: s[1],
        title: { en: s[2].replace(/\\'/g, "'"), ur: s[3] },
        arabic,
        translations: { en: s[5].replace(/\\'/g, "'"), ur: s[6] },
      });
    }
    bundles[id] = sections;
  }

  const sayingRe =
    /\.\.\.\(\[([^\]]+)\] as const\)\.map\(\(n\) => \{[\s\S]*?return bundle\('saying', n, \[([\s\S]*?)\]\);\s*\}\)/;
  const sayingMatch = source.match(sayingRe);
  if (sayingMatch) {
    const nums = sayingMatch[1].split(',').map((n) => Number(n.trim()));
    const sectionRe =
      /\{\s*id:\s*'([^']+)',\s*title:\s*\{\s*en:\s*'([^']*)',\s*ur:\s*'([^']*)'\s*\},\s*arabic:\s*meta\.titles\.ar,\s*translations:\s*\{\s*en:\s*meta\.excerpt\.en,\s*ur:\s*meta\.excerpt\.ur,\s*\}/;
    const sectionMatch = sayingMatch[2].match(sectionRe);
    if (sectionMatch) {
      for (const n of nums) {
        const id = nahjulId('saying', n);
        bundles[id] = [
          {
            id: sectionMatch[1],
            title: { en: sectionMatch[2], ur: sectionMatch[3] },
            translations: { en: '__EXCERPT_EN__', ur: '__EXCERPT_UR__' },
            useExcerpt: true,
          },
        ];
      }
    }
  }

  return bundles;
}

function main() {
  const entriesSrc = execSync(
    `git -C "${path.resolve(ROOT, '..')}" show ${LEGACY_COMMIT}:mobile/src/features/nahjul/constants/entries.ts`,
    { encoding: 'utf8' },
  );
  const bundledSrc = execSync(
    `git -C "${path.resolve(ROOT, '..')}" show ${LEGACY_COMMIT}:mobile/src/features/nahjul/data/bundled/index.ts`,
    { encoding: 'utf8' },
  );

  const entries = parseLegacyEntries(entriesSrc);
  const sectionBundles = extractLegacyBundles(bundledSrc);

  const overlay = {};
  for (const e of entries) {
    const id = nahjulId(e.category, e.number);
    const meta = {
      titles: { en: e.en, ur: e.ur, ar: e.ar },
      subtitles: { en: e.subtitleEn, ur: e.subtitleUr },
      description: { en: e.en, ur: e.ur },
      excerpt: { en: e.excerptEn, ur: e.excerptUr },
      themes: e.themes,
    };

    const entry = { meta };
    const sections = sectionBundles[id];
    if (sections) {
      entry.sections = sections.map((s) => {
        if (s.useExcerpt) {
          return {
            id: s.id,
            kind: 'body',
            title: s.title,
            arabic: e.ar,
            translations: { en: e.excerptEn, ur: e.excerptUr },
          };
        }
        return {
          id: s.id,
          kind: 'body',
          title: s.title,
          arabic: s.arabic,
          translations: s.translations,
        };
      });
      entry.replaceSections = e.category === 'saying';
      if (!entry.replaceSections) {
        const ur = sections.map((s) => s.translations.ur).filter(Boolean).join('\n\n');
        if (ur) entry.firstBodyTranslation = { ur };
      }
    }

    overlay[id] = entry;
  }

  const header = `import type { NahjulId, NahjulSection, NahjulTranslationLayer } from '../../types';

export type NahjulLocaleOverlayEntry = {
  meta: {
    titles?: Partial<{ en: string; ur: string; ar: string }>;
    subtitles?: Partial<{ en: string; ur: string }>;
    description?: Partial<{ en: string; ur: string }>;
    excerpt?: Partial<{ en: string; ur: string }>;
    themes?: string[];
  };
  /** Full section list — used for sayings and stub entries */
  sections?: NahjulSection[];
  /** When true, overlay sections replace imported sections (preserving imported en when missing) */
  replaceSections?: boolean;
  /** Ur/Ar text for the first body section when imported has different section ids */
  firstBodyTranslation?: Partial<Record<NahjulTranslationLayer, string>>;
};

export const NAHJUL_LOCALE_OVERLAY: Partial<Record<NahjulId, NahjulLocaleOverlayEntry>> = `;

  fs.writeFileSync(OUT, header + JSON.stringify(overlay, null, 2) + ';\n', 'utf8');
  console.log(`Wrote ${OUT} (${entries.length} catalog entries, ${Object.keys(sectionBundles).length} section bundles)`);
}

main();
