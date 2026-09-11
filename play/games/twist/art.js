/* Brain Twist — vector art library.
 *
 * A single, growable sprite catalog: each entry is a function returning inline
 * SVG markup drawn in a 100×100 viewBox, using the game's CSS custom properties
 * so sprites re-theme automatically (event skins recolor via --tw-*). Levels and
 * the mascot reference sprites by NAME (`sprite:"cup"`), so adding art = adding a
 * function here, never touching the engine. Shared by web now; the same names are
 * the contract the native iOS/Android sprite atlases must satisfy.
 *
 * Palette tokens (set by the engine theme):
 *   --tw-ink     line/detail      --tw-accent  brand highlight
 *   --tw-warm    warm fill        --tw-cool    cool fill
 *   --tw-good    success green    --tw-bad     alert red
 *   --tw-paper   soft surface     --tw-gold    coins / stars
 */
(function (global) {
  "use strict";

  // Small helpers keep sprite code terse and consistent.
  const wrap = (inner) =>
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="tw-sprite">${inner}</svg>`;

  // Each sprite: name -> () => inner SVG. Fills use CSS vars for theming.
  const SPRITES = {
    /* ---- Mascot: "Twisty", a little brain-buddy owl ---- */
    twisty: () => `
      <ellipse cx="50" cy="92" rx="26" ry="5" fill="rgba(0,0,0,.18)"/>
      <path d="M22 52c0-19 12-33 28-33s28 14 28 33c0 18-12 30-28 30S22 70 22 52Z" fill="var(--tw-accent)"/>
      <path d="M28 40c-6-10-3-19 2-22 4 3 6 10 5 18Zm44 0c6-10 3-19-2-22-4 3-6 10-5 18Z" fill="var(--tw-accent)"/>
      <circle cx="39" cy="50" r="12" fill="#fff"/><circle cx="61" cy="50" r="12" fill="#fff"/>
      <circle cx="39" cy="51" r="5" fill="var(--tw-ink)"/><circle cx="61" cy="51" r="5" fill="var(--tw-ink)"/>
      <circle cx="41" cy="49" r="1.6" fill="#fff"/><circle cx="63" cy="49" r="1.6" fill="#fff"/>
      <path d="M46 62h8l-4 6Z" fill="var(--tw-gold)"/>
      <path d="M36 78c4 4 24 4 28 0" stroke="var(--tw-ink)" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"/>`,

    cup: () => `
      <path d="M28 34h44l-4 44a8 8 0 0 1-8 7H40a8 8 0 0 1-8-7Z" fill="var(--tw-cool)"/>
      <path d="M70 40h8a10 10 0 0 1 0 20h-6" fill="none" stroke="var(--tw-cool)" stroke-width="6"/>
      <rect x="26" y="28" width="48" height="8" rx="4" fill="var(--tw-ink)" opacity=".85"/>
      <path d="M40 20c0 4-4 5-4 9m14-9c0 4-4 5-4 9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>`,

    plate: () => `
      <ellipse cx="50" cy="58" rx="40" ry="16" fill="var(--tw-paper)"/>
      <ellipse cx="50" cy="55" rx="40" ry="16" fill="#fff"/>
      <ellipse cx="50" cy="54" rx="26" ry="10" fill="none" stroke="var(--tw-ink)" stroke-width="2" opacity=".25"/>`,

    cake: () => `
      <rect x="26" y="52" width="48" height="30" rx="5" fill="var(--tw-warm)"/>
      <path d="M26 60c8 8 16-4 24 0s16 8 24 0v-6H26Z" fill="#fff"/>
      <rect x="47" y="30" width="6" height="18" rx="3" fill="var(--tw-cool)"/>
      <path d="M50 20c5 6 0 12-5 8 1 5 8 4 10-2 2 6-1 10-5 10" fill="var(--tw-gold)"/>
      <circle cx="50" cy="20" r="3" fill="var(--tw-gold)"/>`,

    apple: () => `
      <path d="M50 34c8-8 24-6 26 8 2 16-10 34-26 34S22 58 24 42c2-14 18-16 26-8Z" fill="var(--tw-bad)"/>
      <path d="M50 34c-3-8-1-16 6-18-1 8-2 14-6 18Z" fill="var(--tw-good)"/>
      <path d="M40 44c4-4 8-4 10-2" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>`,

    candle: () => `
      <rect x="42" y="38" width="16" height="46" rx="4" fill="var(--tw-paper)"/>
      <rect x="42" y="38" width="16" height="46" rx="4" fill="none" stroke="var(--tw-ink)" opacity=".15" stroke-width="2"/>
      <rect x="48" y="28" width="4" height="10" fill="var(--tw-ink)"/>
      <path d="M50 8c7 8 8 16 0 22-8-6-7-14 0-22Z" fill="var(--tw-gold)"/>
      <path d="M50 14c3 4 3 9 0 13-3-4-3-9 0-13Z" fill="#fff" opacity=".8"/>`,

    balloon: () => `
      <path d="M50 14c14 0 22 10 22 22 0 16-14 26-22 26S28 52 28 36c0-12 8-22 22-22Z" fill="var(--tw-accent)"/>
      <path d="M50 62l-4 8h8Z" fill="var(--tw-accent)"/>
      <path d="M50 70c0 10 8 10 8 20" stroke="var(--tw-ink)" stroke-width="1.5" fill="none" opacity=".5"/>
      <ellipse cx="42" cy="30" rx="5" ry="8" fill="#fff" opacity=".45"/>`,

    star: () => `
      <path d="M50 12l11 23 25 3-18 18 5 25-23-12-23 12 5-25-18-18 25-3Z" fill="var(--tw-gold)"/>
      <path d="M50 24l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2Z" fill="#fff" opacity=".25"/>`,

    key: () => `
      <circle cx="34" cy="50" r="18" fill="none" stroke="var(--tw-gold)" stroke-width="8"/>
      <circle cx="34" cy="50" r="6" fill="var(--tw-paper)"/>
      <rect x="50" y="46" width="40" height="8" rx="3" fill="var(--tw-gold)"/>
      <rect x="78" y="54" width="8" height="12" rx="2" fill="var(--tw-gold)"/>
      <rect x="66" y="54" width="7" height="10" rx="2" fill="var(--tw-gold)"/>`,

    box: () => `
      <path d="M20 40l30-12 30 12-30 12Z" fill="var(--tw-warm)"/>
      <path d="M20 40v30l30 12V52Z" fill="var(--tw-ink)" opacity=".8"/>
      <path d="M80 40v30L50 82V52Z" fill="var(--tw-ink)" opacity=".6"/>
      <path d="M50 52v30" stroke="#fff" stroke-width="1" opacity=".2"/>`,

    door: () => `
      <rect x="30" y="14" width="40" height="72" rx="4" fill="var(--tw-warm)"/>
      <rect x="35" y="19" width="30" height="62" rx="3" fill="none" stroke="var(--tw-ink)" stroke-width="2" opacity=".3"/>
      <circle cx="60" cy="50" r="3" fill="var(--tw-gold)"/>`,

    cat: () => `
      <path d="M30 44l-6-16 16 8Zm40 0l6-16-16 8Z" fill="var(--tw-ink)"/>
      <ellipse cx="50" cy="58" rx="24" ry="22" fill="var(--tw-ink)"/>
      <circle cx="42" cy="54" r="4" fill="var(--tw-good)"/><circle cx="58" cy="54" r="4" fill="var(--tw-good)"/>
      <path d="M46 64h8l-4 4Z" fill="var(--tw-warm)"/>
      <path d="M30 66c-8 2-14 0-18-4m56 4c8 2 14 0 18-4" stroke="var(--tw-ink)" stroke-width="1.5" fill="none" opacity=".5"/>`,

    sun: () => `
      <circle cx="50" cy="50" r="20" fill="var(--tw-gold)"/>
      <g stroke="var(--tw-gold)" stroke-width="5" stroke-linecap="round">
        <path d="M50 12v10M50 78v10M12 50h10M78 50h10M24 24l7 7M69 69l7 7M76 24l-7 7M31 69l-7 7"/></g>`,

    moon: () => `
      <path d="M60 18c-18 2-30 16-30 33s14 31 32 31c-10-6-16-18-16-31s6-27 14-33Z" fill="var(--tw-paper)"/>
      <circle cx="70" cy="40" r="4" fill="var(--tw-ink)" opacity=".12"/>
      <circle cx="62" cy="60" r="6" fill="var(--tw-ink)" opacity=".12"/>`,

    gift: () => `
      <rect x="24" y="44" width="52" height="40" rx="4" fill="var(--tw-bad)"/>
      <rect x="24" y="38" width="52" height="12" rx="3" fill="var(--tw-good)"/>
      <rect x="45" y="38" width="10" height="46" fill="var(--tw-gold)"/>
      <path d="M50 38c-8-14-24-6-14 2m14-2c8-14 24-6 14 2" fill="none" stroke="var(--tw-gold)" stroke-width="5"/>`,

    lantern: () => `
      <rect x="46" y="10" width="8" height="8" fill="var(--tw-ink)"/>
      <path d="M32 26h36v34a18 12 0 0 1-36 0Z" fill="var(--tw-bad)"/>
      <rect x="30" y="22" width="40" height="6" rx="3" fill="var(--tw-gold)"/>
      <rect x="30" y="58" width="40" height="6" rx="3" fill="var(--tw-gold)"/>
      <path d="M50 64v14m-6 0h12" stroke="var(--tw-gold)" stroke-width="2"/>`,

    cloud: () => `
      <path d="M28 62a14 14 0 0 1 2-28 18 18 0 0 1 34-4 14 14 0 0 1 8 32Z" fill="#fff"/>
      <path d="M28 62a14 14 0 0 1 2-28 18 18 0 0 1 34-4 14 14 0 0 1 8 32Z" fill="none" stroke="var(--tw-ink)" opacity=".1" stroke-width="2"/>`,

    fish: () => `
      <path d="M20 50c14-16 40-16 52 0-12 16-38 16-52 0Z" fill="var(--tw-cool)"/>
      <path d="M72 50l14-10v20Z" fill="var(--tw-cool)"/>
      <circle cx="34" cy="48" r="3" fill="var(--tw-ink)"/>
      <path d="M44 44c6 4 6 8 0 12m10-12c6 4 6 8 0 12" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/>`,

    tree: () => `
      <rect x="45" y="58" width="10" height="26" rx="3" fill="var(--tw-warm)"/>
      <circle cx="50" cy="42" r="24" fill="var(--tw-good)"/>
      <circle cx="36" cy="50" r="14" fill="var(--tw-good)"/><circle cx="64" cy="50" r="14" fill="var(--tw-good)"/>`,

    bulb: () => `
      <path d="M50 16c14 0 22 10 22 22 0 10-8 14-10 22H38c-2-8-10-12-10-22 0-12 8-22 22-22Z" fill="var(--tw-gold)"/>
      <rect x="40" y="60" width="20" height="6" rx="2" fill="var(--tw-ink)"/>
      <rect x="42" y="68" width="16" height="5" rx="2" fill="var(--tw-ink)"/>
      <path d="M44 36c2-6 8-9 12-8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>`,
  };

  function has(name) { return Object.prototype.hasOwnProperty.call(SPRITES, name); }
  function svg(name) {
    const f = SPRITES[name];
    return wrap(f ? f() : `<rect x="20" y="20" width="60" height="60" rx="8" fill="var(--tw-paper)"/>
      <text x="50" y="56" text-anchor="middle" font-size="10" fill="var(--tw-ink)">${name || "?"}</text>`);
  }
  function names() { return Object.keys(SPRITES); }

  const TwistArt = { svg, has, names, SPRITES };
  if (typeof module !== "undefined" && module.exports) module.exports = TwistArt;
  else global.TwistArt = TwistArt;
})(typeof window !== "undefined" ? window : globalThis);
