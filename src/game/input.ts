import type { Direction } from "./board";

// Unified input: arrow/WASD keys + touch swipe on a DOM element.
// Swipes need a minimum travel distance to avoid firing on taps.

const SWIPE_THRESHOLD = 24; // px

export function attachInput(
  el: HTMLElement,
  onMove: (dir: Direction) => void,
): () => void {
  const onKey = (e: KeyboardEvent) => {
    const dir = KEY_MAP[e.key];
    if (dir) {
      e.preventDefault();
      onMove(dir);
    }
  };

  let startX = 0;
  let startY = 0;
  let tracking = false;

  const onStart = (e: PointerEvent) => {
    tracking = true;
    startX = e.clientX;
    startY = e.clientY;
  };

  const onEnd = (e: PointerEvent) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (Math.max(absX, absY) < SWIPE_THRESHOLD) return;
    if (absX > absY) onMove(dx > 0 ? "right" : "left");
    else onMove(dy > 0 ? "down" : "up");
  };

  window.addEventListener("keydown", onKey);
  el.addEventListener("pointerdown", onStart);
  el.addEventListener("pointerup", onEnd);
  el.addEventListener("pointercancel", () => (tracking = false));

  return () => {
    window.removeEventListener("keydown", onKey);
    el.removeEventListener("pointerdown", onStart);
    el.removeEventListener("pointerup", onEnd);
  };
}

const KEY_MAP: Record<string, Direction | undefined> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
  W: "up",
  S: "down",
  A: "left",
  D: "right",
};
