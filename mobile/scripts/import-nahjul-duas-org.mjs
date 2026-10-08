#!/usr/bin/env node
/**
 * Import Nahjul Balagha English text from duas.org / Tahrike Tarsile Qur'an edition.
 * Usage: node scripts/import-nahjul-duas-org.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'data-sources', 'nahjul', 'duas-org-edition.txt');
const OUT = path.join(ROOT, 'src', 'features', 'nahjul', 'data', 'bundled', 'nahjul-imported.json');

const SOURCE_META = {
  title: 'Nahjul Balagha — Peak of Eloquence',
  url: 'https://www.duas.org/pdfs/Nahjul-Balagha.pdf',
  edition: "Tahrike Tarsile Qur'an, 7th U.S. Edition (2009), Mutahhari commentary",
  attribution:
    'English translation edited by Yasin T. Al-Jibouri; commentary by Martyr Ayatollah Murtada Mutahhari',
};

const PAGE_MARKER = /^(?:[ivxlcdm]+|\d+)$/i;
const ROMAN_ONLY = /^[ivxlcdm]+$/i;
const SERMON_HEADER = /^Sermon\s+(\d+)\s*(.*)$/i;
const LETTER_HEADER =
  /^(?:Document of Instruction|Document|Instruction|Commandment|Will|Letter)\s+(\d+)\s*(.*)$/i;
const PART_HEADER = /^Part\s+(?:Eight|Nine|Ten|Eleven)\b/i;
const BODY_PART_START = /^##### Part Eight\b/m;

function slugify(text) {
  return (
    text
      .toLowerCase()
      .replace(/[''`]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 72) || 'entry'
  );
}

function nahjulId(category, number) {
  return `nb_${category}_${String(number).padStart(3, '0')}`;
}

function hasPageRef(text) {
  return /\.\.\.\s*\d+\s*$/.test(text.trim());
}

function cleanTocTitle(raw) {
  return raw
    .replace(/\s*\.\.\.\s*\d+\s*$/, '')
    .replace(/\s*…+\s*\d*\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function fallbackTitle(category, number, rawTitle) {
  const cleaned = cleanTocTitle(rawTitle);
  if (cleaned && cleaned !== '...' && cleaned.length > 3) return cleaned;
  const label = category === 'sermon' ? 'Sermon' : category === 'letter' ? 'Letter' : 'Saying';
  return `${label} ${number}`;
}

function isTocNoise(line) {
  const t = line.trim();
  if (!t) return true;
  if (PAGE_MARKER.test(t)) return true;
  if (/^Contents$/i.test(t)) return true;
  if (PART_HEADER.test(t)) return true;
  if (/^Nahjul[- ]Balagha/i.test(t) && t.length < 120) return true;
  if (/^Selected (?:Sermons|Writings|Sayings)/i.test(t)) return true;
  if (/^His Letters/i.test(t)) return true;
  if (/^Including His/i.test(t)) return true;
  if (/^Companions$/i.test(t)) return true;
  if (/^Purposes\s*\.\.\./i.test(t)) return true;
  return false;
}

function parseToc(lines) {
  const tocStart = lines.findIndex((l) => /^Part Eight\s*$/i.test(l.trim()) || /Part Eight\s*\n/.test(l));
  const tocRegionStart = lines.findIndex((l, i) => i > 200 && SERMON_HEADER.test(l.trim()));
  const partEleven = lines.findIndex((l) => /^Part Eleven\s*$/i.test(l.trim()));

  const tocLines = lines.slice(tocRegionStart, partEleven > 0 ? partEleven : tocRegionStart + 800);

  const sermons = new Map();
  const letters = new Map();
  const sayings = [];

  let section = 'sermon';
  let current = null;

  function flush() {
    if (!current) return;
    const joined = current.parts.join(' ');
    const title = fallbackTitle(section, current.number, joined);
    const entry = { number: current.number, title };
    if (section === 'sermon') sermons.set(current.number, entry);
    else if (section === 'letter') letters.set(current.number, entry);
    current = null;
  }

  for (const raw of tocLines) {
    const line = raw.trim();
    if (/^Part Nine\s*$/i.test(line)) {
      flush();
      section = 'letter';
      continue;
    }
    if (/^Part Ten\s*$/i.test(line)) {
      flush();
      section = 'saying';
      continue;
    }
    if (isTocNoise(line)) continue;

    const sermonMatch = line.match(SERMON_HEADER);
    if (section === 'sermon' && sermonMatch) {
      flush();
      current = { number: Number(sermonMatch[1]), parts: [sermonMatch[2] || ''] };
      continue;
    }

    const letterMatch = line.match(LETTER_HEADER);
    if (section === 'letter' && letterMatch) {
      flush();
      current = { number: Number(letterMatch[1]), parts: [letterMatch[2] || ''] };
      continue;
    }

    if (section === 'saying') {
      if (
        line.length > 8 &&
        /^[A-Z(]/.test(line) &&
        !/^Selections/i.test(line) &&
        !/^Including His/i.test(line) &&
        !/^Purposes/i.test(line)
      ) {
        const title = cleanTocTitle(line);
        if (title) {
          sayings.push({ number: sayings.length + 1, title });
        }
      }
      continue;
    }

    if (current) {
      const merged = current.parts.join(' ');
      if (hasPageRef(merged) && hasPageRef(line)) {
        continue;
      }
      current.parts.push(line);
    }
  }
  flush();

  return { sermons, letters, sayings };
}

function isPageNumberLine(line) {
  const t = line.trim();
  return /^\d{2,4}$/.test(t);
}

function isCommentaryStart(line) {
  const t = line.trim();
  if (/Sayyid ar-Radi says/i.test(t)) return true;
  if (/Ash-Sharif ar-Radi says/i.test(t)) return true;
  if (/^ar-Radi says/i.test(t)) return true;
  if (/^\d{1,3}[A-Z]/.test(t)) return true;
  return false;
}

function parseSermonBodies(lines) {
  const startIdx = lines.findIndex((l) => BODY_PART_START.test(l));
  const bodyLines = lines.slice(startIdx >= 0 ? startIdx : 3880);
  const text = bodyLines.join('\n');

  const sermons = new Map();
  const headerRe = /^Sermon (\d+)\s*$/gm;
  const matches = [...text.matchAll(headerRe)];

  for (let i = 0; i < matches.length; i++) {
    const num = Number(matches[i][1]);
    const chunkStart = matches[i].index + matches[i][0].length;
    const chunkEnd = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const chunk = text.slice(chunkStart, chunkEnd).trim();
    sermons.set(num, parseSermonChunk(chunk, num));
  }

  return sermons;
}

function parseSermonChunk(chunk, sermonNum) {
  const rawLines = chunk.split('\n').map((l) => l.trim()).filter(Boolean);
  const lines = rawLines.filter((l) => !isPageNumberLine(l));

  let intro = '';
  let idx = 0;

  if (lines[0] && lines[0].length < 220 && /^[A-Z]/.test(lines[0]) && !isCommentaryStart(lines[0])) {
    const first = lines[0];
    const looksIntro =
      /^(In this|Delivered|Known as|When |About |Also |Amir |Imam |During |This sermon)/i.test(first) ||
      first.endsWith(':');
    if (looksIntro) {
      intro = first;
      idx = 1;
    }
  }

  const sections = [];
  let sectionIdx = 0;
  let currentKind = 'body';
  let buffer = [];

  function pushSection(kind, title) {
    const text = buffer.join(' ').replace(/\s+/g, ' ').trim();
    buffer = [];
    if (!text) return;
    sectionIdx += 1;
    sections.push({
      id: `${kind}-${sectionIdx}`,
      kind,
      title: title ? { en: title } : undefined,
      translations: { en: text },
    });
  }

  if (intro) {
    buffer = [intro];
    pushSection('body', undefined);
  }

  for (; idx < lines.length; idx++) {
    const line = lines[idx];

    if (isCommentaryStart(line)) {
      pushSection(currentKind, undefined);
      currentKind = 'commentary';
      buffer = [line.replace(/^\d{1,3}/, '').trim() || line];
      continue;
    }

    if (/^\d{1,3}$/.test(line) && idx + 1 < lines.length && /^[A-Z\d]/.test(lines[idx + 1])) {
      pushSection(currentKind, undefined);
      currentKind = 'commentary';
      idx += 1;
      buffer = [lines[idx]];
      continue;
    }

    buffer.push(line);
  }

  pushSection(currentKind, undefined);

  if (sections.length === 0) {
    sections.push({
      id: 'body-1',
      kind: 'body',
      translations: { en: '' },
    });
  }

  return sections;
}

function excerptFromSections(sections, fallbackTitle) {
  const body = sections.find((s) => s.kind !== 'commentary')?.translations?.en ?? '';
  const text = body || fallbackTitle;
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= 200) return clean;
  return `${clean.slice(0, 197)}…`;
}

function estimateMinutes(sections) {
  const words = sections
    .filter((s) => s.kind !== 'commentary')
    .map((s) => s.translations.en)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

function buildCatalog({ sermons, letters, sayings }, bundles) {
  const catalog = [];

  for (let n = 1; n <= 239; n++) {
    const toc = sermons.get(n);
    const title = toc?.title ?? fallbackTitle('sermon', n, '');
    const id = nahjulId('sermon', n);
    const sections = bundles[id]?.sections ?? [];
    const bundled = sections.some((s) => (s.translations?.en?.length ?? 0) > 80);
    catalog.push({
      id,
      number: n,
      slug: `${slugify(title)}-${n}`,
      category: 'sermon',
      titles: { en: title, ur: '', ar: '' },
      subtitles: { en: '', ur: '' },
      description: { en: title, ur: '' },
      themes: [],
      excerpt: {
        en: bundled ? excerptFromSections(sections, title) : title,
        ur: '',
      },
      sectionCount: sections.length || 1,
      estimatedMinutes: bundled ? estimateMinutes(sections) : 5,
      hasAudio: false,
      bundled,
    });
  }

  for (let n = 1; n <= 79; n++) {
    const toc = letters.get(n);
    const title = toc?.title ?? fallbackTitle('letter', n, '');
    const id = nahjulId('letter', n);
    const sections = bundles[id]?.sections ?? [];
    const bundled = sections.some((s) => (s.translations?.en?.length ?? 0) > 80);
    catalog.push({
      id,
      number: n,
      slug: `${slugify(title)}-${n}`,
      category: 'letter',
      titles: { en: title, ur: '', ar: '' },
      subtitles: { en: '', ur: '' },
      description: { en: title, ur: '' },
      themes: [],
      excerpt: {
        en: bundled ? excerptFromSections(sections, title) : title,
        ur: '',
      },
      sectionCount: sections.length || 1,
      estimatedMinutes: bundled ? estimateMinutes(sections) : 5,
      hasAudio: false,
      bundled,
    });
  }

  for (const s of sayings) {
    const id = nahjulId('saying', s.number);
    const sections = bundles[id]?.sections ?? [];
    const bundled = sections.some((sct) => (sct.translations?.en?.length ?? 0) > 40);
    catalog.push({
      id,
      number: s.number,
      slug: slugify(s.title),
      category: 'saying',
      titles: { en: s.title, ur: '', ar: '' },
      subtitles: { en: '', ur: '' },
      description: { en: s.title, ur: '' },
      themes: [],
      excerpt: {
        en: bundled ? excerptFromSections(sections, s.title) : s.title,
        ur: '',
      },
      sectionCount: sections.length || 1,
      estimatedMinutes: bundled ? estimateMinutes(sections) : 1,
      hasAudio: false,
      bundled,
    });
  }

  return catalog;
}

function buildStubSections(title) {
  return [
    {
      id: 'toc-excerpt',
      kind: 'body',
      title: { en: title },
      translations: {
        en: `${title}\n\nFull text from Nahjul Balagha — import pending.`,
      },
    },
  ];
}

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`Source not found: ${SOURCE}`);
    process.exit(1);
  }

  const lines = fs.readFileSync(SOURCE, 'utf8').split(/\r?\n/);
  const { sermons, letters, sayings } = parseToc(lines);
  const sermonBodies = parseSermonBodies(lines);

  const bundles = {};

  for (const [num, sections] of sermonBodies) {
    const id = nahjulId('sermon', num);
    bundles[id] = {
      bundleVersion: 2,
      source: SOURCE_META,
      sections,
    };
  }

  const catalog = buildCatalog({ sermons, letters, sayings }, bundles);

  for (const meta of catalog) {
    const sections = bundles[meta.id]?.sections ?? [];
    if (meta.number === 1 && meta.category === 'sermon' && meta.bundled) {
      meta.titles.en = 'About the Creation of the World';
      meta.slug = slugify(meta.titles.en) + '-1';
    }
    if (meta.number === 53 && meta.category === 'letter') {
      meta.titles.en = 'To Malik al-Ashtar (Governor of Egypt)';
      meta.slug = slugify('malik-al-ashtar') + '-53';
    }
  }

  for (const meta of catalog) {
    if (!bundles[meta.id] && meta.bundled) {
      meta.bundled = false;
    }
    if (!bundles[meta.id]) {
      bundles[meta.id] = {
        bundleVersion: 2,
        source: SOURCE_META,
        sections: buildStubSections(meta.titles.en),
      };
    }
  }

  const output = {
    source: SOURCE_META,
    catalog,
    bundles,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(output, null, 2) + '\n', 'utf8');

  const sermonBundled = catalog.filter((c) => c.category === 'sermon' && c.bundled).length;
  const letterBundled = catalog.filter((c) => c.category === 'letter' && c.bundled).length;
  const sayingBundled = catalog.filter((c) => c.category === 'saying' && c.bundled).length;

  console.log('Nahjul import complete');
  console.log(`  Sermons in catalog: ${catalog.filter((c) => c.category === 'sermon').length} (${sermonBundled} with full text)`);
  console.log(`  Letters in catalog: ${catalog.filter((c) => c.category === 'letter').length} (${letterBundled} with full text)`);
  console.log(`  Sayings in catalog: ${catalog.filter((c) => c.category === 'saying').length} (${sayingBundled} with full text)`);
  console.log(`  TOC parsed: ${sermons.size} sermon titles, ${letters.size} letter titles, ${sayings.length} saying sections`);
  console.log(`  Output: ${OUT}`);
}

main();
