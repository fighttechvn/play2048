// Lightweight i18n for go2048. Strings are swapped into PixiJS Text objects by
// GameScene. Arabic ("ar") is right-to-left — GameScene mirrors the header when
// isRTL() is true. Canvas text rendering handles per-string shaping/bidi, so the
// translated strings render correctly; only the layout needs mirroring.

export type Locale = "en" | "vi" | "ko" | "zh" | "ar";

export const LOCALES: Locale[] = ["en", "vi", "ko", "zh", "ar"];

type Key = "score" | "best" | "newGame" | "win" | "keepGoing" | "gameOver" | "tryAgain";

const STRINGS: Record<Locale, Record<Key, string>> = {
  en: {
    score: "SCORE",
    best: "BEST",
    newGame: "New Game",
    win: "You win! 🎉",
    keepGoing: "Keep going",
    gameOver: "Game over",
    tryAgain: "Try again",
  },
  vi: {
    score: "ĐIỂM",
    best: "CAO NHẤT",
    newGame: "Chơi mới",
    win: "Bạn thắng! 🎉",
    keepGoing: "Chơi tiếp",
    gameOver: "Thua rồi",
    tryAgain: "Chơi lại",
  },
  ko: {
    score: "점수",
    best: "최고",
    newGame: "새 게임",
    win: "승리! 🎉",
    keepGoing: "계속하기",
    gameOver: "게임 오버",
    tryAgain: "다시 하기",
  },
  zh: {
    score: "分数",
    best: "最高",
    newGame: "新游戏",
    win: "你赢了！🎉",
    keepGoing: "继续",
    gameOver: "游戏结束",
    tryAgain: "再试一次",
  },
  ar: {
    score: "النقاط",
    best: "الأفضل",
    newGame: "لعبة جديدة",
    win: "🎉 لقد فزت",
    keepGoing: "واصل",
    gameOver: "انتهت اللعبة",
    tryAgain: "حاول مجدداً",
  },
};

// Short label shown on the language toggle button.
const LABELS: Record<Locale, string> = {
  en: "EN",
  vi: "VI",
  ko: "한",
  zh: "中",
  ar: "ع",
};

let current: Locale = "en";

export function setLocale(l: Locale): void {
  current = l;
}

export function getLocale(): Locale {
  return current;
}

export function t(key: Key): string {
  return STRINGS[current][key] ?? STRINGS.en[key];
}

export function isRTL(locale: Locale = current): boolean {
  return locale === "ar";
}

export function localeLabel(locale: Locale = current): string {
  return LABELS[locale];
}

export function nextLocale(locale: Locale = current): Locale {
  const i = LOCALES.indexOf(locale);
  return LOCALES[(i + 1) % LOCALES.length];
}

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language || "en"];
  for (const raw of langs) {
    const code = raw.toLowerCase().split("-")[0];
    if (code === "vi") return "vi";
    if (code === "ko") return "ko";
    if (code === "zh") return "zh";
    if (code === "ar") return "ar";
    if (code === "en") return "en";
  }
  return "en";
}
