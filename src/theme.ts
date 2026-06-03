/**
 * Material Design 3 (Material You) design tokens for English Together.
 *
 * RULE: Never use raw hex strings in components.
 *       Always import `md` from this file and reference md.colors.*, md.typescale.*, etc.
 *       Changing the seed color here cascades through the entire app.
 */

import { Dimensions, Platform } from "react-native";

/* ─────────────────────────────────────────────────────────────
   SEED  — change this one color to re-theme the entire app
   ───────────────────────────────────────────────────────────── */
const SEED_PRIMARY   = "#0E7C66"; // teal-green
const SEED_SECONDARY = "#4E8D7C"; // muted teal
const SEED_TERTIARY  = "#E8A13A"; // warm amber accent

/* ─────────────────────────────────────────────────────────────
   MD3 COLOR ROLES  (light scheme)
   ───────────────────────────────────────────────────────────── */
export const mdColors = {
  /* --- Primary --- */
  primary:            "#0E7C66",
  onPrimary:          "#FFFFFF",
  primaryContainer:   "#B2F2E0",
  onPrimaryContainer: "#00201A",

  /* --- Secondary --- */
  secondary:            "#4E8D7C",
  onSecondary:          "#FFFFFF",
  secondaryContainer:   "#CDEEE5",
  onSecondaryContainer: "#06201A",

  /* --- Tertiary (amber accent) --- */
  tertiary:            "#895D00",
  onTertiary:          "#FFFFFF",
  tertiaryContainer:   "#FFDEA5",
  onTertiaryContainer: "#2C1B00",

  /* --- Error --- */
  error:            "#BA1A1A",
  onError:          "#FFFFFF",
  errorContainer:   "#FFDAD6",
  onErrorContainer: "#410002",

  /* --- Success (non-standard MD3, added for feedback states) --- */
  success:            "#1F8A4C",
  onSuccess:          "#FFFFFF",
  successContainer:   "#B8F0CD",
  onSuccessContainer: "#00210F",

  /* --- Surfaces --- */
  background:       "#F4F1EA",  // warm off-white page bg
  onBackground:     "#1E2A2A",
  surface:          "#FFFFFF",
  onSurface:        "#1E2A2A",
  surfaceVariant:   "#DBE5E2",
  onSurfaceVariant: "#3F4947",
  surfaceTint:      "#0E7C66",

  /* --- Outlines --- */
  outline:        "#6F7977",
  outlineVariant: "#BEC9C6",

  /* --- Inverse (snackbars, toasts) --- */
  inverseSurface:   "#2E3130",
  inverseOnSurface: "#EFF1EF",
  inversePrimary:   "#7FDCC5",

  /* --- Scrim & shadow --- */
  scrim:  "rgba(0,0,0,0.32)",
  shadow: "#000000",
};

/* ─────────────────────────────────────────────────────────────
   MD3 TYPESCALE
   lineHeight = fontSize × 1.4 by default (override per token)
   ───────────────────────────────────────────────────────────── */
function scaled(base: number): number {
  return isLargeScreen() ? Math.round(base * 1.15) : base;
}

export const mdTypescale = {
  displayLarge:   { fontSize: scaled(57), lineHeight: scaled(64), fontWeight: "400" as const, letterSpacing: -0.25 },
  displayMedium:  { fontSize: scaled(45), lineHeight: scaled(52), fontWeight: "400" as const, letterSpacing: 0 },
  displaySmall:   { fontSize: scaled(36), lineHeight: scaled(44), fontWeight: "400" as const, letterSpacing: 0 },
  headlineLarge:  { fontSize: scaled(32), lineHeight: scaled(40), fontWeight: "700" as const, letterSpacing: 0 },
  headlineMedium: { fontSize: scaled(28), lineHeight: scaled(36), fontWeight: "700" as const, letterSpacing: 0 },
  headlineSmall:  { fontSize: scaled(24), lineHeight: scaled(32), fontWeight: "700" as const, letterSpacing: 0 },
  titleLarge:     { fontSize: scaled(22), lineHeight: scaled(28), fontWeight: "700" as const, letterSpacing: 0 },
  titleMedium:    { fontSize: scaled(16), lineHeight: scaled(24), fontWeight: "600" as const, letterSpacing: 0.15 },
  titleSmall:     { fontSize: scaled(14), lineHeight: scaled(20), fontWeight: "600" as const, letterSpacing: 0.1 },
  bodyLarge:      { fontSize: scaled(16), lineHeight: scaled(24), fontWeight: "400" as const, letterSpacing: 0.5 },
  bodyMedium:     { fontSize: scaled(14), lineHeight: scaled(20), fontWeight: "400" as const, letterSpacing: 0.25 },
  bodySmall:      { fontSize: scaled(12), lineHeight: scaled(16), fontWeight: "400" as const, letterSpacing: 0.4 },
  labelLarge:     { fontSize: scaled(14), lineHeight: scaled(20), fontWeight: "600" as const, letterSpacing: 0.1 },
  labelMedium:    { fontSize: scaled(12), lineHeight: scaled(16), fontWeight: "600" as const, letterSpacing: 0.5 },
  labelSmall:     { fontSize: scaled(11), lineHeight: scaled(16), fontWeight: "600" as const, letterSpacing: 0.5 },
};

/* ─────────────────────────────────────────────────────────────
   MD3 SHAPE TOKENS  (corner radius, dp)
   ───────────────────────────────────────────────────────────── */
export const mdShape = {
  none:       0,
  extraSmall: 4,
  small:      8,
  medium:     12,
  large:      16,
  extraLarge: 28,
  full:       9999,
};

/* ─────────────────────────────────────────────────────────────
   SPACING  (4dp grid)
   ───────────────────────────────────────────────────────────── */
export const mdSpacing = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  xxl:  32,
  xxxl: 48,
};

/* ─────────────────────────────────────────────────────────────
   ELEVATION  — MD3 tonal surface overlays
   Returns a surface color lightened by the overlay % for each level.
   In RN we implement this as a pre-computed background color.
   ───────────────────────────────────────────────────────────── */
export const mdElevation = {
  level0: mdColors.surface,           // 0% overlay
  level1: "#EEF7F5",                  // 5% primary tint
  level2: "#E5F3F0",                  // 8%
  level3: "#D9EDE9",                  // 11%
  level4: "#D6EBE7",                  // 12%
  level5: "#CDE7E2",                  // 14%
};

/* ─────────────────────────────────────────────────────────────
   RESPONSIVE HELPERS
   ───────────────────────────────────────────────────────────── */
export function isLargeScreen(): boolean {
  return Dimensions.get("window").width >= 700;
}

export function contentMaxWidth(): number | string {
  return isLargeScreen() ? 760 : "100%";
}

/* ─────────────────────────────────────────────────────────────
   TOUCH TARGETS  — MD3 minimum 48×48dp
   ───────────────────────────────────────────────────────────── */
export const mdTouchTarget = { minHeight: 48, minWidth: 48 };

/* ─────────────────────────────────────────────────────────────
   ANDROID RIPPLE  — attach to Pressable for MD3 pressed state
   ───────────────────────────────────────────────────────────── */
export function mdRipple(color: string = mdColors.onSurface) {
  return Platform.OS === "android"
    ? { color: color + "28", borderless: false } // 16% opacity
    : undefined;
}

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT  — the single object components import
   ───────────────────────────────────────────────────────────── */
export const md = {
  colors:    mdColors,
  typescale: mdTypescale,
  shape:     mdShape,
  spacing:   mdSpacing,
  elevation: mdElevation,
  touchTarget: mdTouchTarget,
  ripple:    mdRipple,
};

/* ─────────────────────────────────────────────────────────────
   LEGACY ALIASES  — keep old imports working while we migrate
   Remove these once all components use md.* tokens directly.
   ───────────────────────────────────────────────────────────── */
export const colors = {
  bg:         mdColors.background,
  card:       mdColors.surface,
  primary:    mdColors.primary,
  primaryDark: "#0A5D4D",
  accent:     mdColors.tertiary,
  text:       mdColors.onBackground,
  textSoft:   mdColors.onSurfaceVariant,
  border:     mdColors.outlineVariant,
  correct:    mdColors.success,
  correctBg:  mdColors.successContainer,
  wrong:      mdColors.error,
  wrongBg:    mdColors.errorContainer,
  neutralBtn: mdColors.surfaceVariant,
  white:      "#FFFFFF",
};

export const radius = {
  sm:   mdShape.small,
  md:   mdShape.medium,
  lg:   mdShape.large,
  pill: mdShape.full,
};

export const spacing = {
  xs: mdSpacing.xs,
  sm: mdSpacing.sm,
  md: mdSpacing.lg,   // legacy md = 16
  lg: mdSpacing.xl,   // legacy lg = 24
  xl: mdSpacing.xxxl, // legacy xl = 48
};

export const font = {
  get title()   { return mdTypescale.headlineLarge.fontSize; },
  get heading() { return mdTypescale.headlineSmall.fontSize; },
  get body()    { return mdTypescale.bodyLarge.fontSize; },
  get big()     { return mdTypescale.titleLarge.fontSize; },
  get label()   { return mdTypescale.labelLarge.fontSize; },
};
