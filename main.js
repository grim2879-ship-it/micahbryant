// Fills in links and footer text from config.js, and tracks where a visitor came from.
(function () {
  var c = window.SITE_CONFIG || {};

  // Source tag: share links like yoursite.com/?src=SOCIAL-YT.
  // The first tag a visitor arrives with is kept, so the booking and lead emails show the original source.
  var src = "";
  try {
    var q = new URLSearchParams(location.search);
    var incoming = (q.get("src") || q.get("utm_source") || "").trim().toUpperCase();
    src = localStorage.getItem("mb_src") || "";
    if (incoming && !src) { src = incoming; localStorage.setItem("mb_src", src); }
  } catch (e) {}
  window.MB_SOURCE = src || "WEBSITE";

  function withSource(url) {
    if (!url || url.indexOf("calendly.com") === -1) return url;
    return url + (url.indexOf("?") === -1 ? "?" : "&") + "utm_source=" + encodeURIComponent(window.MB_SOURCE);
  }
  window.MB_withSource = withSource;

  document.querySelectorAll("[data-link]").forEach(function (a) {
    var key = a.getAttribute("data-link");
    if (c[key]) a.setAttribute("href", withSource(c[key]));
  });
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var key = el.getAttribute("data-cfg");
    if (c[key]) el.textContent = c[key];
  });
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

// On phones the menu scrolls sideways: keep the current page's link in view
(function () {
  var on = document.querySelector(".nav-links a.on"), bar = on && on.parentNode;
  if (on && bar.scrollWidth > bar.clientWidth) bar.scrollLeft = on.offsetLeft - 24;
})();

// Motion: content fades in as it scrolls into view, numbers count up, gauges fill.
// Skipped for anyone who has reduced motion turned on.
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;
  function countUp(el) {
    if (el.dataset.counting) return; el.dataset.counting = 1;
    var txt = el.getAttribute("data-count-text") || el.getAttribute("data-count") || el.textContent, m = txt.match(/-?[\d,]*\.?\d+/);
    if (!m) return;
    var target = parseFloat(m[0].replace(/,/g, "")), dec = (m[0].split(".")[1] || "").length, start = null, dur = 1100;
    var pre = txt.slice(0, m.index), post = txt.slice(m.index + m[0].length);
    function step(t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (target * e).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + post;
      if (p < 1) requestAnimationFrame(step); else el.textContent = txt;
    }
    requestAnimationFrame(step);
  }
  window.MB_countUp = countUp;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target; io.unobserve(el);
      el.classList.add("in");
      if (el.classList.contains("gauge")) el.classList.remove("pre");
      el.querySelectorAll("[data-count],[data-count-text]").forEach(countUp);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  function watch(root) {
    var sel = "section h2, .path, .res, .step, .hl, .mk-item, .pth-step, .econ-tile, .econ-next, .learn > div, .demo, .nw-tile";
    (root || document).querySelectorAll(sel).forEach(function (el, i) {
      if (el.dataset.rv) return; el.dataset.rv = 1;
      var r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.9 && r.bottom > 0) { // already on screen: just count up
        el.querySelectorAll("[data-count],[data-count-text]").forEach(countUp); return;
      }
      el.classList.add("rv"); el.style.transitionDelay = (i % 3) * 70 + "ms"; io.observe(el);
    });
    (root || document).querySelectorAll(".gauge").forEach(function (g) { if (g.dataset.rv) return; g.dataset.rv = 1; g.classList.add("pre"); io.observe(g); });
  }
  window.MB_watch = watch;
  if (document.readyState === "complete") watch(); else window.addEventListener("load", function () { watch(); });
})();
