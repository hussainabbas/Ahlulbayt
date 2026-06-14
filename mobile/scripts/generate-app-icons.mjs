#!/usr/bin/env node
/**
 * Generates default + Muharram app icon sets for Android and iOS.
 *
 * Source (first match wins):
 *   assets/brand/icon-source.svg
 *   assets/brand/icon-source.png
 *   assets/brand/icon-source.jpg / .webp
 *
 * Usage: node scripts/generate-app-icons.mjs
 *
 * After running, rebuild the native app (icons are baked into the binary):
 *   npx react-native run-android
 *   npx react-native run-ios
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BRAND_DIR = path.join(ROOT, 'assets', 'brand');

const SOURCE_CANDIDATES = [
  'icon-source.svg',
  'icon-source.png',
  'icon-source.jpg',
  'icon-source.jpeg',
  'icon-source.webp',
];

const PALETTES = {
  default: {
    bg: '#F8F6F1',
    bgDeep: '#E8E4DC',
    accent: '#1F5C52',
    accentLight: '#3D9B8A',
    gold: '#B8956B',
    ring: '#1F5C52',
  },
  muharram: {
    bg: '#050506',
    bgDeep: '#0A0A0C',
    accent: '#8B4545',
    accentLight: '#A85555',
    gold: '#9A7A5A',
    ring: '#6B3030',
  },
};

const ANDROID_SIZES = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

const IOS_SIZES = [
  { name: 'Icon-20@2x.png', size: 40 },
  { name: 'Icon-20@3x.png', size: 60 },
  { name: 'Icon-29@2x.png', size: 58 },
  { name: 'Icon-29@3x.png', size: 87 },
  { name: 'Icon-40@2x.png', size: 80 },
  { name: 'Icon-40@3x.png', size: 120 },
  { name: 'Icon-60@2x.png', size: 120 },
  { name: 'Icon-60@3x.png', size: 180 },
  { name: 'Icon-1024.png', size: 1024 },
];

function resolveSourcePath() {
  for (const name of SOURCE_CANDIDATES) {
    const full = path.join(BRAND_DIR, name);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

function buildIconSvg(variant) {
  const p = PALETTES[variant];
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg}"/>
      <stop offset="100%" stop-color="${p.bgDeep}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${p.accentLight}"/>
      <stop offset="100%" stop-color="${p.accent}"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="224" fill="url(#bg)"/>
  <circle cx="512" cy="512" r="300" fill="none" stroke="${p.ring}" stroke-width="6" opacity="0.35"/>
  <path d="M512 268c-92 0-166 74-166 166 0 118 166 322 166 322s166-204 166-322c0-92-74-166-166-166z" fill="url(#accent)"/>
  <path d="M392 620 Q512 560 632 620 L632 700 Q512 660 392 700 Z" fill="url(#accent)" opacity="0.92"/>
  <path d="M620 360 a88 88 0 0 1 0 176 a72 72 0 0 0 0-144 a16 16 0 0 1 0-32z" fill="${p.gold}"/>
  <text x="512" y="860" text-anchor="middle" font-family="Georgia, serif" font-size="72" font-weight="700" fill="${p.accent}">A+</text>
</svg>`;
}

async function loadSharp() {
  try {
    const mod = await import('sharp');
    return mod.default;
  } catch {
    console.error('Install sharp: npm install --save-dev sharp');
    process.exit(1);
  }
}

async function rasterizeSource(sourcePath, size, background) {
  const sharp = await loadSharp();
  const isSvg = sourcePath.toLowerCase().endsWith('.svg');
  return sharp(sourcePath, isSvg ? { density: 288, unlimited: true } : undefined).resize(size, size, {
    fit: 'contain',
    background,
    withoutEnlargement: false,
  });
}

async function renderMaster(variant, sourcePath) {
  if (sourcePath && variant === 'default') {
    return rasterizeSource(sourcePath, 1024, PALETTES.default.bg);
  }

  if (sourcePath && variant === 'muharram') {
    const sharp = await loadSharp();
    const p = PALETTES.muharram;
    const baseBuffer = await (await rasterizeSource(sourcePath, 1024, p.bg)).png().toBuffer();
    const overlay = await sharp(
      Buffer.from(
        `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg"><rect width="1024" height="1024" fill="${p.accent}" opacity="0.38"/></svg>`,
      ),
    )
      .png()
      .toBuffer();
    const ring = await sharp(
      Buffer.from(
        `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg"><rect width="1024" height="1024" fill="${p.bg}" opacity="0.35"/><circle cx="512" cy="512" r="430" fill="none" stroke="${p.accentLight}" stroke-width="14" opacity="0.55"/></svg>`,
      ),
    )
      .png()
      .toBuffer();
    return sharp(baseBuffer).composite([
      { input: overlay, blend: 'multiply' },
      { input: ring, blend: 'over' },
    ]);
  }

  const sharp = await loadSharp();
  return sharp(Buffer.from(buildIconSvg(variant)));
}

async function writeAndroidIcons(variant, suffix, sourcePath) {
  const resRoot = path.join(ROOT, 'android', 'app', 'src', 'main', 'res');
  const sharp = await loadSharp();
  const masterBuffer = await (await renderMaster(variant, sourcePath)).png().toBuffer();
  const palette = variant === 'muharram' ? PALETTES.muharram : PALETTES.default;

  for (const [folder, size] of Object.entries(ANDROID_SIZES)) {
    const dir = path.join(resRoot, folder);
    fs.mkdirSync(dir, { recursive: true });
    const png = await sharp(masterBuffer).resize(size, size).png().toBuffer();
    fs.writeFileSync(path.join(dir, `ic_launcher${suffix}.png`), png);
    fs.writeFileSync(path.join(dir, `ic_launcher${suffix}_round.png`), png);
    fs.writeFileSync(path.join(dir, `ic_launcher${suffix}_foreground.png`), png);
  }

  if (suffix === '') {
    const colorsPath = path.join(resRoot, 'values', 'colors.xml');
    fs.mkdirSync(path.dirname(colorsPath), { recursive: true });
    fs.writeFileSync(
      colorsPath,
      `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n  <color name="ic_launcher_background">${palette.bg}</color>\n  <color name="ic_launcher_muharram_background">${PALETTES.muharram.bg}</color>\n</resources>\n`,
    );

    const anydpi = path.join(resRoot, 'mipmap-anydpi-v26');
    fs.mkdirSync(anydpi, { recursive: true });

    const adaptive = (name, fg, bg) => `<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n  <background android:drawable="@color/${bg}"/>\n  <foreground android:drawable="@mipmap/${fg}"/>\n</adaptive-icon>\n`;

    fs.writeFileSync(path.join(anydpi, 'ic_launcher.xml'), adaptive('ic_launcher', 'ic_launcher_foreground', 'ic_launcher_background'));
    fs.writeFileSync(
      path.join(anydpi, 'ic_launcher_round.xml'),
      adaptive('ic_launcher_round', 'ic_launcher_foreground', 'ic_launcher_background'),
    );
    fs.writeFileSync(
      path.join(anydpi, 'ic_launcher_muharram.xml'),
      adaptive('ic_launcher_muharram', 'ic_launcher_muharram_foreground', 'ic_launcher_muharram_background'),
    );
    fs.writeFileSync(
      path.join(anydpi, 'ic_launcher_muharram_round.xml'),
      adaptive('ic_launcher_muharram_round', 'ic_launcher_muharram_foreground', 'ic_launcher_muharram_background'),
    );
  }
}

function writeIosIconSet(setName, files) {
  const dir = path.join(ROOT, 'ios', 'AhlulBaytPlus', 'Images.xcassets', `${setName}.appiconset`);
  fs.mkdirSync(dir, { recursive: true });

  const images = [
    { size: '20x20', idiom: 'iphone', scale: '2x', filename: 'Icon-20@2x.png' },
    { size: '20x20', idiom: 'iphone', scale: '3x', filename: 'Icon-20@3x.png' },
    { size: '29x29', idiom: 'iphone', scale: '2x', filename: 'Icon-29@2x.png' },
    { size: '29x29', idiom: 'iphone', scale: '3x', filename: 'Icon-29@3x.png' },
    { size: '40x40', idiom: 'iphone', scale: '2x', filename: 'Icon-40@2x.png' },
    { size: '40x40', idiom: 'iphone', scale: '3x', filename: 'Icon-40@3x.png' },
    { size: '60x60', idiom: 'iphone', scale: '2x', filename: 'Icon-60@2x.png' },
    { size: '60x60', idiom: 'iphone', scale: '3x', filename: 'Icon-60@3x.png' },
    { size: '1024x1024', idiom: 'ios-marketing', scale: '1x', filename: 'Icon-1024.png' },
  ];

  for (const { name, buffer } of files) {
    fs.writeFileSync(path.join(dir, name), buffer);
  }

  fs.writeFileSync(
    path.join(dir, 'Contents.json'),
    JSON.stringify({ images, info: { author: 'generate-app-icons', version: 1 } }, null, 2),
  );
}

async function writeIosIcons(variant, setName, sourcePath) {
  const sharp = await loadSharp();
  const masterBuffer = await (await renderMaster(variant, sourcePath)).png().toBuffer();
  const files = [];
  for (const { name, size } of IOS_SIZES) {
    const buffer = await sharp(masterBuffer).resize(size, size).png().toBuffer();
    files.push({ name, buffer });
  }
  writeIosIconSet(setName, files);
}

async function main() {
  fs.mkdirSync(BRAND_DIR, { recursive: true });

  const sourcePath = resolveSourcePath();
  if (sourcePath) {
    console.log(`Using ${path.relative(ROOT, sourcePath)} as master artwork`);
  } else {
    console.log('No icon-source file — generating programmatic AhlulBayt+ icons');
  }

  await writeAndroidIcons('default', '', sourcePath);
  await writeAndroidIcons('muharram', '_muharram', sourcePath);
  await writeIosIcons('default', 'AppIcon', sourcePath);
  await writeIosIcons('muharram', 'Muharram', sourcePath);

  fs.writeFileSync(
    path.join(BRAND_DIR, 'README.md'),
    `# App icon source\n\nPlace your master artwork here (first match wins):\n\n- \`icon-source.svg\` (recommended)\n- \`icon-source.png\` (1024×1024)\n\nThen run:\n\n\`\`\`bash\nnpm run generate:app-icons\n\`\`\`\n\n**Important:** launcher icons are native assets. After generating, rebuild the app:\n\n\`\`\`bash\nnpx react-native run-android\n# uninstall old app first if the icon still looks cached\n\`\`\`\n\nMuharram uses a mourning-red overlay of your artwork; the default icon uses your file as-is.\n`,
  );

  console.log('Done — default + Muharram icons written for Android and iOS.');
  console.log('Rebuild the native app to see the new launcher icon.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
