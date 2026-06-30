// Download page — detect platform and send mobile visitors to the right store.
// iOS  -> App Store
// Android -> Google Play
// Desktop / other -> stay on the page.
// Escape hatches: ?stay=1 (or ?noredirect) skips it, a "Stay on this page" button
// cancels it, and we only auto-redirect once per session so Back doesn't trap.
(function () {
  "use strict";

  var params = new URLSearchParams(location.search);
  if (params.has("stay") || params.has("noredirect")) return;

  var ua = navigator.userAgent || "";
  var isAndroid = /Android/i.test(ua);
  var isIOS =
    /iPad|iPhone|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (!isAndroid && !isIOS) return; // desktop: keep the informational page

  var PLAY = "https://play.google.com/store/apps/details?id=vn.fighttech.go2048";
  var APP_STORE = "https://apps.apple.com/app/id6782550523";
  var target = isAndroid ? PLAY : APP_STORE;
  var label = isAndroid ? "Google Play" : "App Store";

  var KEY = "gobrain.dlRedirected";
  try {
    if (sessionStorage.getItem(KEY)) return; // already sent this session
  } catch (e) {}

  var DELAY = 1200;
  var cancelled = false;

  function remember() {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
  }

  function showNotice() {
    var bar = document.createElement("div");
    bar.className = "dl-redirect";
    bar.setAttribute("role", "status");
    bar.innerHTML =
      '<span class="dl-redirect-msg">Opening ' + label + "…</span>" +
      '<a class="dl-redirect-go" href="' + target + '" rel="noopener">Tap here if it doesn’t open</a>' +
      '<button type="button" class="dl-redirect-stay">Stay on this page</button>';
    document.body.appendChild(bar);

    bar.querySelector(".dl-redirect-go").addEventListener("click", remember);
    bar.querySelector(".dl-redirect-stay").addEventListener("click", function () {
      cancelled = true;
      remember();
      bar.remove();
    });
  }

  function go() {
    if (document.body) showNotice();
    else document.addEventListener("DOMContentLoaded", showNotice);

    setTimeout(function () {
      if (cancelled) return;
      remember();
      location.href = target;
    }, DELAY);
  }

  go();
})();
