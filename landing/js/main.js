// go2048 landing — theme switch, mobile menu, scroll reveal, footer year.
(function () {
  var root = document.documentElement;

  // ----- Theme (System / Light / Dark) -----
  function systemDark() {
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function apply(pref) {
    var dark = pref === "dark" || (pref !== "light" && systemDark());
    root.setAttribute("data-theme", dark ? "dark" : "light");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#0f1115" : "#faf8ef");
  }
  function getPref() {
    try { return localStorage.getItem("go2048.theme") || "system"; } catch (e) { return "system"; }
  }
  apply(getPref());

  var themeSelect = document.getElementById("themeSelect");
  if (themeSelect) {
    themeSelect.value = getPref();
    themeSelect.addEventListener("change", function () {
      try { localStorage.setItem("go2048.theme", themeSelect.value); } catch (e) {}
      apply(themeSelect.value);
    });
  }
  if (window.matchMedia) {
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      if (getPref() === "system") apply("system");
    });
  }

  // ----- Sticky header shadow -----
  var header = document.querySelector(".header");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ----- Mobile menu -----
  var menuToggle = document.getElementById("menuToggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll("#navLinks > a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ----- Scroll reveal -----
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // ----- Footer year -----
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
