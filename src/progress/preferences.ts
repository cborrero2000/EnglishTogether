import { getItem, setItem } from "./storage";
import { LevelFilter } from "../data/level";

/**
 * Small app-wide preferences: difficulty level filter, UI language,
 * and whether the first-launch onboarding has been seen.
 * Persisted the same way as progress (AsyncStorage / localStorage).
 */

export type { LevelFilter };
export type UiLanguage = "en" | "ko";

const LEVEL_KEY = "et_level_filter_v1";
const LANGUAGE_KEY = "et_ui_language_v1";
const ONBOARDING_KEY = "et_onboarding_seen_v1";

let levelFilter: LevelFilter = "all";
let uiLanguage: UiLanguage = "en";
let onboardingSeen = false;
let loaded = false;

export async function initPreferences(): Promise<void> {
  if (loaded) return;
  try {
    const lvl = await getItem(LEVEL_KEY);
    if (lvl === "beginner" || lvl === "intermediate" || lvl === "all") levelFilter = lvl;
  } catch {}
  try {
    const lang = await getItem(LANGUAGE_KEY);
    if (lang === "en" || lang === "ko") uiLanguage = lang;
  } catch {}
  try {
    onboardingSeen = (await getItem(ONBOARDING_KEY)) === "1";
  } catch {}
  loaded = true;
}

export function getLevelFilter(): LevelFilter {
  return levelFilter;
}

export async function setLevelFilter(level: LevelFilter): Promise<void> {
  levelFilter = level;
  await setItem(LEVEL_KEY, level);
}

export function getUiLanguage(): UiLanguage {
  return uiLanguage;
}

export async function setUiLanguage(lang: UiLanguage): Promise<void> {
  uiLanguage = lang;
  await setItem(LANGUAGE_KEY, lang);
}

export function hasSeenOnboarding(): boolean {
  return onboardingSeen;
}

export async function setOnboardingSeen(): Promise<void> {
  onboardingSeen = true;
  await setItem(ONBOARDING_KEY, "1");
}

export async function resetOnboarding(): Promise<void> {
  onboardingSeen = false;
  await setItem(ONBOARDING_KEY, "0");
}
