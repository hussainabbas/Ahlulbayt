import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, test } from 'node:test';

import {
  CANONICAL_AYAH_COUNTS,
  SURAH_COUNT,
  TOTAL_AYAHS,
  expectedAyahCount,
} from './canonical-ayah-counts.mjs';
import {
  describeMismatch,
  findEncodingIssue,
  juzOf,
  pageOf,
  parseTanzilMetadata,
  reconstructSourceText,
  splitBasmala,
} from './corpus-lib.mjs';
import { parseTanzilFile } from './parse-tanzil.mjs';
import { MOBILE_GENERATED_DIR, TANZIL_METADATA_PATH, TANZIL_RAW_PATH } from './paths.mjs';
import { validateCorpus } from './validate-quran-corpus.mjs';

test('canonical Hafs corpus has 114 surahs', () => {
  assert.equal(CANONICAL_AYAH_COUNTS.length, SURAH_COUNT);
});

test('canonical Hafs corpus totals 6236 ayahs', () => {
  assert.equal(TOTAL_AYAHS, 6236);
});

test('expectedAyahCount returns known surah sizes', () => {
  assert.equal(expectedAyahCount(1), 7);
  assert.equal(expectedAyahCount(2), 286);
  assert.equal(expectedAyahCount(114), 6);
  assert.equal(expectedAyahCount(0), undefined);
  assert.equal(expectedAyahCount(115), undefined);
});

test('the shipped corpus passes the full integrity gate', async () => {
  const result = await validateCorpus();
  assert.deepEqual(result.errors, []);
  assert.equal(result.summary.bundledSurahs, 114);
  assert.equal(result.summary.bundledAyahs, 6236);
});

test('Al-Fatiha 1:7 is bundled complete and identical to Tanzil', () => {
  const source = parseTanzilFile(TANZIL_RAW_PATH).get(1);
  const bundle = JSON.parse(readFileSync(join(MOBILE_GENERATED_DIR, 'surah-001.json'), 'utf8'));
  assert.equal(bundle.ayahs.length, 7);
  assert.equal(bundle.ayahs[6].arabic, source[6].text);
  assert.equal(bundle.ayahs[6].arabic.split(' ').length, 9);
  assert.equal(bundle.bismillah, undefined, 'the basmala is verse 1 of Al-Fatiha, not a prefix');
});

test('basmala is separated from verse 1 without altering the text', () => {
  const source = parseTanzilFile(TANZIL_RAW_PATH);
  for (let surah = 1; surah <= SURAH_COUNT; surah += 1) {
    const first = source.get(surah)[0];
    const split = splitBasmala(surah, 1, first.text);
    if (surah === 1 || surah === 9) {
      assert.equal(split.bismillah, null);
      assert.equal(split.text, first.text);
    } else {
      assert.ok(split.bismillah, `surah ${surah} should carry a basmala prefix`);
      assert.equal(
        reconstructSourceText({ bismillah: split.bismillah }, { ayah: 1, arabic: split.text }),
        first.text,
      );
    }
  }
});

test('juz, page and sajdah positions follow Tanzil metadata', () => {
  const meta = parseTanzilMetadata(readFileSync(TANZIL_METADATA_PATH, 'utf8'));
  assert.equal(juzOf(meta, 1, 1), 1);
  assert.equal(juzOf(meta, 2, 141), 1);
  assert.equal(juzOf(meta, 2, 142), 2);
  assert.equal(juzOf(meta, 78, 1), 30);
  assert.equal(juzOf(meta, 114, 6), 30);
  assert.equal(pageOf(meta, 1, 7), 1);
  assert.equal(pageOf(meta, 2, 1), 2);
  assert.equal(pageOf(meta, 114, 6), 604);
  assert.equal(meta.sajda.get('32:15'), 'obligatory');
});

test('mismatch descriptions distinguish truncation from modification', () => {
  assert.equal(describeMismatch('abc', 'abcdef').kind, 'TRUNCATED');
  assert.equal(describeMismatch('abcdefg', 'abcdef').kind, 'EXTRA_TEXT');
  assert.equal(describeMismatch('abXdef', 'abcdef').kind, 'MODIFIED');
});

test('encoding check rejects BOM, replacement characters and Latin text', () => {
  assert.equal(findEncodingIssue('بِسْمِ ٱللَّهِ'), null);
  assert.match(findEncodingIssue('بِسْمِ' + String.fromCodePoint(0xfeff) + 'ه'), /U\+FEFF/);
  assert.match(findEncodingIssue('بِسْمِ' + String.fromCodePoint(0xfffd)), /U\+FFFD/);
  assert.match(findEncodingIssue('بِسْمِ a'), /U\+0061/);
  assert.match(findEncodingIssue(' بِسْمِ'), /whitespace/);
});

// ── Tamper detection: every kind of corruption must fail the gate ─────────────

let workDir;
before(() => {
  workDir = mkdtempSync(join(tmpdir(), 'quran-gate-'));
});
after(() => {
  rmSync(workDir, { recursive: true, force: true });
});

async function validateTampered(name, surahFile, mutate) {
  const dir = join(workDir, name);
  cpSync(MOBILE_GENERATED_DIR, dir, { recursive: true });
  const path = join(dir, surahFile);
  const bundle = JSON.parse(readFileSync(path, 'utf8'));
  mutate(bundle);
  writeFileSync(path, `${JSON.stringify(bundle)}\n`, 'utf8');
  return validateCorpus({ dir });
}

const codes = (result) => new Set(result.errors.map((e) => e.code));

test('gate fails when a verse is truncated', async () => {
  const result = await validateTampered('truncated', 'surah-001.json', (b) => {
    b.ayahs[6].arabic = b.ayahs[6].arabic.split(' ').slice(0, 5).join(' ');
  });
  assert.equal(result.ok, false);
  assert.ok(codes(result).has('TRUNCATED'));
  assert.ok(result.errors.some((e) => e.ref === '1:7'));
});

test('gate fails when a single diacritic is changed', async () => {
  const result = await validateTampered('diacritic', 'surah-112.json', (b) => {
    b.ayahs[0].arabic = b.ayahs[0].arabic.replace('ُ', 'َ');
  });
  assert.equal(result.ok, false);
  assert.ok(codes(result).has('MODIFIED'));
  assert.ok(codes(result).has('BUNDLE_CHECKSUM'));
});

test('gate fails when a verse is missing', async () => {
  const result = await validateTampered('missing', 'surah-108.json', (b) => {
    b.ayahs.pop();
  });
  assert.equal(result.ok, false);
  assert.ok(codes(result).has('MISSING_AYAH'));
  assert.ok(codes(result).has('AYAH_COUNT'));
});

test('gate fails when a verse is duplicated', async () => {
  const result = await validateTampered('duplicate', 'surah-103.json', (b) => {
    b.ayahs.push({ ...b.ayahs[0] });
  });
  assert.equal(result.ok, false);
  assert.ok(codes(result).has('DUPLICATE_AYAH'));
});

test('gate fails when verses are re-ordered', async () => {
  const result = await validateTampered('order', 'surah-114.json', (b) => {
    [b.ayahs[0], b.ayahs[1]] = [b.ayahs[1], b.ayahs[0]];
  });
  assert.equal(result.ok, false);
  assert.ok(codes(result).has('AYAH_ORDER'));
});

test('gate fails when a surah file is absent', async () => {
  const dir = join(workDir, 'absent');
  cpSync(MOBILE_GENERATED_DIR, dir, { recursive: true });
  rmSync(join(dir, 'surah-050.json'));
  const result = await validateCorpus({ dir });
  assert.equal(result.ok, false);
  assert.ok(codes(result).has('BUNDLE_MISSING'));
});
