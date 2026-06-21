import { Preferences } from "@capacitor/preferences";
import type { BoardState } from "./board";
import type { ThemeMode } from "./theme";
import type { Locale } from "./i18n";

// Persistent storage via @capacitor/preferences (works on web + native).
// Per the ionic-shared skill: never touch localStorage directly.

const STATE_KEY = "go2048.state";
const BEST_KEY = "go2048.best";
const THEME_KEY = "go2048.theme";
const LOCALE_KEY = "go2048.locale";

export interface Settings {
  theme: ThemeMode | null;
  locale: Locale | null;
}

export async function saveSettings(theme: ThemeMode, locale: Locale): Promise<void> {
  await Preferences.set({ key: THEME_KEY, value: theme });
  await Preferences.set({ key: LOCALE_KEY, value: locale });
}

export async function loadSettings(): Promise<Settings> {
  const theme = (await Preferences.get({ key: THEME_KEY })).value as ThemeMode | null;
  const locale = (await Preferences.get({ key: LOCALE_KEY })).value as Locale | null;
  return { theme, locale };
}

export async function saveState(state: BoardState): Promise<void> {
  await Preferences.set({ key: STATE_KEY, value: JSON.stringify(state) });
  await Preferences.set({ key: BEST_KEY, value: String(state.best) });
}

export async function loadState(): Promise<BoardState | null> {
  const { value } = await Preferences.get({ key: STATE_KEY });
  if (!value) return null;
  try {
    return JSON.parse(value) as BoardState;
  } catch {
    return null;
  }
}

export async function loadBest(): Promise<number> {
  const { value } = await Preferences.get({ key: BEST_KEY });
  return value ? Number(value) || 0 : 0;
}
