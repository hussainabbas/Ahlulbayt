#!/usr/bin/env node
/**
 * Import Ziyarat Ashura from duas.org (3-column Arabic / transliteration / English).
 * Usage: node scripts/import-ziyarat-ashura-duas-org.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE_URL = 'https://www.duas.org/ashura/z_ashura.htm';
const ALT_SOURCE_URL = 'https://www.duas.org/ziyarat-imam-hussain-ashura.html';
const CACHE = path.join(ROOT, 'data-sources', 'ziyarat', 'ashura-duas-org.htm');
const OUT = path.join(ROOT, 'src', 'features', 'ziyarat', 'data', 'bundled', 'ashura-imported.json');

/** Veranda transliteration font artifacts on duas.org */
const TRANSLIT_CHAR_MAP = {
  '¡': 'a',
  '¢': 'i',
  '£': 'u',
  '¤': 'a',
  '¥': 'sh',
  '¦': 'h',
  '§': 't',
  '¨': 'z',
  '©': 'kh',
  'ª': 'dh',
  '«': 'gh',
  '¬': 'f',
  '®': 'q',
  '¯': 'k',
  '°': 'l',
  '±': 'm',
  '²': 'n',
  '³': 'w',
  '´': 'r',
  'µ': 's',
  '¶': 'd',
  '·': 'b',
  '¸': 'j',
  '¹': 'h',
  'º': 'y',
  '»': "'",
  '¼': '(',
  '½': ')',
  '¾': '/',
  '¿': '?',
  '×': 'w',
  '÷': 'w',
  'Ø': 'dh',
  'Ù': 'u',
  'Ú': 'u',
  'Û': 'u',
  'Ü': 'u',
  'Ý': 'y',
  'Þ': 'th',
  'ß': 's',
  'à': 'a',
  'á': 'a',
  'â': 'a',
  'ã': 'a',
  'ä': 'a',
  'å': 'a',
  'æ': 'a',
  'ç': 's',
  'è': 'e',
  'é': 'e',
  'ê': 'e',
  'ë': 'e',
  'ì': 'i',
  'í': 'i',
  'î': 'i',
  'ï': 'i',
  'ð': 'dh',
  'ñ': 'n',
  'ò': 'o',
  'ó': 'o',
  'ô': 'o',
  'õ': 'o',
  'ö': 'o',
  'ø': 'o',
  'ù': 'u',
  'ú': 'u',
  'û': 'u',
  'ü': 'u',
  'ý': 'y',
  'þ': 'th',
  'ÿ': 'y',
};

const SECTION_TITLES = {
  bismillah: { en: 'Bismillah', ur: 'بسم اللہ' },
  opening: { en: 'Opening', ur: 'آغاز' },
  lament: { en: 'Lament', ur: 'نوحہ' },
  curses: { en: 'Curses upon Oppressors', ur: 'لعنت' },
  walayah: { en: 'Walayah & Testimony', ur: 'ولایت و گواہی' },
  laan_100: { en: '100× Laʿan', ur: '۱۰۰× لعنت' },
  salam_100: { en: '100× Salām', ur: '۱۰۰× سلام' },
  named_curses: { en: 'Named Curses', ur: 'نامزد لعنت' },
  prostration: { en: 'Prostration', ur: 'سجدہ' },
};

const NARRATION_EN =
  'Salih ibn Aqabah and Sayf ibn Umayrah reported that Alqamah ibn Muhammad al-Hadrami asked Imam al-Baqir (as) to teach him a prayer for the day of Ashura when visiting Imam al-Husayn (as), or when unable to visit and greeting from home. The Imam taught him this form of Ziyarat, saying that one who recites it receives the reward of the angels who visit Imam al-Husayn (as), is raised one hundred million ranks with the martyrs, and receives the reward of all visitors since the day of his martyrdom.';

const NARRATION_UR =
  'صالح بن عقبہ اور سیف بن امیہ سے روایت ہے کہ علقمہ بن محمد حضرمی نے امام باقرؑ سے یوم عاشور کو امام حسینؑ کی زیارت یا گھر سے سلام بھیجنے کی دعا سیکھی۔ امامؑ نے یہ زیارت عاشورہ سکھائی اور فرمایا کہ اسے پڑھنے والے کو فرشتوں کی زیارت کا ثواب، شہداء کے درجے میں اضافہ، اور شہادت کے دن سے تمام زائرین کا ثواب ملتا ہے۔';

const CITATIONS = [
  {
    source: 'Kamil al-Ziyarat',
    hadithNumber: 'Ziyarat Ashura',
    narrator: 'Salih ibn Aqabah → Imam al-Baqir (as) → Alqamah ibn Muhammad al-Hadrami',
    scholar: 'Shaykh Abbas Qummi',
    verified: true,
  },
  {
    source: 'Mafatih al-Jinan',
    page: 'Ziyarat Ashura',
    scholar: 'Shaykh Abbas Qummi',
    verified: true,
  },
];

const INSTRUCTIONS = {
  laan_100: {
    en: 'You may then repeat the following words one hundred times (in case of less time, recite only the last line 100 times).',
    ur: 'پھر درج ذیل کلمات سو مرتبہ پڑھیں (اگر وقت کم ہو تو صرف آخری سطر سو بار)۔',
  },
  salam_100: {
    en: 'You may then repeat the following words one hundred times (in case of less time, recite only the last four lines 100 times).',
    ur: 'پھر درج ذیل سلام سو مرتبہ پڑھیں (اگر وقت کم ہو تو صرف آخری چار سطریں سو بار)۔',
  },
  named_curses: {
    en: 'You may then say the following words.',
    ur: 'پھر درج ذیل کلمات پڑھیں۔',
  },
  prostration: {
    en: 'You may then prostrate yourself and say the following words meanwhile.',
    ur: 'پھر سجدہ کرتے ہوئے درج ذیل کلمات پڑھیں۔',
  },
};

/** Najaf font private-use glyphs on duas.org → standard Arabic */
const NAJAF_PUA_REPLACEMENTS = [
  [/ا\uE825/g, 'أُ'],
  [/ا\uE822/g, 'أ'],
  [/\uE824/g, 'أ'],
  [/\uE822/g, 'أ'],
  [/\uE825/g, 'أ'],
];

const BISMILLAH = {
  arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
  transliteration: 'bismillahi alrrahmani alrraheemi',
  english: 'In the name of Allah, the Most Merciful, the Most Compassionate',
};

async function loadSource() {
  if (fs.existsSync(CACHE)) {
    return fs.readFileSync(CACHE, 'latin1');
  }

  for (const url of [SOURCE_URL, ALT_SOURCE_URL]) {
    const res = await fetch(url);
    if (!res.ok) continue;
    const html = Buffer.from(await res.arrayBuffer()).toString('latin1');
    fs.mkdirSync(path.dirname(CACHE), { recursive: true });
    fs.writeFileSync(CACHE, html, 'latin1');
    return html;
  }

  throw new Error(`Failed to fetch Ziyarat Ashura source`);
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    // Najaf font: alef + PUA glyph → single hamza alef
    .replace(/&#1575;&#59445;/g, 'أُ')
    .replace(/&#1575;&#59442;/g, 'أ')
    .replace(/&#59445;/g, 'أ')
    .replace(/&#59444;/g, 'أ')
    .replace(/&#59442;/g, 'أ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z]+;/gi, ' ');
}

function normalizeHamzaSequences(text) {
  return text
    .replace(/اأُ/g, 'أُ')
    .replace(/اأ/g, 'أ')
    .replace(/[\uE800-\uF8FF]/g, '');
}

function stripHtml(html) {
  return normalizeHamzaSequences(
    decodeHtmlEntities(
      html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/[ \t\f\v]+/g, ' ')
        .replace(/\n[ \t]+/g, '\n'),
    ),
  )
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function isArabicRow(arabic) {
  const letters = arabic.replace(/[\s\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
  const arabicChars = letters.match(/[\u0600-\u06FF]/g);
  return arabicChars && arabicChars.length >= 6;
}

function extractMainTableHtml(html) {
  const tableMatch = html.match(
    /<table[^>]*class="MsoNormalTable"[^>]*dir="rtl"[\s\S]*?<\/table>/i,
  );
  if (tableMatch) {
    const slice = tableMatch[0];
    const endMarkers = ['`Alqamah added', 'Alqamah added', '2 Column Arabic'];
    let end = slice.length;
    for (const marker of endMarkers) {
      const idx = slice.indexOf(marker);
      if (idx >= 0 && idx < end) end = idx;
    }
    return slice.slice(0, end);
  }

  const startMarkers = [
    /&#1575;&#1614;&#1604;&#1587;&#1617;&#1614;&#1604;&#1575;&#1614;&#1605;/,
    /السَّلَامُ عَلَيْكَ يَا/,
    /اَلْسَّلَامُ عَلَيْكَ/,
    /alssal[a¡]mu `alayka/i,
  ];
  let start = -1;
  for (const re of startMarkers) {
    const idx = html.search(re);
    if (idx >= 0) {
      const trStart = html.lastIndexOf('<tr', idx);
      start = trStart >= 0 ? trStart : idx;
      break;
    }
  }
  if (start < 0) return html;

  const endMarkers = ['`Alqamah added', 'Alqamah added', '2 Column Arabic', '<hr'];
  let end = html.length;
  for (const marker of endMarkers) {
    const idx = html.indexOf(marker, start + 100);
    if (idx >= 0 && idx < end) end = idx;
  }

  return html.slice(start, end);
}

function parseHtmlTableRows(html) {
  const slice = extractMainTableHtml(html);
  const rows = [];
  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;

  while ((trMatch = trRe.exec(slice)) !== null) {
    const trHtml = trMatch[1];
    const cells = [];
    const tdRe = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let tdMatch;

    while ((tdMatch = tdRe.exec(trHtml)) !== null) {
      cells.push(stripHtml(tdMatch[1]));
    }

    if (cells.length < 3) continue;
    const [arabic, transliteration, english] = cells;
    if (!arabic || !english) continue;
    if (!isArabicRow(arabic)) continue;
    if (/^Commentary/i.test(english)) continue;

    rows.push({
      arabic: cleanArabic(arabic),
      transliteration: cleanTransliteration(transliteration ?? ''),
      english: cleanEnglish(english),
    });
  }

  return rows;
}

function parseMarkdownTableRow(line) {
  const pipe = line.match(/^\|(.+)\|$/);
  if (!pipe) return null;

  const cells = pipe[1].split('|').map((c) => c.trim());
  if (cells.length < 3) return null;
  if (cells.every((c) => /^-+$/.test(c))) return null;

  const [arabic, transliteration, english] = cells;
  if (!arabic || !english) return null;
  if (/^Commentary/i.test(arabic)) return null;

  return {
    arabic: cleanArabic(arabic),
    transliteration: cleanTransliteration(transliteration ?? ''),
    english: cleanEnglish(english),
  };
}

function extractTableRows(raw) {
  const htmlRows = parseHtmlTableRows(raw);
  if (htmlRows.length > 0) return htmlRows;

  const lines = raw.split(/\r?\n/);
  const mdRows = [];
  for (const line of lines) {
    const row = parseMarkdownTableRow(line.trim());
    if (row) mdRows.push(row);
  }
  return mdRows;
}

function flattenCellLines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function cleanArabic(text) {
  return flattenCellLines(
    normalizeHamzaSequences(text.replace(/[\u200B-\u200F\uFEFF]/g, '')),
  );
}

function cleanEnglish(text) {
  return flattenCellLines(
    text
      .replace(/\uFFFD/g, "'")
      .replace(/ï¿½/g, "'")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"'),
  );
}

function cleanTransliteration(text) {
  let out = text;
  for (const [from, to] of Object.entries(TRANSLIT_CHAR_MAP)) {
    out = out.split(from).join(to);
  }
  return flattenCellLines(
    out.replace(/`/g, "'"),
  );
}

function normalizePhraseRows(rows) {
  return rows
    .map((row) => ({
      arabic: cleanArabic(row.arabic),
      transliteration: cleanTransliteration(row.transliteration ?? ''),
      english: cleanEnglish(row.english),
    }))
    .filter((row) => row.arabic);
}

function toLine(row) {
  return {
    arabic: row.arabic,
    transliteration: row.transliteration || undefined,
    translations: { en: row.english },
  };
}

function parseTableRow(line) {
  return parseMarkdownTableRow(line);
}

function findRowIndex(rows, pattern, after = 0) {
  for (let i = after; i < rows.length; i++) {
    if (pattern.test(rows[i].arabic)) return i;
  }
  return rows.length;
}

function parseContent(raw) {
  const allRows = extractTableRows(raw);

  if (allRows.length === 0) {
    throw new Error('No table rows parsed — check source format');
  }

  const iLament = findRowIndex(allRows, /لَقَدْ عَظُمَتِ/);
  let iCurses = findRowIndex(allRows, /فَلَعَنَ ٱللَّهُ أُمَّةً|فَلَعَنَ ٱللَّهُ/);
  if (iCurses >= allRows.length) {
    const fallback = findRowIndex(allRows, /فَلَعَنَ/);
    if (fallback > iLament) iCurses = fallback;
  }
  const iWalayah = findRowIndex(allRows, /بِأبِي|بِأَبِي/);
  const iLaan = findRowIndex(allRows, /ٱلْعَنْ أوَّلَ|أَوَّلَ ظَالِمٍ/);
  const iSalam = findRowIndex(allRows, /السَّلَامُ عَلَيْكَ يَا أَبَا/, iLaan + 1);
  let iNamed = findRowIndex(allRows, /خُصَّ|خُصّ/);
  if (iNamed >= allRows.length) {
    const namedFallback = findRowIndex(
      allRows,
      /أَوَّلاً|اوَّلاً|ٱبْدَأْ|ابْدَأ/,
      iSalam + 1,
    );
    if (namedFallback < allRows.length) iNamed = namedFallback;
  }
  const iProstration = findRowIndex(allRows, /لَكَ ٱلْحَمْدُ/);

  const ranges = [
    ['opening', 0, iLament],
    ['lament', iLament, iCurses],
    ['curses', iCurses, iWalayah],
    ['walayah', iWalayah, iLaan],
    ['laan_100', iLaan, iSalam],
    ['salam_100', iSalam, iNamed],
    ['named_curses', iNamed, iProstration],
    ['prostration', iProstration, allRows.length],
  ];

  const buckets = new Map();
  for (const id of Object.keys(SECTION_TITLES)) {
    buckets.set(id, { rows: [], repeatCount: undefined, instruction: undefined });
  }

  for (const [id, start, end] of ranges) {
    if (start >= end) continue;
    buckets.get(id).rows = allRows.slice(start, end);
  }

  for (const [id, instr] of Object.entries(INSTRUCTIONS)) {
    const bucket = buckets.get(id);
    if (bucket?.rows.length) {
      bucket.instruction = instr;
      if (id === 'laan_100' || id === 'salam_100') bucket.repeatCount = 100;
    }
  }

  const sectionOrder = [
    'opening',
    'lament',
    'curses',
    'walayah',
    'laan_100',
    'salam_100',
    'named_curses',
    'prostration',
  ];

  const sections = sectionOrder.flatMap((id) => {
    const bucket = buckets.get(id);
    if (!bucket?.rows.length) return [];

    const phrases = normalizePhraseRows(bucket.rows);
    const sacred = id === 'opening' || id === 'salam_100';
    const chunkSize = bucket.repeatCount ? phrases.length : 4;

    const totalParts = Math.ceil(phrases.length / chunkSize);
    const parts = [];

    for (let i = 0; i < phrases.length; i += chunkSize) {
      const slice = phrases.slice(i, i + chunkSize);
      const partNum = Math.floor(i / chunkSize) + 1;
      const joined = joinRows(slice);

      parts.push({
        id: totalParts > 1 ? `${id}_${partNum}` : id,
        title:
          totalParts > 1
            ? {
                en: `${SECTION_TITLES[id].en} (${partNum}/${totalParts})`,
                ur: `${SECTION_TITLES[id].ur} (${partNum}/${totalParts})`,
              }
            : SECTION_TITLES[id],
        arabic: joined.arabic,
        transliteration: joined.transliteration || undefined,
        translations: { en: joined.english },
        lines: slice.map(toLine),
        sacred: sacred || undefined,
        repeatCount: partNum === 1 ? bucket.repeatCount : undefined,
        instruction: partNum === 1 ? bucket.instruction : undefined,
      });
    }

    return parts;
  });

  const bismillahRow = {
    arabic: BISMILLAH.arabic,
    transliteration: BISMILLAH.transliteration,
    english: BISMILLAH.english,
  };
  const bismillahSection = {
    id: 'bismillah',
    title: SECTION_TITLES.bismillah,
    arabic: bismillahRow.arabic,
    transliteration: bismillahRow.transliteration,
    translations: { en: bismillahRow.english },
    lines: [toLine(bismillahRow)],
    sacred: true,
  };

  return { narration: NARRATION_EN, sections: [bismillahSection, ...sections] };
}

function joinRows(rows) {
  return {
    arabic: rows.map((r) => r.arabic).join('\n'),
    transliteration: rows.map((r) => r.transliteration).filter(Boolean).join('\n'),
    english: rows.map((r) => r.english).join('\n'),
  };
}

function estimateMinutes(sections) {
  const baseWords = sections
    .filter((s) => !s.repeatCount)
    .flatMap((s) => s.translations.en?.split(/\s+/) ?? [])
    .filter(Boolean).length;

  const repeatBlocks = sections.filter((s) => s.repeatCount).length;

  return Math.max(22, Math.round(baseWords / 150) + repeatBlocks * 7);
}

async function main() {
  const raw = await loadSource();
  const { sections } = parseContent(raw);

  const output = {
    bundleVersion: 3,
    sourceUrl: SOURCE_URL,
    narration: { en: NARRATION_EN, ur: NARRATION_UR },
    citations: CITATIONS,
    sections,
    sectionCount: sections.length,
    estimatedMinutes: estimateMinutes(sections),
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(output, null, 2) + '\n', 'utf8');

  console.log('Ziyarat Ashura import complete');
  console.log(`  Sections: ${sections.length}`);
  console.log(`  Estimated minutes: ${output.estimatedMinutes}`);
  console.log(`  Output: ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
