// Home page: path tabs and the live economy band.
(function () {
  var $ = function (id) { return document.getElementById(id); };

  // ---- path tabs ----
  var tabs = document.querySelectorAll(".ptabs [role=tab]");
  function pick(k, focus) {
    tabs.forEach(function (t) {
      var on = t.id === "pt-" + k;
      t.classList.toggle("on", on); t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
      $(t.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.onclick = function () { pick(t.id.slice(3)); };
    t.onkeydown = function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
      pick(tabs[(i + d + tabs.length) % tabs.length].id.slice(3), true);
    };
  });
  // Someone who already picked an investing or home path lands on that tab
  if (window.MB && MB.get("journey")) pick("grow");
  // The "Find your path" links with a #grow / #earn hash open that tab
  var h = location.hash.replace("#", ""); if (["solid", "earn", "grow"].indexOf(h) > -1) pick(h);

  // ---- economy band ----
  var W = window.WEEKLY; if (!W || !W.board || !W.board.length) return;
  $("econ").hidden = false;
  $("econ-asof").textContent = "Updated " + W.asof;
  $("econ-tiles").innerHTML = W.board.slice(0, 3).map(function (b) {
    var neg = /^[−-]/.test(b[1]);
    return "<div class='econ-tile'><small>" + b[0] + "</small><b class='" + (neg ? "neg" : "") + "' data-count-text='" + b[1] + "'>" + b[1] + "</b><span>" + b[2] + "</span></div>";
  }).join("");
  var CAL = (W.calendar || []).filter(function (e) { return e.imp >= 2; }).sort(function (a, b) { return new Date(a.at) - new Date(b.at); });
  function next() {
    var now = Date.now(), n = CAL.filter(function (e) { return new Date(e.at).getTime() > now; })[0], el = $("econ-next");
    if (!n) { el.innerHTML = "<small>Next big release</small><b>See the full calendar</b><span>New dates go up every Sunday.</span>"; return; }
    var ms = new Date(n.at) - now, d = Math.floor(ms / 864e5), hr = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
    var when = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", month: "short", day: "numeric" }).format(new Date(n.at));
    el.innerHTML = "<small>Next big release &middot; " + when + "</small><b>" + n.name + "</b>" +
      "<div class='econ-cd'><div><i>" + d + "</i>days</div><div><i>" + hr + "</i>hrs</div><div><i>" + m + "</i>min</div></div><span>What it is and why it matters &rarr;</span>";
  }
  next(); setInterval(next, 30000);
})();
