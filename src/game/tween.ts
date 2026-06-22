import type { Ticker } from "pixi.js";

// Minimal tween engine driven by the Pixi ticker. Enough for slides, pops,
// and fades without pulling in an animation dependency.

type Easing = (t: number) => number;

export const Ease = {
  linear: (t: number) => t,
  outQuad: (t: number) => 1 - (1 - t) * (1 - t),
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  outBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
} satisfies Record<string, Easing>;

interface Tween {
  elapsed: number;
  duration: number;
  ease: Easing;
  apply: (k: number) => void;
  onComplete?: () => void;
}

export interface TweenOptions {
  duration: number; // ms
  ease?: Easing;
  onComplete?: () => void;
}

export class Tweener {
  private tweens: Tween[] = [];

  constructor(ticker: Ticker) {
    // PixiJS v7 ticker callbacks receive the scalar deltaTime; read elapsed ms
    // off the ticker instance instead.
    ticker.add(() => this.update(ticker.deltaMS));
  }

  /** Animate a numeric interpolation; `apply(k)` receives eased progress 0..1. */
  add(apply: (k: number) => void, opts: TweenOptions): void {
    this.tweens.push({
      elapsed: 0,
      duration: Math.max(1, opts.duration),
      ease: opts.ease ?? Ease.outQuad,
      apply,
      onComplete: opts.onComplete,
    });
  }

  private update(deltaMS: number): void {
    if (this.tweens.length === 0) return;
    const done: Tween[] = [];
    for (const tw of this.tweens) {
      tw.elapsed += deltaMS;
      const raw = Math.min(1, tw.elapsed / tw.duration);
      tw.apply(tw.ease(raw));
      if (raw >= 1) done.push(tw);
    }
    if (done.length) {
      this.tweens = this.tweens.filter((t) => !done.includes(t));
      for (const tw of done) tw.onComplete?.();
    }
  }
}
