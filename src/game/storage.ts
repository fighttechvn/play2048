import { Preferences } from "@capacitor/preferences";
import type { BoardState } from "./board";

// Persistent storage via @capacitor/preferences (works on web + native).
// Per the ionic-shared skill: never touch localStorage directly.

const STATE_KEY = "go2048.state";
const BEST_KEY = "go2048.best";

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
