# App icon source

Place your master artwork here (first match wins):

- `icon-source.svg` (recommended)
- `icon-source.png` (1024×1024)

Then run:

```bash
npm run generate:app-icons
```

**Important:** launcher icons are native assets. After generating, rebuild the app:

```bash
npx react-native run-android
# uninstall old app first if the icon still looks cached
```

Muharram uses a mourning-red overlay of your artwork; the default icon uses your file as-is.
