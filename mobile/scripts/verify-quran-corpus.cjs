#!/usr/bin/env node
/**
 * Runs the Quran integrity gate (api/scripts/quran/validate-quran-corpus.mjs)
 * against the bundles that ship in the app, and throws when it fails.
 *
 * Called from metro.config.js, so no JS bundle can be produced from a corpus
 * that differs from the pinned Tanzil text. There is deliberately no bypass.
 */
const {spawnSync} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const VALIDATOR = path.resolve(
  __dirname,
  '..',
  '..',
  'api',
  'scripts',
  'quran',
  'validate-quran-corpus.mjs',
);

let verified = false;

function assertQuranCorpusVerified() {
  if (verified) return;

  if (!fs.existsSync(VALIDATOR)) {
    throw new Error(
      `Quran integrity gate: validator not found at ${VALIDATOR}. ` +
        'Build the app from the full repository so the Quran text can be verified.',
    );
  }

  const result = spawnSync(process.execPath, [VALIDATOR, '--quiet'], {encoding: 'utf8'});
  if (result.status !== 0) {
    throw new Error(
      'Quran integrity gate FAILED — refusing to bundle the app.\n' +
        `${result.stderr || result.stdout || result.error || ''}\n` +
        'Restore the bundles with: cd api && npm run quran:build && npm run quran:validate',
    );
  }
  verified = true;
}

module.exports = {assertQuranCorpusVerified};

if (require.main === module) {
  assertQuranCorpusVerified();
  console.log('Quran corpus verified against the pinned Tanzil text.');
}
