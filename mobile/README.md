# AhlulBayt+ Mobile

Production React Native CLI app for the AhlulBayt+ Shia Islamic super app.

## Stack

- **React Native CLI** 0.85 / React 19
- **React Navigation** — stack + bottom tabs
- **TypeScript** — strict mode
- **Zustand** — persisted settings & auth (MMKV)
- **TanStack Query** — server state, offline-first
- **MMKV** — fast key-value storage
- **Reanimated + Gesture Handler** — animations & gestures
- **React Hook Form + Zod** — settings forms
- **i18next** — English, Arabic, Urdu (RTL)

## Native Modules

| Capability | Package |
|------------|---------|
| Navigation | `@react-navigation/*` |
| Notifications | `@notifee/react-native` |
| Location | `react-native-geolocation-service` |
| Localization | `react-native-localize` |
| Google Sign-In | `@react-native-google-signin/google-signin` |
| Apple Sign-In | `@invertase/react-native-apple-authentication` |
| Env config | `react-native-config` |
| Splash | `react-native-bootsplash` |
| Audio | `react-native-sound` |
| Gradients | `react-native-linear-gradient` |

## Project Structure

```
mobile/
├── index.js                # RN CLI entry
├── App.tsx                 # Root component
├── android/                # Native Android project
├── ios/                    # Native iOS project
├── src/
│   ├── navigation/         # React Navigation
│   ├── core/               # Config, API, native wrappers, storage
│   ├── features/           # Feature screens & services
│   ├── theme/              # Design tokens
│   └── i18n/               # Localization
├── .env.example            # Environment template
└── react-native.config.js
```

## Getting Started

```bash
cd mobile
cp .env.example .env
npm install
cd ios && pod install && cd ..   # macOS only
npm start
npm run android                # or npm run ios
```

## Environment

Configure via `.env` (loaded by `react-native-config`):

| Variable | Description |
|----------|-------------|
| `APP_ENV` | `development` \| `staging` \| `production` |
| `API_BASE_URL` | REST API base URL |
| `GOOGLE_WEB_CLIENT_ID` | Google OAuth web client ID |
| `GOOGLE_IOS_CLIENT_ID` | Google OAuth iOS client ID |
| `GOOGLE_ANDROID_CLIENT_ID` | Google OAuth Android client ID |

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Metro bundler |
| `npm run android` | Build & run on Android |
| `npm run ios` | Build & run on iOS |
| `npm run typecheck` | TypeScript check |

## Architecture Notes

- **Offline-first:** TanStack Query + NetInfo sync
- **Native wrappers:** `src/core/native/` abstracts platform APIs (no Expo)
- **RTL:** Arabic & Urdu toggle `I18nManager` on locale change
