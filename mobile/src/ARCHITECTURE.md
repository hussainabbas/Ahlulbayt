# Mobile Architecture

## Layers

```
┌─────────────────────────────────────────────┐
│  app/          Expo Router (routes only)    │
├─────────────────────────────────────────────┤
│  features/     Screens + feature logic      │
├─────────────────────────────────────────────┤
│  components/   Shared UI primitives         │
├─────────────────────────────────────────────┤
│  providers/    Cross-cutting React context  │
├─────────────────────────────────────────────┤
│  stores/       Zustand client state         │
├─────────────────────────────────────────────┤
│  core/         Framework-agnostic services  │
│    api/        HTTP client + endpoints    │
│    offline/    Network, Query, sync queue   │
│    errors/     AppError + normalization     │
│    logging/    Structured logger            │
│    storage/    MMKV wrappers                │
│    config/     Env + constants              │
├─────────────────────────────────────────────┤
│  theme/        Design tokens + provider     │
│  i18n/         Translations + RTL           │
└─────────────────────────────────────────────┘
```

## Data Flow

1. **UI** dispatches user actions
2. **TanStack Query** handles server fetch/mutations (`offlineFirst`)
3. **Zustand** persists settings/auth to MMKV
4. **syncQueue** buffers mutations when offline
5. **apiClient** attaches JWT, normalizes errors to `AppError`

## Navigation

| Route | Screen |
|-------|--------|
| `/(tabs)` | Main tab navigator |
| `/(tabs)/index` | Home |
| `/(tabs)/prayer` | Prayer |
| `/(tabs)/quran` | Quran |
| `/(tabs)/more` | More |
| `/settings` | Settings (stack) |

## Provider Order

`GestureHandlerRootView` → `QueryClientProvider` → `I18nextProvider` → `ThemeProvider` → App

## Adding a Feature

1. Create `src/features/{name}/screens/{Name}Screen.tsx`
2. Add route in `app/` if new route needed
3. Add API endpoints in `src/core/api/endpoints.ts`
4. Add translations in `src/i18n/locales/*.json`
