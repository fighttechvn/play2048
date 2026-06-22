// gen-zip-levels.mjs — generate 99 progressively harder "Zip" levels.
// Zip: a single path visits every cell, passing the numbered waypoints 1..K in
// order, never crossing a wall. We build a random Hamiltonian path (the
// solution), mark waypoints along it, and add walls on non-path edges.
//
//   node scripts/gen-zip-levels.mjs > public/games/zip/levels.json
//
// Difficulty curve (see .claude/skills/game-designer): board size ↑ and waypoint
// count ↓ as the ramp climbs, with a sawtooth for relief.

const N = 99;

// --- seeded RNG (reproducible) ---
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

// difficulty knobs for level i (0-based), with a ~6-level sawtooth
function paramsForLevel(i) {
  const t0 = i / (N - 1);
  const saw = (i % 6) / 6; // 0..~0.83 relief wave
  const t = Math.max(0, Math.min(1, easeInOut(t0) - 0.18 * saw));
  const size = Math.round(lerp(5, 8, t)); // 5..8 square grid
  const cells = size * size;
  // waypoints: many (easy) → few (hard), at least 3, scaled by board
  const wp = Math.max(3, Math.round(lerp(size + 1, 3, t)));
  // walls on non-path edges grow with difficulty to keep it tractable
  const walls = Math.round(lerp(0, size, t));
  return { size, cells, wp, walls };
}

function genHamiltonian(R, C, rng) {
  const idx = (r, c) => r * C + c;
  const path = [];
  for (let r = 0; r < R; r++) {
    if (r % 2 === 0) for (let c = 0; c < C; c++) path.push([r, c]);
    else for (let c = C - 1; c >= 0; c--) path.push([r, c]);
  }
  const pos = new Int32Array(R * C);
  const rebuild = () => path.forEach(([r, c], i) => (pos[idx(r, c)] = i));
  rebuild();
  const nbrs = (r, c) =>
    [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(
      ([y, x]) => y >= 0 && y < R && x >= 0 && x < C,
    );
  const steps = R * C * 30;
  for (let s = 0; s < steps; s++) {
    const tail = rng() < 0.5;
    const L = path.length;
    const [er, ec] = tail ? path[L - 1] : path[0];
    const cand = nbrs(er, ec)
      .map(([y, x]) => pos[idx(y, x)])
      .filter((k) => (tail ? k < L - 1 : k > 0))
      .filter((k) => (tail ? k !== L - 2 : k !== 1));
    if (!cand.length) continue;
    const k = cand[(rng() * cand.length) | 0];
    if (tail) reverse(path, k + 1, L - 1);
    else reverse(path, 0, k - 1);
    rebuild();
  }
  return path;
}
function reverse(a, i, j) { while (i < j) { const t = a[i]; a[i] = a[j]; a[j] = t; i++; j--; } }

function edgeKey(a, b) {
  const [r1, c1] = a, [r2, c2] = b;
  return r1 < r2 || (r1 === r2 && c1 < c2) ? `${r1},${c1}|${r2},${c2}` : `${r2},${c2}|${r1},${c1}`;
}

function genLevel(i) {
  const p = paramsForLevel(i);
  const rng = mulberry32(0x21b0 + i * 2654435761);
  const path = genHamiltonian(p.size, p.size, rng);
  const L = path.length;

  // waypoints: indices 0 and L-1 always; spread the rest
  const wp = Math.min(p.wp, L);
  const idxs = [0];
  for (let k = 1; k < wp - 1; k++) idxs.push(Math.round((k * (L - 1)) / (wp - 1)));
  idxs.push(L - 1);
  const uniq = [...new Set(idxs)].sort((a, b) => a - b);
  const numbers = uniq.map((pi, n) => ({ r: path[pi][0], c: path[pi][1], n: n + 1 }));

  // walls: candidate grid edges NOT used by the solution path
  const used = new Set();
  for (let k = 0; k < L - 1; k++) used.add(edgeKey(path[k], path[k + 1]));
  const candidates = [];
  for (let r = 0; r < p.size; r++)
    for (let c = 0; c < p.size; c++) {
      if (c + 1 < p.size) candidates.push([[r, c], [r, c + 1]]);
      if (r + 1 < p.size) candidates.push([[r, c], [r + 1, c]]);
    }
  const walls = [];
  for (const e of candidates) if (!used.has(edgeKey(e[0], e[1]))) walls.push(e);
  // shuffle + take `p.walls`
  for (let k = walls.length - 1; k > 0; k--) { const j = (rng() * (k + 1)) | 0;[walls[k], walls[j]] = [walls[j], walls[k]]; }
  const chosen = walls.slice(0, p.walls).map(([a, b]) => ({ r: a[0], c: a[1], r2: b[0], c2: b[1] }));

  return {
    id: i + 1,
    rows: p.size,
    cols: p.size,
    numbers,
    walls: chosen,
    solution: path.map(([r, c]) => [r, c]), // for Hint
  };
}

const levels = Array.from({ length: N }, (_, i) => genLevel(i));
process.stdout.write(JSON.stringify({ game: "zip", count: N, levels }));
