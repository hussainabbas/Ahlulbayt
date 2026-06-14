# AhlulBayt+ Worship Animation Library

Custom Jafari fiqh illustrations for Prayer, Wudu, and Ghusl — **no internet GIFs**.

## Structure

```
assets/sim/
  manifest.json
  salah/{pose}/{light|dark}/
    static.svg          — static illustration
    thumb.svg           — thumbnail
    anim.lottie.json    — Lottie loop (generated)
    anim.rive.spec.json — Rive export spec (see below)
  wudu/...
  ghusl/...
```

## Runtime stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Primary | `react-native-svg` + Reanimated | Theme-aware animated figures |
| Overlay | `lottie-react-native` | Bundled custom Lottie loops |
| Future | Rive `.riv` | Export from Rive Editor using `static.svg` |

## Regenerate assets

```bash
npm run generate:worship-assets
```

Updates SVG/Lottie files and `src/features/worship-simulator/engine/bundledSimAssets.ts`.

## Rive export workflow

1. Open `static.svg` in [Rive Editor](https://rive.app).
2. Match artboard name from `anim.rive.spec.json` (e.g. `qiyam_light`).
3. Add idle loop animation aligned with Jafari posture.
4. Export as `anim.riv` beside the spec file.
5. Wire in `WorshipRiveLayer` when `.riv` files are present.

## Jafari reference

Postures follow Jafari fiqh (hands at sides in Qiyam, qunoot hands raised, masah for head/feet, tartibi vs irtimasi ghusl). See [ShiaNation namaz guide](https://shianation.com/namaz.html) for educational alignment.
