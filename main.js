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
