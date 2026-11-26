// News and economic calendar: renders WEEKLY.board, WEEKLY.calendar and the week's stories.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var W = window.WEEKLY || {}, J = window.JOURNEYS || {}, MB = window.MB;
  var CAL = (W.calendar || []).slice().sort(function (a, b) { return new Date(a.at) - new Date(b.at); });
  var qs = new URLSearchParams(location.search);
  var NOW = qs.get("now") ? new Date(qs.get("now")).getTime() : Date.now();
  var TZ = "America/New_York";
  var TOPICS = { rates: "Rates & the Fed", inflation: "Inflation", jobs: "Jobs", housing: "Housing", growth: "Growth & spending", energy: "Energy", markets: "Markets" };
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var L = function (t) { return MB && MB.linkify ? MB.linkify(esc(t)) : esc(t); };

  // ---- time helpers (everything shown in Eastern Time) ----
  var fmt = function (d, o) { return new Intl.DateTimeFormat("en-US", Object.assign({ timeZone: TZ }, o)).format(d); };
  var dayKey = function (t) { return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(t)); };
  var noTime = function (e) { return /T00:00:00/.test(e.at); };
  var weekStart = function (t) { // Monday of that week, as a day key
    var d = new Date(t), wd = fmt(d, { weekday: "short" }), back = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[wd];
    return dayKey(d.getTime() - back * 864e5);
  };
  var thisWeek = weekStart(NOW);
  var weekLabel = function (wk) {
    var a = new Date(wk), b = new Date(thisWeek), diff = Math.round((a - b) / (7 * 864e5));
    return diff === 0 ? "This week" : diff === 1 ? "Next week" : diff === -1 ? "Last week" : diff > 1 ? "Later" : "Earlier";
  };

  // ---- state ----
  var j = qs.get("j") || (MB && MB.get("journey")) || "";
  if (!J[j]) j = "";
  var onlyMine = false, imps = { 3: true, 2: true, 1: true }, topic = "", open = {};
  var weeks = []; CAL.forEach(function (e) { var w = weekLabel(weekStart(e.at)); if (weeks.indexOf(w) === -1) weeks.push(w); });
  var tab = weeks.indexOf("This week") > -1 ? "This week" : (weeks.filter(function (w) { return w !== "Last week" && w !== "Earlier"; })[0] || weeks[weeks.length - 1]);

  // ---- clock, as-of ----
  function tick() { $("clock").textContent = fmt(new Date(), { weekday: "short", hour: "numeric", minute: "2-digit" }); }
  tick(); setInterval(tick, 15000);
  $("asof").textContent = W.asof ? "Updated " + W.asof : "";

  // ---- board ----
  $("board").innerHTML = (W.board || []).map(function (b) {
    var v = String(b[1]), cls = /^[−-]/.test(v) ? "dn" : /^\+/.test(v) ? "up" : "";
    return "<div class='nw-tile' title='" + esc(b[2]) + "'><small>" + esc(b[0]) + "</small><b class='" + cls + "'>" + esc(v) + "</b><span>" + esc(b[2]) + "</span></div>";
  }).join("");

  // ---- next up countdown ----
  function nextUp() {
    var n = CAL.filter(function (e) { return e.imp >= 2 && new Date(e.at).getTime() > NOW; })[0];
    var box = $("next"); if (!n) { box.hidden = true; return; }
    var ms = new Date(n.at).getTime() - NOW, d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
    box.hidden = false;
    box.innerHTML = "<div><div class='lbl'>Next big release</div><h3>" + esc(n.name) + "</h3><div style='opacity:.85;font-size:15px'>" +
      fmt(new Date(n.at), { weekday: "long", month: "short", day: "numeric" }) + (noTime(n) ? "" : ", " + fmt(new Date(n.at), { hour: "numeric", minute: "2-digit" }) + " ET") + "</div></div>" +
      "<div class='nw-cd'><div><b>" + d + "</b><small>days</small></div><div><b>" + h + "</b><small>hours</small></div><div><b>" + m + "</b><small>min</small></div></div>";
  }
  nextUp(); setInterval(function () { NOW += 30000; nextUp(); }, 30000);

  // ---- filters ----
  function chips() {
    $("jr").innerHTML = "<button type='button' class='tg" + (!j ? " on" : "") + "' data-j=''>Everyone</button>" +
      Object.keys(J).map(function (k) { return "<button type='button' class='tg" + (k === j ? " on" : "") + "' data-j='" + k + "'>" + J[k].n + "</button>"; }).join("") +
      (j ? "<button type='button' class='tg" + (onlyMine ? " on" : "") + "' id='mine'>Only what touches me</button>" : "");
    $("jr").querySelectorAll("[data-j]").forEach(function (b) { b.onclick = function () { j = b.getAttribute("data-j"); if (!j) onlyMine = false; if (MB && j) MB.set("journey", j); all(); }; });
    if ($("mine")) $("mine").onclick = function () { onlyMine = !onlyMine; all(); };
    $("impf").innerHTML = "<span>Household impact</span>" + [[3, "High"], [2, "Medium"], [1, "Low"]].map(function (x) {
      return "<button type='button' class='tg" + (imps[x[0]] ? " on" : "") + "' data-i='" + x[0] + "'><span class='imp l" + x[0] + "'><i></i><i></i><i></i></span> " + x[1] + "</button>"; }).join("");
    $("impf").querySelectorAll("[data-i]").forEach(function (b) { b.onclick = function () { var k = b.getAttribute("data-i"); imps[k] = !imps[k]; all(); }; });
    var present = Object.keys(TOPICS).filter(function (t) { return CAL.some(function (e) { return e.topic === t && e.imp > 0; }); });
    $("topf").innerHTML = "<span>Topic</span><button type='button' class='tg" + (!topic ? " on" : "") + "' data-t=''>All</button>" +
      present.map(function (t) { return "<button type='button' class='tg" + (topic === t ? " on" : "") + "' data-t='" + t + "'>" + TOPICS[t] + "</button>"; }).join("");
    $("topf").querySelectorAll("[data-t]").forEach(function (b) { b.onclick = function () { topic = b.getAttribute("data-t"); all(); }; });
    $("tabs").innerHTML = weeks.map(function (w) {
      var c = CAL.filter(function (e) { return weekLabel(weekStart(e.at)) === w && e.imp > 0; }).length;
      return "<button type='button' class='" + (w === tab ? "on" : "") + "' data-w='" + w + "'>" + w + "<small>" + c + "</small></button>"; }).join("");
    $("tabs").querySelectorAll("[data-w]").forEach(function (b) { b.onclick = function () { tab = b.getAttribute("data-w"); all(); }; });
  }

  // ---- calendar ----
  function row(e, i) {
    var t = new Date(e.at).getTime(), past = noTime(e) ? dayKey(t) < dayKey(NOW) : t <= NOW;
    if (e.imp === 0) return "<tr class='ev hol'><td class='tm'>All day</td><td></td><td class='nm' colspan='5'>" + esc(e.name) + "</td></tr>";
    var mine = j && e.for && e.for[j];
    var act = e.act ? "<b>" + esc(e.act) + "</b>" : past ? "<span class='pend' title='Added in the next weekly update'>Soon</span>" : "<span class='pend'>&mdash;</span>";
    var h = "<tr class='ev" + (past ? " past" : "") + (mine ? " mine" : "") + (open[i] ? " open" : "") + "' data-k='" + i + "' tabindex='0' aria-expanded='" + !!open[i] + "'>" +
      "<td class='tm'>" + (noTime(e) ? "All day" : fmt(new Date(e.at), { hour: "numeric", minute: "2-digit" }).replace(" ", "&nbsp;")) + "</td>" +
      "<td><span class='imp l" + e.imp + "' title='" + ["", "Low", "Medium", "High"][e.imp] + " household impact'><i></i><i></i><i></i></span></td>" +
      "<td class='nm'><b>" + esc(e.name) + "</b></td><td class='num'>" + act + "</td><td class='num fc'>" + (esc(e.fc) || "<span class='pend'>&mdash;</span>") + "</td><td class='num pv'>" + (esc(e.prev) || "<span class='pend'>&mdash;</span>") + "</td><td class='ar'>&#8250;</td></tr>";
    if (open[i]) {
      var fk = j ? (e.for[j] ? [j] : []) : Object.keys(J).filter(function (k) { return e.for && e.for[k]; });
      h += "<tr class='det'><td colspan='7'><div class='det-grid'>" +
        "<div class='det-nums'>Actual: " + (e.act ? esc(e.act) : "not in yet") + (e.fc ? " &middot; Forecast: " + esc(e.fc) : "") + (e.prev ? " &middot; Previous: " + esc(e.prev) : "") + "</div>" +
        "<div><h4>What it is</h4><p>" + L(e.what) + "</p></div><div><h4>Why it reaches your wallet</h4><p>" + L(e.why) + "</p></div>" +
        (fk.length ? "<div class='det-for'><h4>" + (j ? "What it can mean for you" : "What it can mean, by situation") + "</h4>" + fk.map(function (k) { return "<div class='mk-for'>" + (j ? "" : "<b>" + J[k].n + "</b>") + L(e.for[k]) + "</div>"; }).join("") + "</div>"
          : j ? "<div class='det-for'><p class='muted' style='margin:6px 0 0'>Not much here for " + J[j].n.toLowerCase() + " this time.</p></div>" : "") +
        "<div class='det-foot'>" + (e.tool ? "<a class='btn small' href='" + e.tool[0] + "'>" + esc(e.tool[1]) + " &rarr;</a>" : "") +
        (j ? "<a href='invest-path.html?j=" + j + "'>Your " + J[j].n.toLowerCase() + " path &rarr;</a>" : "") + "<span class='src'>" + (e.src ? "Source: " + esc(e.src) : "") + "</span></div>" +
        "</div></td></tr>";
    }
    return h;
  }
  function cal() {
    var list = CAL.map(function (e, i) { return { e: e, i: i }; }).filter(function (x) {
      var e = x.e; if (weekLabel(weekStart(e.at)) !== tab) return false;
      if (e.imp === 0) return !topic && !onlyMine;
      if (!imps[e.imp]) return false;
      if (topic && e.topic !== topic) return false;
      if (onlyMine && !(e.for && e.for[j])) return false;
      return true;
    });
    if (!list.length) { $("cal").innerHTML = "<div class='cal-empty'>Nothing matches these filters this week. Try turning on more impact levels or topics.</div>"; return; }
    var h = "<table class='cal'><thead><tr><th>Time</th><th>Impact</th><th>Event</th><th class='num'>Actual</th><th class='num'>Forecast</th><th class='num'>Previous</th><th></th></tr></thead><tbody>";
    var lastDay = "", nowDone = dayKey(NOW) > dayKey(new Date(list[list.length - 1].e.at)) || dayKey(NOW) < dayKey(new Date(list[0].e.at));
    list.forEach(function (x) {
      var e = x.e, dk = dayKey(e.at), t = new Date(e.at).getTime();
      if (!nowDone && (noTime(e) ? dk > dayKey(NOW) : t > NOW)) { h += "<tr class='now'><td colspan='7'><div></div></td></tr>"; nowDone = true; }
      if (dk !== lastDay) {
        var count = list.filter(function (y) { return dayKey(y.e.at) === dk && y.e.imp === 3; }).length;
        h += "<tr class='day" + (dk === dayKey(NOW) ? " today" : "") + "'><td colspan='7'>" + fmt(new Date(e.at), { weekday: "long", month: "short", day: "numeric" }) + (dk === dayKey(NOW) ? " &middot; Today" : "") + (count >= 2 ? "<em>The big day</em>" : "") + "</td></tr>";
        lastDay = dk;
      }
      h += row(e, x.i);
    });
    $("cal").innerHTML = h + "</tbody></table>";
    $("cal").querySelectorAll("tr.ev[data-k]").forEach(function (r) {
      var go = function () { var k = r.getAttribute("data-k"); open[k] = !open[k]; cal(); };
      r.onclick = function (ev) { if (ev.target.closest("a")) return; go(); };
      r.onkeydown = function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); go(); } };
    });
  }

  // ---- stories + CTA ----
  function stories() {
    $("hl").innerHTML = (W.items || []).map(function (it) {
      var note = j && it.for[j] ? it.for[j] : it.body;
      return "<a class='hl' href='market.html" + (j ? "?j=" + j : "") + "'><h3>" + esc(it.h) + "</h3><p>" + esc(note) + "</p><span>" + (j ? "What it means for you" : "Read it in plain English") + " &rarr;</span></a>";
    }).join("");
    if (j) { $("ctah").textContent = "Your " + J[j].n.toLowerCase() + " path"; $("ctap").textContent = J[j].pitch + " The steps fill in as you use the tools."; $("ctab").href = "invest-path.html?j=" + j; $("ctab").textContent = "Continue my path"; }
  }
  function all() { chips(); cal(); stories(); }
  all();
})();
