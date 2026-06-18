import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const API_ROOT = join(__dirname, '..', '..');
export const REPO_ROOT = join(API_ROOT, '..');

export const QURAN_DATA_ROOT = join(API_ROOT, 'data', 'quran');
export const SOURCE_DIR = join(QURAN_DATA_ROOT, 'source');
export const BUNDLES_DIR = join(QURAN_DATA_ROOT, 'bundles');
export const MANIFEST_PATH = join(QURAN_DATA_ROOT, 'manifest.json');

export const MOBILE_GENERATED_DIR = join(
  REPO_ROOT,
  'mobile',
  'src',
  'features',
  'quran',
  'data',
  'bundled',
  'generated',
);

export const MOBILE_METADATA_PATH = join(
  REPO_ROOT,
  'mobile',
  'src',
  'features',
  'quran',
  'constants',
  'surahMetadata.ts',
);

export const TANZIL_DOWNLOAD_URL = 'https://tanzil.net/pub/download/index.php';
export const TANZIL_ATTRIBUTION = 'Tanzil.net Uthmani v1.1';
export const TANZIL_RAW_FILENAME = 'quran-uthmani.txt';
