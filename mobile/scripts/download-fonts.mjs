#!/usr/bin/env node
/**
 * Downloads OFL fonts from google/fonts into assets/fonts/.
 * Static masters are fetched directly; variable masters are saved under the
 * output names expected by React Native asset linking.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.join(__dirname, '..');
const fontsDir = path.join(mobileRoot, 'assets', 'fonts');
const GITHUB_RAW = 'https://raw.githubusercontent.com/google/fonts/main';

/** @type {{ out: string; src: string }[]} */
const FONTS = [
  {
    out: 'ScheherazadeNew-Regular.ttf',
    src: 'ofl/scheherazadenew/ScheherazadeNew-Regular.ttf',
  },
  {
    out: 'ScheherazadeNew-Bold.ttf',
    src: 'ofl/scheherazadenew/ScheherazadeNew-Bold.ttf',
  },
  { out: 'Amiri-Regular.ttf', src: 'ofl/amiri/Amiri-Regular.ttf' },
  { out: 'Amiri-Bold.ttf', src: 'ofl/amiri/Amiri-Bold.ttf' },
  {
    out: 'NotoNaskhArabic-Regular.ttf',
    src: 'ofl/notonaskharabic/NotoNaskhArabic[wght].ttf',
  },
  {
    out: 'NotoNastaliqUrdu-Regular.ttf',
    src: 'ofl/notonastaliqurdu/NotoNastaliqUrdu[wght].ttf',
  },
  {
    out: 'Inter-Regular.ttf',
    src: 'ofl/inter/Inter[opsz,wght].ttf',
  },
  {
    out: 'Inter-Medium.ttf',
    src: 'ofl/inter/Inter[opsz,wght].ttf',
  },
  {
    out: 'Inter-SemiBold.ttf',
    src: 'ofl/inter/Inter[opsz,wght].ttf',
  },
];

fs.mkdirSync(fontsDir, { recursive: true });

/** @type {Map<string, Buffer>} */
const cache = new Map();

async function fetchFont(relativePath) {
  if (cache.has(relativePath)) {
    return cache.get(relativePath);
  }

  const url = `${GITHUB_RAW}/${relativePath.split('/').map(encodeURIComponent).join('/')}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  cache.set(relativePath, buffer);
  return buffer;
}

let downloaded = 0;

for (const { out, src } of FONTS) {
  const target = path.join(fontsDir, out);
  const data = await fetchFont(src);
  fs.writeFileSync(target, data);
  downloaded += 1;
  console.log(`[download-fonts] ${out} ← ${src}`);
}

console.log(`[download-fonts] Saved ${downloaded} font file(s) to assets/fonts/`);
