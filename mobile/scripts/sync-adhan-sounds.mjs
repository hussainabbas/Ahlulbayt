#!/usr/bin/env node
/**
 * Copies registered adhan sounds from assets/ into native notification bundles.
 * Registry: app.config.ts → adhanSoundAssets
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.join(__dirname, '..');
const configPath = path.join(mobileRoot, 'app.config.ts');
const configSource = fs.readFileSync(configPath, 'utf8');

const assetPaths = [...configSource.matchAll(/assetPath:\s*'(\.\/assets\/sounds\/adhan\/[^']+)'/g)].map(
  (match) => match[1],
);

if (assetPaths.length === 0) {
  console.warn('[sync-adhan-sounds] No adhanSoundAssets found in app.config.ts');
  process.exit(0);
}

const androidRawDir = path.join(mobileRoot, 'android', 'app', 'src', 'main', 'res', 'raw');
const iosSoundsDir = path.join(mobileRoot, 'ios', 'AhlulBaytPlus', 'Sounds');

fs.mkdirSync(androidRawDir, { recursive: true });
fs.mkdirSync(iosSoundsDir, { recursive: true });

for (const assetPath of assetPaths) {
  const source = path.join(mobileRoot, assetPath.replace('./', ''));
  const fileName = path.basename(source);
  const baseName = fileName.replace(/\.wav$/i, '');

  if (!fs.existsSync(source)) {
    console.warn(`[sync-adhan-sounds] Missing source file: ${source}`);
    continue;
  }

  const androidTarget = path.join(androidRawDir, `${baseName}.wav`);
  const iosTarget = path.join(iosSoundsDir, fileName);

  fs.copyFileSync(source, androidTarget);
  fs.copyFileSync(source, iosTarget);

  console.log(`[sync-adhan-sounds] ${fileName} → android/res/raw & ios/AhlulBaytPlus/Sounds`);
}

console.log(`[sync-adhan-sounds] Synced ${assetPaths.length} sound(s).`);
