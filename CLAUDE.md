# English Together — Claude Code Instructions

## Project Overview
A React Native / Expo app (SDK 56, RN 0.85, React 19, TypeScript) that teaches English to adult learners.
Runs on phone, tablet, and web. Located at `C:\Repo\claude\EnglishTogether`.

## Architecture
- **Navigation**: state-based screen switch in `App.tsx` — no expo-router, no react-navigation.
- **Theme**: `src/theme.ts` — all design tokens live here. Import only from this file; never hardcode colors, spacing, or font sizes.
- **UI kit**: `src/components/UI.tsx` — reusable components built on the theme tokens.
- **Speech**: `src/speech/speech.ts` — TTS (auto-picks best voice) + STT (native: expo-speech-recognition; web: Web Speech API).
- **Progress/SRS**: `src/progress/store.ts` — Leitner spaced-repetition, persisted via AsyncStorage / localStorage.
- **Content**: `src/data/` — 100 items per mode, split into typed files (`listening.ts`, `speaking.ts`, `dialogs.ts`, `conversations.ts`, `scenes.ts`, `phrases.ts`).

## Design System — MANDATORY RULES

### 1. Always follow Material Design 3 (Material You)
All UI must conform to the [Material Design 3 specification](https://m3.material.io/).
- Use MD3 component patterns: Cards, Buttons, FABs, Navigation, Chips, Dialogs, Snackbars.
- Follow MD3 interaction states: enabled, hovered, focused, pressed, dragged, disabled.
- Apply the MD3 elevation model (tonal elevation via surface tints, not drop shadows).
- Use MD3 shape tokens (extraSmall 4dp → extraLarge 28dp) consistently.

### 2. Color — use semantic tokens ONLY
**Never** use a raw hex string or `colors.primary` inside a component.
Always import named tokens from `src/theme.ts`:

```ts
import { md } from "../theme";   // the single source of truth

// ✅ correct
backgroundColor: md.colors.primaryContainer
color: md.colors.onPrimaryContainer

// ❌ wrong
backgroundColor: "#0E7C66"
color: colors.primary
```

The complete token surface mirrors MD3 roles:
| Token | MD3 Role |
|---|---|
| `md.colors.primary` | Primary key color |
| `md.colors.onPrimary` | Text/icons on primary |
| `md.colors.primaryContainer` | Lower-emphasis primary fills |
| `md.colors.onPrimaryContainer` | Text/icons on primaryContainer |
| `md.colors.secondary` | Secondary key color |
| `md.colors.secondaryContainer` | Lower-emphasis secondary fills |
| `md.colors.onSecondaryContainer` | Text on secondaryContainer |
| `md.colors.tertiary` | Accent / amber |
| `md.colors.tertiaryContainer` | Amber container |
| `md.colors.onTertiaryContainer` | Text on amber container |
| `md.colors.error` | Error |
| `md.colors.errorContainer` | Error fill |
| `md.colors.onError` | Text on error |
| `md.colors.onErrorContainer` | Text on error container |
| `md.colors.surface` | Card/sheet backgrounds |
| `md.colors.surfaceVariant` | Chip/input backgrounds |
| `md.colors.onSurface` | Primary text |
| `md.colors.onSurfaceVariant` | Secondary/hint text |
| `md.colors.outline` | Borders, dividers |
| `md.colors.outlineVariant` | Subtle borders |
| `md.colors.background` | Page/screen background |
| `md.colors.onBackground` | Text on background |
| `md.colors.inverseSurface` | Snackbar backgrounds |
| `md.colors.inverseOnSurface` | Snackbar text |
| `md.colors.scrim` | Modal scrim |

### 3. Typography — use MD3 type scale
```ts
md.typescale.displayLarge    // 57sp — hero text only
md.typescale.displayMedium   // 45sp
md.typescale.headlineLarge   // 32sp — screen titles
md.typescale.headlineMedium  // 28sp
md.typescale.headlineSmall   // 24sp
md.typescale.titleLarge      // 22sp — card titles
md.typescale.titleMedium     // 16sp medium-weight labels
md.typescale.titleSmall      // 14sp
md.typescale.bodyLarge       // 16sp — body copy
md.typescale.bodyMedium      // 14sp
md.typescale.bodySmall       // 12sp
md.typescale.labelLarge      // 14sp — buttons
md.typescale.labelMedium     // 12sp — chips
md.typescale.labelSmall      // 11sp
```

### 4. Shape — use MD3 corner tokens
```ts
md.shape.extraSmall  // 4dp
md.shape.small       // 8dp
md.shape.medium      // 12dp
md.shape.large       // 16dp
md.shape.extraLarge  // 28dp
md.shape.full        // 9999dp (pill / circle)
```

### 5. Spacing — use the 4dp grid
All padding/margin/gap must be multiples of 4. Use `md.spacing.*`:
```ts
md.spacing.xs  = 4
md.spacing.sm  = 8
md.spacing.md  = 12
md.spacing.lg  = 16
md.spacing.xl  = 24
md.spacing.xxl = 32
md.spacing.xxxl = 48
```

### 6. Elevation — use MD3 tonal surface tints
Do NOT use `shadowColor`/`shadowRadius` for elevation.
Use `md.elevation.level0` through `level5` which provide the `backgroundColor` tint:
```ts
// level 0 = surface, level 1 = elevated card, level 2 = FAB, level 3 = dialog
backgroundColor: md.elevation.level1(md.colors.primary, md.colors.surface)
```

### 7. Theme switching
The theme object in `src/theme.ts` is the single source of truth.
To add dark mode or a color variant, change only that file — all components update automatically because they reference tokens, not raw values.

### 8. Touch targets
- Minimum touch target: **48×48dp** (MD3 requirement).
- Interactive elements must show a ripple/pressed state using `Pressable` + `android_ripple`.

### 9. Accessibility
- Every interactive element must have `accessibilityLabel`.
- Contrast ratio ≥ 4.5:1 for body text, ≥ 3:1 for large text (WCAG AA).
- All images need `accessibilityRole="image"` + `accessibilityLabel`.

### 10. Content
All learning content lives in `src/data/`. Add items there — never inside components.

## Running the app
```bash
npm run web        # browser (port 8083)
npm start          # Expo Go on phone/tablet
```

## Building APK
```powershell
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
npx expo prebuild --platform android --no-install --clean
cd android && .\gradlew.bat assembleRelease
adb install -r app\build\outputs\apk\release\app-release.apk
```

## Testing (Maestro)
```bash
# Maestro is at %USERPROFILE%\maestro\bin\maestro
maestro test .maestro/
```
