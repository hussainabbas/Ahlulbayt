#!/usr/bin/env node
/**
 * Validate bundled worship content (ziyarat, dua) — min sections, no ellipsis stubs, Arabic length.
 * Usage: node scripts/validate-worship-content.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const RULES = {
  ziyarat_ashura: {
    file: 'src/features/ziyarat/data/bundled/ashura-imported.json',
    minSections: 8,
    minArabicChars: 200,
    label: 'Ziyarat Ashura',
  },
};

function loadJson(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) {
    return { error: `Missing file: ${relPath}` };
  }
  return { data: JSON.parse(fs.readFileSync(full, 'utf8')) };
}

function hasEllipsisStub(text) {
  if (!text) return false;
  return /\.\.\.|…/.test(text) && /import pending|stub|placeholder/i.test(text);
}

function validateBundle(id, rule) {
  const loaded = loadJson(rule.file);
  if (loaded.error) {
    return { id, ok: false, errors: [loaded.error] };
  }

  const { sections = [] } = loaded.data;
  const errors = [];

  if (sections.length < rule.minSections) {
    errors.push(`Expected ≥${rule.minSections} sections, got ${sections.length}`);
  }

  for (const section of sections) {
    const arabicLen = (section.arabic ?? '').replace(/\s/g, '').length;
    if (arabicLen < rule.minArabicChars / rule.minSections) {
      errors.push(`Section "${section.id}" Arabic too short (${arabicLen} chars)`);
    }

    const en = section.translations?.en ?? '';
    if (hasEllipsisStub(en)) {
      errors.push(`Section "${section.id}" has stub ellipsis in English`);
    }
  }

  const totalArabic = sections.reduce((n, s) => n + (s.arabic ?? '').length, 0);
  if (totalArabic < rule.minArabicChars) {
    errors.push(`Total Arabic below threshold (${totalArabic} < ${rule.minArabicChars})`);
  }

  return { id, label: rule.label, ok: errors.length === 0, errors, sectionCount: sections.length };
}

function main() {
  const results = Object.entries(RULES).map(([id, rule]) => validateBundle(id, rule));
  let failed = 0;

  for (const r of results) {
    if (r.ok) {
      console.log(`✓ ${r.label}: ${r.sectionCount} sections`);
    } else {
      failed += 1;
      console.error(`✗ ${r.label}:`);
      for (const e of r.errors) console.error(`    - ${e}`);
    }
  }

  if (failed > 0) {
    console.error(`\n${failed} bundle(s) failed validation`);
    process.exit(1);
  }

  console.log('\nAll worship content checks passed');
}

main();
