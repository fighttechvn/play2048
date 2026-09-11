/* Go Brain — persistent "get the app" banner (mobile only).
 * A native-style smart app-banner pinned to the top on phones, hidden on
 * desktop via CSS (.app-banner in css/styles.css). Detects iOS vs Android and
 * sends the CTA to the right store: iOS → App Store, Android → Google Play.
 * Self-contained 6-language i18n (en/vi/ko/zh/ja/ar); re-renders when the
 * header language <select id="langSelect"> changes. Injects itself as the first
 * child of <body> and adds `has-appbar` so the sticky header is nudged down. */
(function () {
  "use strict";

  var LANGS = ["en", "vi", "ko", "zh", "ja", "ar"];
  var T = {
    en: { sub: "Brain puzzles — free & offline", cta: "Get" },
    vi: { sub: "Game trí tuệ — miễn phí, ngoại tuyến", cta: "Tải" },
    ko: { sub: "두뇌 퍼즐 — 무료·오프라인", cta: "받기" },
    zh: { sub: "益智游戏 — 免费·离线", cta: "获取" },
    ja: { sub: "脳トレパズル — 無料・オフライン", cta: "入手" },
    ar: { sub: "ألغاز ذهنية — مجانًا وبدون إنترنت", cta: "تحميل" },
  };
  var TITLE = "Go Brain";

  var STORE = {
    ios: "https://apps.apple.com/app/id6782550523",
    android: "https://play.google.com/store/apps/details?id=vn.fighttech.go2048",
  };

  function detectOs() {
    var ua = navigator.userAgent || "";
    if (/iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && "ontouchend" in document)) return "ios";
    if (/android/i.test(ua)) return "android";
    return "desktop";
  }

  function currentLang() {
    var sel = document.getElementById("langSelect");
    if (sel && T[sel.value]) return sel.value;
    try {
      var v = localStorage.getItem("gobrain.lang");
      if (T[v]) return v;
    } catch (e) {}
    var code = ((navigator.language || "en") + "").toLowerCase().split("-")[0];
    return T[code] ? code : "en";
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // The banner only makes sense as an *install* prompt on a real phone.
  var os = detectOs();
  if (os !== "ios" && os !== "android") return; // desktop: don't inject

  var host = document.createElement("div");
  host.className = "app-banner";
  document.body.insertBefore(host, document.body.firstChild);
  document.body.classList.add("has-appbar");

  // Resolve the icon from the page's own header logo so the path is correct on
  // both the root landing and one-level-deep subpages (/download/, /support/ …).
  var ICON = (document.querySelector(".brand .logo, .logo") || {}).src || "assets/app-icon.png";

  function render() {
    var d = T[currentLang()] || T.en;
    host.innerHTML =
      '<img class="ab-icon" src="' + esc(ICON) + '" alt="" width="40" height="40" />' +
      '<span class="ab-text"><b>' + esc(TITLE) + "</b><span>" + esc(d.sub) + "</span></span>" +
      '<a class="ab-cta" href="' + STORE[os] + '" rel="noopener" target="_blank">' + esc(d.cta) + "</a>";
  }

  render();
  var sel = document.getElementById("langSelect");
  if (sel) sel.addEventListener("change", render);
})();
