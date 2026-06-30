// BeatTrack — the audio-driven player for the `beat` game.
//
// A track-mode level is a real song + a beatmap of {t, lane} hit-times. The audio
// is the master clock: tiles fall so each reaches the hit line exactly at its `t`,
// the player taps in time. Shared by the game (online levels) AND the /design
// preview (auto-play demo), so the preview is the real engine — no drift between
// what you design and what ships.
//
//   const ctl = BeatTrack.mount({ canvas, level, audioUrl, auto, onEvent });
//   ctl.stop();            // tear down (loop + audio)
//
// level = { bpm, duration, lanes, tiles:[{t,lane}], audio? }
// Forgiving by design: missed/late tiles cost combo + accuracy but the song plays
// to the end → onEvent('level_complete', {score, total, accuracy, combo}).
(function () {
  "use strict";

  var LEAD = 1.6;        // seconds a tile is visible while falling
  var HIT_WINDOW = 0.28; // ± seconds around t that a tap counts
  var COLORS = {
    bg: "#0e1116", line: "rgba(255,255,255,.05)",
    tile: "#161d29", active: "#222c3e", accent: "rgba(124,92,255,.85)",
    hit: "rgba(124,92,255,.10)", miss: "rgba(255,84,112,.5)", text: "#f4f6fb",
  };

  function mount(opts) {
    var canvas = opts.canvas;
    var level = opts.level || {};
    var lanes = level.lanes || 4;
    var tiles = (level.tiles || []).slice().sort(function (a, b) { return a.t - b.t; });
    var auto = !!opts.auto;
    var onEvent = opts.onEvent || function () {};
    var ctx = canvas.getContext("2d");

    // each tile gets a runtime state: 0=pending, 1=hit, 2=missed
    var state = new Uint8Array(tiles.length);
    var next = 0;          // earliest pending index (for the active highlight)
    var score = 0, combo = 0, maxCombo = 0, hits = 0, misses = 0;
    var flash = 0, running = true, finished = false;

    // ── audio (master clock) ──────────────────────────────────────────────
    var audio = new Audio();
    audio.src = opts.audioUrl || level.audio || "";
    audio.preload = "auto";
    // no crossOrigin: we only read currentTime (no AnalyserNode), so plain
    // cross-origin playback works without the storage host setting CORS.
    var duration = level.duration || 0;

    // Clock: the audio is the master, but until playback actually starts (autoplay
    // can be briefly blocked) fall back to a wall clock so the visuals still run.
    // Once audio is confirmed playing we lock to it, so gameplay stays in sync.
    var perf = function () { return (window.performance && performance.now) ? performance.now() : Date.now(); };
    var wallStart = perf();
    var audioLive = false;
    function clock() {
      if (!audioLive && !audio.paused && audio.currentTime > 0.02) audioLive = true;
      return audioLive ? audio.currentTime : (perf() - wallStart) / 1000;
    }

    var W = 0, H = 0, DPR = 1, laneW = 0, rowH = 0;
    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2.5);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      laneW = W / lanes; rowH = H / 4.0;
    }
    window.addEventListener("resize", resize);
    resize();

    var hitY = function () { return H - rowH; };          // tile top at hit time
    // tile-top y for a given current time
    function tileTop(t, now) { return hitY() - (t - now) / LEAD * (hitY() + rowH); }

    // ── input ──────────────────────────────────────────────────────────────
    function laneAt(x) { return Math.min(lanes - 1, Math.max(0, (x / laneW) | 0)); }
    function tapLane(lane) {
      if (!running || finished) return;
      var now = clock();
      // earliest pending tile in this lane within the hit window
      for (var i = next; i < tiles.length; i++) {
        if (tiles[i].t - now > HIT_WINDOW) break;        // future beyond window → stop
        if (state[i] !== 0 || tiles[i].lane !== lane) continue;
        if (Math.abs(tiles[i].t - now) <= HIT_WINDOW) { hit(i); return; }
      }
      miss(false); // tapped with nothing to hit
    }
    function hit(i) {
      state[i] = 1; hits++; score++; combo++; if (combo > maxCombo) maxCombo = combo;
      if (i === next) advance();
    }
    function miss(passed) {
      combo = 0; flash = 0.22; misses++;
      if (passed === false) { /* stray tap */ }
    }
    function advance() { while (next < tiles.length && state[next] !== 0) next++; }

    function onPointer(e) { e.preventDefault(); tapLane(laneAt(e.clientX - canvas.getBoundingClientRect().left)); }
    if (!auto) canvas.addEventListener("pointerdown", onPointer, { passive: false });

    // ── loop ─────────────────────────────────────────────────────────────────
    function frame() {
      if (!running) return;
      var now = clock();
      if (flash > 0) flash -= 0.016;

      // auto-hit (preview) — strike each tile right at its time
      if (auto) {
        for (var a = next; a < tiles.length; a++) {
          if (tiles[a].t > now) break;
          if (state[a] === 0) hit(a);
        }
      }
      // mark pending tiles that have slipped past the window as missed
      for (var m = next; m < tiles.length; m++) {
        if (tiles[m].t > now - HIT_WINDOW) break;
        if (state[m] === 0) { state[m] = 2; miss(true); if (m === next) advance(); }
      }

      draw(now);

      var done = (duration && now >= duration - 0.02) || audio.ended ||
                 (next >= tiles.length && now > (tiles.length ? tiles[tiles.length - 1].t + 0.5 : 0));
      if (done) { finish(true); return; }
      requestAnimationFrame(frame);
    }

    function draw(now) {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = COLORS.line; ctx.lineWidth = 1;
      for (var l = 1; l < lanes; l++) { ctx.beginPath(); ctx.moveTo(l * laneW, 0); ctx.lineTo(l * laneW, H); ctx.stroke(); }

      // visible tiles
      for (var i = next; i < tiles.length; i++) {
        var t = tiles[i].t;
        if (t - now > LEAD) break;                 // not yet on screen
        if (state[i] === 1) continue;              // hit → vanished
        var y = tileTop(t, now);
        if (y > H) continue;
        var x = tiles[i].lane * laneW;
        roundRect(x + 5, y + 4, laneW - 10, rowH - 8, 12);
        ctx.fillStyle = state[i] === 2 ? "#241a22" : (i === next ? COLORS.active : COLORS.tile);
        ctx.fill();
        if (i === next && state[i] === 0) { ctx.fillStyle = "rgba(124,92,255,.18)"; ctx.fill(); }
      }

      ctx.fillStyle = flash > 0 ? COLORS.miss : COLORS.hit;
      ctx.fillRect(0, H - rowH, W, rowH);

      // HUD
      ctx.fillStyle = COLORS.text; ctx.font = "600 15px -apple-system,system-ui,sans-serif";
      ctx.textBaseline = "top";
      ctx.fillText(score + (combo > 2 ? "  ×" + combo : ""), 16, 14 + safeTop());
      var pct = (hits + misses) ? Math.round((hits / (hits + misses)) * 100) : 100;
      ctx.textAlign = "right"; ctx.fillText(pct + "%", W - 16, 14 + safeTop()); ctx.textAlign = "left";
    }
    function safeTop() { try { return parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sat")) || 0; } catch (e) { return 0; } }
    function roundRect(x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    function finish(complete) {
      if (finished) return; finished = true; running = false;
      try { audio.pause(); } catch (e) {}
      var accuracy = (hits + misses) ? hits / (hits + misses) : 1;
      onEvent(complete ? "level_complete" : "game_over", {
        score: score, total: tiles.length, hits: hits, misses: misses,
        accuracy: Math.round(accuracy * 100), maxCombo: maxCombo,
      });
    }

    // start: play audio (caller invoked us from a user gesture) then run the loop
    var startP = audio.play();
    if (startP && startP.catch) startP.catch(function () { /* autoplay blocked; loop still draws */ });
    onEvent("game_start", { mode: "track", tiles: tiles.length, auto: auto });
    requestAnimationFrame(frame);

    return {
      stop: function () {
        running = true; finished = true; running = false;
        try { audio.pause(); audio.src = ""; } catch (e) {}
        window.removeEventListener("resize", resize);
        if (!auto) canvas.removeEventListener("pointerdown", onPointer);
      },
      audio: audio,
      // introspection (used by /design preview + automated checks)
      tapLane: tapLane,
      state: function () { return { now: clock(), next: next, score: score, hits: hits, misses: misses, finished: finished, total: tiles.length }; },
    };
  }

  window.BeatTrack = { mount: mount, LEAD: LEAD };
})();
