#!/usr/bin/env node
/**
 * Generates bundled worship simulator assets (SVG static/thumb + Lottie JSON).
 * Custom AhlulBayt+ art — no internet GIFs.
 *
 * Usage: node scripts/generate-worship-assets.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ASSETS_ROOT = path.join(ROOT, 'assets', 'sim');
const BUNDLE_TS = path.join(
  ROOT,
  'src',
  'features',
  'worship-simulator',
  'engine',
  'bundledSimAssets.ts',
);

const PALETTES = {
  light: {
    background: '#F4F1EA',
    figurePrimary: '#1B4332',
    figureSecondary: '#95B8A8',
    figureStroke: '#2D6A4F',
    accent: '#1B4332',
    water: '#5B9BD5',
    ground: '#E8E2D6',
  },
  dark: {
    background: '#1A1F1C',
    figurePrimary: '#95D5B2',
    figureSecondary: '#40916C',
    figureStroke: '#52B788',
    accent: '#95D5B2',
    water: '#64B5F6',
    ground: '#252B27',
  },
};

const CATALOG = [
  { domain: 'salah', slug: 'qiyam', key: 'sim/salah/qiyam', pose: 'standing' },
  { domain: 'salah', slug: 'qunoot', key: 'sim/salah/qunoot', pose: 'qunoot' },
  { domain: 'salah', slug: 'ruku', key: 'sim/salah/ruku', pose: 'ruku' },
  { domain: 'salah', slug: 'sujud', key: 'sim/salah/sujud', pose: 'sujud' },
  { domain: 'salah', slug: 'jalsa', key: 'sim/salah/jalsa', pose: 'jalsa' },
  { domain: 'salah', slug: 'tashahhud', key: 'sim/salah/tashahhud', pose: 'tashahhud' },
  { domain: 'salah', slug: 'completion', key: 'sim/salah/completion', pose: 'completion' },
  { domain: 'salah', slug: 'takbir', key: 'sim/salah/takbir', pose: 'takbir' },
  { domain: 'wudu', slug: 'face', key: 'sim/wudu/face', pose: 'wash_face' },
  { domain: 'wudu', slug: 'arm_right', key: 'sim/wudu/arm_right', pose: 'wash_arm_r' },
  { domain: 'wudu', slug: 'arm_left', key: 'sim/wudu/arm_left', pose: 'wash_arm_l' },
  { domain: 'wudu', slug: 'masah_head', key: 'sim/wudu/masah_head', pose: 'masah_head' },
  { domain: 'wudu', slug: 'masah_feet', key: 'sim/wudu/masah_feet', pose: 'masah_feet' },
  { domain: 'wudu', slug: 'hands', key: 'sim/wudu/hands', pose: 'wash_hands' },
  { domain: 'ghusl', slug: 'tartibi', key: 'sim/ghusl/tartibi', pose: 'ghusl_tartibi' },
  { domain: 'ghusl', slug: 'irtimasi', key: 'sim/ghusl/irtimasi', pose: 'ghusl_immersion' },
];

function poseSvg(palette, pose, thumb = false) {
  const w = thumb ? 80 : 200;
  const h = thumb ? 88 : 220;
  const cx = w / 2;
  const scale = thumb ? 0.4 : 1;
  const fig = (n) => n * scale;

  const presets = {
    standing: { rot: 0, ty: 0, arms: 'sides' },
    qunoot: { rot: 0, ty: 0, arms: 'raised' },
    takbir: { rot: 0, ty: 0, arms: 'raised' },
    ruku: { rot: 55, ty: fig(18), arms: 'knees' },
    sujud: { rot: 85, ty: fig(40), arms: 'floor' },
    jalsa: { rot: 0, ty: fig(24), arms: 'sides', sit: true },
    tashahhud: { rot: 0, ty: fig(26), arms: 'sides', sit: true },
    completion: { rot: 0, ty: 0, arms: 'sides', dots: true },
    wash_face: { rot: 0, ty: 0, arms: 'face', water: 'face' },
    wash_arm_r: { rot: 0, ty: 0, arms: 'arm_r', water: 'arm_r' },
    wash_arm_l: { rot: 0, ty: 0, arms: 'arm_l', water: 'arm_l' },
    masah_head: { rot: 0, ty: 0, arms: 'head', water: 'head' },
    masah_feet: { rot: 12, ty: fig(8), arms: 'feet', water: 'feet' },
    wash_hands: { rot: 0, ty: 0, arms: 'hands' },
    ghusl_tartibi: { rot: 0, ty: 0, arms: 'head', water: 'head' },
    ghusl_immersion: { rot: 0, ty: fig(10), arms: 'sides', water: 'immersion' },
  };
  const p = presets[pose] ?? presets.standing;
  const headY = fig(20) + (p.ty || 0);
  const torsoY = fig(48) + (p.ty || 0);

  let waterEl = '';
  if (p.water === 'face') {
    waterEl = `<ellipse cx="${cx}" cy="${headY}" rx="${fig(22)}" ry="${fig(18)}" fill="${palette.water}" opacity="0.5"/>`;
  } else if (p.water === 'arm_r') {
    waterEl = `<ellipse cx="${cx + fig(38)}" cy="${torsoY + fig(8)}" rx="${fig(12)}" ry="${fig(28)}" fill="${palette.water}" opacity="0.5"/>`;
  } else if (p.water === 'arm_l') {
    waterEl = `<ellipse cx="${cx - fig(38)}" cy="${torsoY + fig(8)}" rx="${fig(12)}" ry="${fig(28)}" fill="${palette.water}" opacity="0.5"/>`;
  } else if (p.water === 'head') {
    waterEl = `<ellipse cx="${cx}" cy="${headY - fig(6)}" rx="${fig(20)}" ry="${fig(8)}" fill="${palette.water}" opacity="0.45"/>`;
  } else if (p.water === 'feet') {
    waterEl = `<ellipse cx="${cx}" cy="${fig(170)}" rx="${fig(26)}" ry="${fig(8)}" fill="${palette.water}" opacity="0.45"/>`;
  } else if (p.water === 'immersion') {
    waterEl = `<ellipse cx="${cx}" cy="${torsoY + fig(40)}" rx="${fig(70)}" ry="${fig(50)}" fill="${palette.water}" opacity="0.45"/>`;
  }

  const legs = p.sit
    ? `<path d="M ${cx - fig(8)} ${fig(106)} Q ${cx - fig(28)} ${fig(124)} ${cx - fig(22)} ${fig(138)} L ${cx - fig(8)} ${fig(138)} Z" fill="${palette.figurePrimary}"/>
       <path d="M ${cx + fig(8)} ${fig(106)} Q ${cx + fig(28)} ${fig(124)} ${cx + fig(22)} ${fig(138)} L ${cx + fig(8)} ${fig(138)} Z" fill="${palette.figurePrimary}"/>`
    : `<line x1="${cx - fig(10)}" y1="${fig(106)}" x2="${cx - fig(14)}" y2="${fig(144)}" stroke="${palette.figurePrimary}" stroke-width="${fig(8)}" stroke-linecap="round"/>
       <line x1="${cx + fig(10)}" y1="${fig(106)}" x2="${cx + fig(14)}" y2="${fig(144)}" stroke="${palette.figurePrimary}" stroke-width="${fig(8)}" stroke-linecap="round"/>`;

  const dots = p.dots
    ? `<circle cx="${cx - fig(20)}" cy="${headY - fig(36)}" r="${fig(3)}" fill="${palette.accent}"/>
       <circle cx="${cx}" cy="${headY - fig(40)}" r="${fig(3)}" fill="${palette.accent}"/>
       <circle cx="${cx + fig(20)}" cy="${headY - fig(36)}" r="${fig(3)}" fill="${palette.accent}"/>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="100%" height="100%" fill="${palette.background}" rx="12"/>
  <ellipse cx="${cx}" cy="${h - fig(8)}" rx="${fig(58)}" ry="${fig(10)}" fill="${palette.ground}" opacity="0.8"/>
  ${waterEl}
  <g transform="rotate(${p.rot} ${cx} ${torsoY})">
    ${legs}
    <ellipse cx="${cx}" cy="${torsoY}" rx="${fig(16)}" ry="${fig(18)}" fill="${palette.figurePrimary}"/>
    <circle cx="${cx}" cy="${headY}" r="${fig(14)}" fill="${palette.figureSecondary}" stroke="${palette.figureStroke}" stroke-width="1.5"/>
    ${armsSvg(palette, p.arms, cx, torsoY, headY, fig)}
  </g>
  ${pose === 'sujud' ? `<rect x="${cx - fig(18)}" y="${headY + fig(18)}" width="${fig(36)}" height="${fig(4)}" rx="2" fill="${palette.ground}"/>` : ''}
  ${dots}
</svg>`;
}

function armsSvg(palette, type, cx, torsoY, headY, fig) {
  switch (type) {
    case 'raised':
      return `<line x1="${cx - fig(14)}" y1="${torsoY - fig(4)}" x2="${cx - fig(28)}" y2="${headY - fig(20)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>
              <line x1="${cx + fig(14)}" y1="${torsoY - fig(4)}" x2="${cx + fig(28)}" y2="${headY - fig(20)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>`;
    case 'knees':
      return `<line x1="${cx - fig(14)}" y1="${torsoY}" x2="${cx - fig(24)}" y2="${torsoY + fig(24)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>
              <line x1="${cx + fig(14)}" y1="${torsoY}" x2="${cx + fig(24)}" y2="${torsoY + fig(24)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>`;
    case 'floor':
      return `<line x1="${cx - fig(14)}" y1="${torsoY}" x2="${cx - fig(40)}" y2="${headY + fig(20)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>
              <line x1="${cx + fig(14)}" y1="${torsoY}" x2="${cx + fig(40)}" y2="${headY + fig(20)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>`;
    case 'face':
      return `<line x1="${cx - fig(14)}" y1="${torsoY - fig(4)}" x2="${cx - fig(24)}" y2="${headY - fig(4)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>
              <line x1="${cx + fig(14)}" y1="${torsoY - fig(4)}" x2="${cx + fig(24)}" y2="${headY - fig(4)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>`;
    case 'arm_r':
      return `<line x1="${cx + fig(14)}" y1="${torsoY - fig(4)}" x2="${cx + fig(36)}" y2="${headY + fig(8)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>`;
    case 'arm_l':
      return `<line x1="${cx - fig(14)}" y1="${torsoY - fig(4)}" x2="${cx - fig(36)}" y2="${headY + fig(8)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>`;
    case 'head':
      return `<line x1="${cx - fig(14)}" y1="${torsoY - fig(4)}" x2="${cx - fig(20)}" y2="${headY - fig(10)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>
              <line x1="${cx + fig(14)}" y1="${torsoY - fig(4)}" x2="${cx + fig(20)}" y2="${headY - fig(10)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>`;
    case 'feet':
      return `<line x1="${cx - fig(14)}" y1="${torsoY}" x2="${cx - fig(10)}" y2="${fig(120)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>
              <line x1="${cx + fig(14)}" y1="${torsoY}" x2="${cx + fig(10)}" y2="${fig(120)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>`;
    case 'hands':
      return `<line x1="${cx - fig(14)}" y1="${torsoY - fig(4)}" x2="${cx - fig(22)}" y2="${torsoY + fig(16)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>
              <line x1="${cx + fig(14)}" y1="${torsoY - fig(4)}" x2="${cx + fig(22)}" y2="${torsoY + fig(16)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>`;
    default:
      return `<line x1="${cx - fig(14)}" y1="${torsoY - fig(4)}" x2="${cx - fig(16)}" y2="${torsoY + fig(28)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>
              <line x1="${cx + fig(14)}" y1="${torsoY - fig(4)}" x2="${cx + fig(16)}" y2="${torsoY + fig(28)}" stroke="${palette.figurePrimary}" stroke-width="${fig(7)}" stroke-linecap="round"/>`;
  }
}

function lottieJson(palette, pose) {
  const color = palette.figurePrimary.replace('#', '');
  const r = parseInt(color.slice(0, 2), 16) / 255;
  const g = parseInt(color.slice(2, 4), 16) / 255;
  const b = parseInt(color.slice(4, 6), 16) / 255;
  const bob = pose === 'ruku' || pose === 'sujud' ? 12 : 6;
  return {
    v: '5.7.4',
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 220,
    nm: `AhlulBayt+ ${pose}`,
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: 'Figure',
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: {
            a: 1,
            k: [
              { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 0, s: [100, 110, 0] },
              { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 30, s: [100, 110 + bob, 0] },
              { t: 60, s: [100, 110, 0] },
            ],
          },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        shapes: [
          {
            ty: 'gr',
            it: [
              {
                ty: 'el',
                p: { a: 0, k: [0, 0] },
                s: { a: 0, k: [32, 36] },
                nm: 'Torso',
              },
              {
                ty: 'fl',
                c: { a: 0, k: [r, g, b, 1] },
                o: { a: 0, k: 100 },
                r: 1,
                nm: 'Fill',
              },
              { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: 'Transform' },
            ],
            nm: 'Body',
          },
        ],
        ip: 0,
        op: 60,
        st: 0,
        bm: 0,
      },
    ],
  };
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

const lottieRequires = [];
const riveNotes = [];

for (const entry of CATALOG) {
  for (const theme of ['light', 'dark']) {
    const palette = PALETTES[theme];
    const base = path.join(ASSETS_ROOT, entry.domain, entry.slug, theme);
    writeFile(path.join(base, 'static.svg'), poseSvg(palette, entry.pose));
    writeFile(path.join(base, 'thumb.svg'), poseSvg(palette, entry.pose, true));
    const lottiePath = path.join(base, 'anim.lottie.json');
    writeFile(lottiePath, JSON.stringify(lottieJson(palette, entry.pose), null, 2));
    const relFromEngine = path
      .relative(path.join(ROOT, 'src', 'features', 'worship-simulator', 'engine'), lottiePath)
      .replace(/\\/g, '/');
    lottieRequires.push(`  '${entry.key}:${theme}': require('./${relFromEngine}'),`);

    // Rive: placeholder spec for Rive Editor export (binary .riv added via CI)
    const riveSpec = {
      key: entry.key,
      theme,
      artboard: `${entry.slug}_${theme}`,
      animation: 'idle_loop',
      sourceSvg: `${entry.domain}/${entry.slug}/${theme}/static.svg`,
      note: 'Export from Rive Editor using static.svg as reference — no internet assets.',
    };
    writeFile(path.join(base, 'anim.rive.spec.json'), JSON.stringify(riveSpec, null, 2));
    riveNotes.push(`${entry.key} (${theme})`);
  }
}

writeFile(
  path.join(ASSETS_ROOT, 'manifest.json'),
  JSON.stringify(
    {
      version: 1,
      generator: 'generate-worship-assets.mjs',
      catalog: CATALOG,
      formats: ['static.svg', 'thumb.svg', 'anim.lottie.json', 'anim.rive.spec.json'],
      themes: ['light', 'dark'],
    },
    null,
    2,
  ),
);

const bundleSource = `/** AUTO-GENERATED — run: node scripts/generate-worship-assets.mjs */
import type { SimAssetTheme } from '../illustrations/catalog';

export type BundledLottieKey = \`\${string}:\${SimAssetTheme}\`;

export const BUNDLED_LOTTIE: Record<string, object> = {
${lottieRequires.join('\n')}
};
`;

writeFile(BUNDLE_TS, bundleSource);

console.log(`Generated ${CATALOG.length * 2 * 4} asset files under assets/sim/`);
console.log(`Rive specs: ${riveNotes.length} (export .riv from Rive Editor)`);
console.log(`Updated ${BUNDLE_TS}`);
