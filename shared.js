// Connects the tools: remembers answers across tools (in this browser only),
// saves each tool's results for the "Your plan" page, and emails results.
(function () {
  var KEY = "mb_plan_v1";
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function store(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  var data = load(); data.profile = data.profile || {}; data.results = data.results || {};

  var MB = window.MB = {};
  MB.get = function (k) { return data.profile[k]; };
  MB.set = function (k, v) { data.profile[k] = v; store(data); };

  // bind({ inputId: "profileKey" }) — fill inputs from earlier answers, remember new ones
  MB.bind = function (map) {
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id); if (!el) return;
      var v = data.profile[map[id]];
      if (v !== undefined && v !== null && v !== "") { el.value = v; el.classList.add("prefilled"); }
      el.addEventListener("input", function () { el.classList.remove("prefilled"); MB.set(map[id], el.value); });
    });
  };

  // saveResult("dime", { title, headline, lines: [], url })
  MB.saveResult = function (id, r) { r.at = new Date().toISOString(); data.results[id] = r; store(data); };
  MB.results = function () { return data.results; };
  MB.clear = function () { data = { profile: {}, results: {} }; store(data); };

  MB.summaryText = function (ids) {
    var out = [];
    var ORDER = ["prep", "events", "moneyplan", "transition", "negotiate", "independence", "retire", "debt", "stress", "dime", "business", "leadership", "checklist", "iul"];
    (ids || ORDER.concat(Object.keys(data.results).filter(function (k) { return ORDER.indexOf(k) === -1; }))).forEach(function (id) {
      var r = data.results[id]; if (!r) return;
      out.push(r.title.toUpperCase() + "\n" + r.headline + (r.lines && r.lines.length ? "\n- " + r.lines.join("\n- ") : ""));
    });
    return out.join("\n\n");
  };



  function enc(o) { return Object.keys(o).map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(o[k]); }).join("&"); }

  // Sends to Micah (Netlify Forms, emailed to him) and to the client (MailerLite automation)
  MB.send = function (p) {
    var cfg = window.SITE_CONFIG || {}, ml = cfg.mailerlite || {}, jobs = [];
    if (p.share) {
      jobs.push(fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: enc({ "form-name": "results", name: p.name, email: p.email, phone: p.phone || "", tool: p.tool, source: window.MB_SOURCE || "WEBSITE", checkins: p.checkin || "none", summary: p.summary, "bot-field": "" }) })
        .then(function (r) { if (!r.ok) throw new Error("netlify"); return "micah"; }));
    }
    if (p.clientCopy !== false && ml.accountId && ml.formId) {
      var fd = new FormData();
      fd.append("fields[name]", p.name); fd.append("fields[email]", p.email);
      fd.append("fields[last_tool]", p.tool);
      fd.append("fields[results_summary]", p.summary.slice(0, 1000));
      if (p.checkin) fd.append("fields[checkin_frequency]", p.checkin);
      if (p.changes) fd.append("fields[checkin_changes]", p.changes.slice(0, 1000));
      fd.append("ml-submit", "1"); fd.append("anticsrf", "true");
      jobs.push(fetch("https://assets.mailerlite.com/jsonp/" + ml.accountId + "/forms/" + (ml.resultsFormId || ml.formId) + "/subscribe",
        { method: "POST", body: fd, mode: "no-cors" }).then(function () { return "client"; }));
    }
    if (!jobs.length) return Promise.reject(new Error("not set up"));
    return Promise.allSettled(jobs).then(function (rs) {
      var ok = rs.filter(function (r) { return r.status === "fulfilled"; }).map(function (r) { return r.value; });
      if (!ok.length) throw new Error("failed");
      return ok;
    });
  };


  // Suggested next tools, shown before the email box
  var TOOLS = {
    stress: ["One Bad Tuesday stress test", "stress-test.html", "See how much breathing room you have."],
    moneyplan: ["What job does your money need to do?", "money-plan.html", "Set your goals and give every dollar a job."],
    dime: ["Life insurance calculator", "dime-calculator.html", "How much coverage your family would actually need."],
    independence: ["Independence Number calculator", "independence-number.html", "What it would take to make work optional."],
    checklist: ["Before-you-buy checklist", "product-checklist.html", "The questions to ask before buying any product."],
    business: ["Owner exposure check", "business-exposure.html", "What's at risk if you're out of the business for six months."],
    leadership: ["Key leadership risk calculator", "leadership-risk.html", "The cost of losing a key leader unexpectedly."],
    debt: ["Debt freedom planner", "debt-freedom.html", "Your debt-free date, and the order to pay things off."],
    retire: ["Retirement accounts checkup", "retirement-accounts.html", "Employer match, old 401(k)s, Roth or traditional, IULs, and annuities."],
    negotiate: ["Salary negotiation planner", "negotiate.html", "Your ask, your range, and what to say in the pay conversation."],
    events: ["Life event planner", "life-events.html", "Marriage, a baby, a new home, a new job: what to do and what to save."],
    iul: ["Protected growth and being your own bank", "iul-explained.html", "How indexed life insurance growth and policy loans work, with the trade-offs."],
    transition: ["Your next income", "income-transition.html", "Map the move to better work, your own business, or more time."],
    prep: ["Before we meet", "prepare.html", "Two minutes of questions so our first conversation starts where you are."]
  };
  MB.TOOLS = TOOLS;
  var NEXT = {
    stress: ["moneyplan", "debt", "dime", "independence"],
    moneyplan: ["transition", "debt", "independence", "dime"],
    transition: ["moneyplan", "stress", "dime", "debt"],
    dime: ["moneyplan", "independence", "debt", "stress"],
    independence: ["retire", "moneyplan", "debt", "dime"],
    checklist: ["moneyplan", "dime", "independence", "stress"],
    business: ["moneyplan", "dime", "debt", "leadership"],
    leadership: ["business", "checklist", "moneyplan"],
    debt: ["moneyplan", "independence", "dime", "stress"],
    prep: ["moneyplan", "stress", "debt", "dime"],
    iul: ["moneyplan", "independence", "checklist", "dime"],
    events: ["moneyplan", "dime", "stress", "debt"],
    retire: ["independence", "iul", "moneyplan", "dime"],
    negotiate: ["moneyplan", "retire", "transition", "independence"]
  };
  // ---- Plan completeness: nudges people to finish the core tools ----
  var CORE = ["moneyplan", "transition", "stress", "debt", "dime", "independence", "retire"];
  MB.progress = function () {
    var core = CORE.slice();
    if (data.results.business) core.push("business");
    if (data.results.leadership) core.push("leadership");
    var done = core.filter(function (k) { return data.results[k]; });
    var missing = core.filter(function (k) { return !data.results[k]; });
    return { core: core, done: done.length, total: core.length, missing: missing, pct: Math.round(done.length / core.length * 100) };
  };
  MB.progressHtml = function (skip) {
    var p = MB.progress(), miss = p.missing.filter(function (k) { return k !== skip; });
    var h = "<div class='progress-box'><div class='pb-top'><b>Your plan: " + p.done + " of " + p.total + " parts done</b><span>" + p.pct + "%</span></div><div class='bar'><div style='width:" + Math.max(p.pct, 3) + "%'></div></div>";
    if (miss.length) {
      var nx = TOOLS[miss[0]];
      h += "<p>Finish the rest so your plan shows the whole picture. Each one goes faster than the last, because your answers carry over.</p>" +
        "<a class='btn' href='" + nx[1] + "'>Next: " + nx[0] + " &rarr;</a>" +
        (miss.length > 1 ? "<div class='pb-rest'>Also left: " + miss.slice(1).map(function (k) { return "<a href='" + TOOLS[k][1] + "'>" + TOOLS[k][0] + "</a>"; }).join(" &middot; ") + "</div>" : "");
    } else {
      h += "<p>Your plan is complete. Update it here each month, and we'll review it together once or twice a year.</p>";
    }
    return h + "</div>";
  };
  MB.suggest = function (elId, toolId) {
    var el = document.getElementById(elId); if (!el) return;
    el.className = "suggest"; el.innerHTML = MB.progressHtml(toolId);
  };

  // ---- Check-ins: dated snapshots so people can see progress over time ----
  // Numbers people answer at each check-in. b = which direction is better.
  MB.CK = {
    cashSaved: { l: "Cash saved", f: "$", b: "up" },
    savedMonth: { l: "Saved or invested this month", f: "$", b: "up" },
    debtTotal: { l: "Total debt", f: "$", b: "down" },
    retPct: { l: "Pay going to retirement", f: "%", b: "up" },
    newIncome: { l: "Monthly income from the new path", f: "$", b: "up" },
    buildHours: { l: "Hours a week on the new path", f: "n", b: "up" },
    customers: { l: "Paying customers or clients", f: "n", b: "up" },
    apps: { l: "Applications and networking conversations", f: "n", b: "up" },
    interviews: { l: "Interviews", f: "n", b: "up" },
    ownerHours: { l: "Hours a week the business still needs you", f: "n", b: "down" }
  };
  MB.CKT = { onPlan: "Stuck to the money plan", fullMatch: "Getting the full employer match", offer: "Offer or raise", coverage: "Coverage changes", blocker: "What's in the way", win: "Win since last time", help: "Wants help with" };
  MB.checkins = function () { return data.checkins || []; };
  var snap = function () { var items = {}; Object.keys(data.results).forEach(function (k) { var r = data.results[k]; items[k] = { h: r.headline, m: r.m || null }; }); return items; };
  var sameDay = function (a, b) { return new Date(a).toDateString() === new Date(b).toDateString(); };
  MB.checkin = function (answers) {
    var cs = data.checkins || [], last = cs[cs.length - 1], now = new Date().toISOString();
    if (!answers && last && sameDay(last.at, now)) { last.items = snap(); store(data); return; }
    var a = answers || (last && last.answers) || null;
    data.checkins = cs.concat([{ at: now, items: snap(), answers: a }]).slice(-24);
    store(data);
  };
  // Quick update from a card: fold into today's snapshot, keeping the earlier values as the baseline
  MB.quickSave = function (vals, prev) {
    var cs = data.checkins || [], now = new Date().toISOString();
    if (!cs.length) { var base = {}; Object.keys(prev || {}).forEach(function (k) { if (prev[k] !== "" && prev[k] !== undefined) base[k] = +prev[k]; }); cs = [{ at: now, items: snap(), answers: base }]; }
    var last = cs[cs.length - 1], merged = JSON.parse(JSON.stringify(last.answers || {}));
    var folding = cs.length > 1 && sameDay(last.at, now), baseCk = folding ? cs[cs.length - 2] : last;
    baseCk.answers = baseCk.answers || {};
    Object.keys(vals).forEach(function (k) { if (baseCk.answers[k] === undefined && prev && prev[k] !== "" && prev[k] !== undefined) { baseCk.answers[k] = +prev[k]; if (!folding) merged[k] = +prev[k]; } });
    Object.keys(vals).forEach(function (k) { merged[k] = vals[k]; });
    if (folding) { last.answers = merged; last.items = snap(); }
    else cs = cs.concat([{ at: now, items: snap(), answers: merged }]);
    data.checkins = cs.slice(-24); store(data);
  };

  // ---- What changed since the last check-in ----
  MB.fmt = function (m, v) { return m.f === "$" ? (v < 0 ? "-$" : "$") + Math.abs(Math.round(v)).toLocaleString("en-US") : m.f === "%" ? v + "%" : String(v); };
  var dir = function (d, b) { return d === 0 ? "same" : ((d > 0) === (b === "up") ? "better" : "worse"); };
  // Answers from the latest check-in compared with the one before it
  MB.answerChanges = function () {
    var cs = data.checkins || [], last = cs[cs.length - 1], prev = cs[cs.length - 2];
    if (!last || !last.answers) return null;
    var out = [], a = last.answers, b = prev && prev.answers ? prev.answers : {};
    Object.keys(MB.CK).forEach(function (k) {
      if (a[k] === undefined || a[k] === "") return;
      var q = MB.CK[k], now = +a[k];
      if (b[k] === undefined || b[k] === "") out.push({ k: k, label: q.l, from: "", to: MB.fmt(q, now), dir: "new" });
      else out.push({ k: k, label: q.l, from: MB.fmt(q, +b[k]), to: MB.fmt(q, now), dir: dir(now - b[k], q.b) });
    });
    return { at: last.at, since: prev ? prev.at : null, list: out, text: a };
  };
  // Tool results that moved since the latest check-in (only the ones that changed)
  MB.changes = function () {
    var cs = data.checkins || [], last = cs[cs.length - 1]; if (!last) return null;
    var out = [];
    Object.keys(data.results).forEach(function (k) {
      var r = data.results[k], was = last.items[k];
      if (!r.m || !was || !was.m) return;
      var d = r.m.v - was.m.v; if (d === 0) return;
      out.push({ k: k, label: r.m.l, from: MB.fmt(r.m, was.m.v), to: MB.fmt(r.m, r.m.v), dir: dir(d, r.m.b) });
    });
    return { since: last.at, list: out };
  };
  // ---- Action plan from a review meeting (made on plan-builder.html, opened from a link) ----
  MB.apEncode = function (o) { return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
  MB.apDecode = function (s) { try { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return JSON.parse(decodeURIComponent(escape(atob(s)))); } catch (e) { return null; } };
  MB.actionPlan = function () { return data.profile.actionPlan || null; };
  MB.apDone = function () { return data.profile.apDone || {}; };
  MB.apStatus = function () {
    var ap = MB.actionPlan(); if (!ap) return null;
    var done = MB.apDone(), today = new Date().toISOString().slice(0, 10);
    var mine = ap.act.filter(function (a) { return a.who === "You"; });
    var finished = mine.filter(function (a) { return done[a.t]; });
    var late = mine.filter(function (a) { return !done[a.t] && a.due && a.due < today; });
    return { total: mine.length, done: finished.length, late: late, next: ap.next };
  };
  MB.changesText = function () {
    var ac = MB.answerChanges(), c = MB.changes(), t = [];
    var dfm = function (d) { return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric" }); };
    if (ac) {
      t.push("Check-in " + dfm(ac.at) + (ac.since ? " (compared with " + dfm(ac.since) + ")" : "") + ":");
      ac.list.forEach(function (x) { t.push("- " + x.label + ": " + (x.from ? x.from + " -> " + x.to + " (" + x.dir + ")" : x.to)); });
      Object.keys(MB.CKT).forEach(function (k) { if (ac.text[k]) t.push("- " + MB.CKT[k] + ": " + ac.text[k]); });
    }
    var aps = MB.apStatus();
    if (aps && aps.total) {
      t.push("Action plan: " + aps.done + " of " + aps.total + " of their to-dos done" + (aps.late.length ? "; overdue: " + aps.late.map(function (x) { return x.t; }).join("; ") : ""));
    }
    if (c && c.list.length) {
      t.push("Tool results updated since " + dfm(c.since) + ":");
      c.list.forEach(function (x) { t.push("- " + x.label + ": " + x.from + " -> " + x.to + " (" + x.dir + ")"); });
    }
    return t.join("\n");
  };

  // ---- Stage, using Life Backend's four stages ----
  var STAGES = {
    Build: "Establishing cash flow stability and the first layer of protection.",
    Protect: "Your foundation exists. The risk now is one event undoing what you've built.",
    Deploy: "Real surplus exists. The question is what job each dollar is doing.",
    Preserve: "The focus shifts to control, income, and passing things on."
  };
  MB.stage = function () {
    var r = data.results, age = parseFloat(data.profile.age) || 0;
    var foundation = (r.dime && r.dime.pct >= 75) || parseFloat(data.profile.ownLife) > 0;
    var cushion = r.stress ? r.stress.pct >= 40 : true;
    var surplus = r.moneyplan && r.moneyplan.m && r.moneyplan.m.v <= 0;
    var name = age >= 58 ? "Preserve" : foundation && cushion && surplus ? "Deploy" : foundation && cushion ? "Protect" : "Build";
    return { name: name, desc: STAGES[name] };
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // MB.sendBox("sendBox", "dime", "your life insurance estimate")
  MB.sendBox = function (elId, toolId, label, heading) {
    var box = document.getElementById(elId); if (!box) return;
    var p = MB.progress(), complete = !p.missing.length || toolId === "prep";
    if (toolId !== "plan") {
      var sg = document.getElementById(elId + "-suggest");
      if (!sg) { sg = document.createElement("div"); sg.id = elId + "-suggest"; box.parentNode.insertBefore(sg, box); }
      if (toolId !== "prep") MB.suggest(sg.id, toolId);
    }
    var others = Object.keys(data.results).filter(function (k) { return k !== toolId; }).length;
    var form =
      "<form class='sb-form' novalidate>" +
      "<div class='sb-row'><div class='field'><label>First name</label><input name='name' autocomplete='given-name'></div>" +
      "<div class='field'><label>Email</label><input name='email' type='email' autocomplete='email'></div>" +
      "<div class='field'><label>Phone (optional)</label><input name='phone' type='tel' autocomplete='tel'></div></div>" +
      (others ? "<label class='checkline'><input type='checkbox' name='all' checked> " + (toolId === "plan" ? "Include all my results (" + others + ")" : "Include my results from the other tools (" + others + ")") + "</label>" : "") +
      "<label class='checkline'><input type='checkbox' name='share' checked> Also send to Micah Bryant so he can review it with me</label>" +
      "<div class='field' style='max-width:360px'><label>Check-in reminders</label><select name='checkin'><option value='monthly'>Monthly: keep me on track</option><option value='quarterly'>Every 3 months</option><option value=''>No reminders</option></select></div>" +
      "<div class='err'></div><button class='btn' type='submit'>Email my " + (complete ? "plan" : "results so far") + "</button>" +
      "<p class='fine'>Your results are emailed to you and, if checked, to Micah. Reminders bring you back to update your plan; unsubscribe anytime. Your information is never sold.</p></form>";
    box.className = "sendbox";
    box.innerHTML = complete
      ? "<div class='sb-head'><h3>" + esc(heading || ("Email yourself " + label)) + "</h3><p class='muted'>Keep a copy, and get a reminder to check in so you can see your progress over time. <a href='my-plan.html'>See your full plan &rarr;</a></p></div>" + form
      : "<details class='sb-later'><summary>Not ready to finish? Email what you have so far</summary>" + form + "</details>";
    var f = box.querySelector("form"), err = box.querySelector(".err");
    ["name", "email", "phone"].forEach(function (n) { if (data.profile["c_" + n]) f[n].value = data.profile["c_" + n]; });
    if (data.profile.c_checkin !== undefined) f.checkin.value = data.profile.c_checkin;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = f.name.value.trim(), email = f.email.value.trim(), phone = f.phone.value.trim();
      if (!name) { err.textContent = "Please add your first name."; return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = "Please enter a valid email."; return; }
      MB.set("c_name", name); MB.set("c_email", email); MB.set("c_phone", phone); MB.set("c_checkin", f.checkin.value);
      var ids = f.all && f.all.checked ? null : [toolId];
      err.textContent = ""; var btn = f.querySelector("button"), btnText = btn.textContent; btn.disabled = true; btn.textContent = "Sending...";
      MB.send({ name: name, email: email, phone: phone, tool: label, summary: (MB.changesText() ? "WHAT CHANGED\n" + MB.changesText() + "\n\n" : "") + MB.summaryText(ids), changes: MB.changesText(), share: f.share.checked, checkin: f.checkin.value })
        .then(function (ok) {
          MB.checkin();
          f.outerHTML = "<div class='flag good'><b>Sent.</b> " +
            (ok.indexOf("client") !== -1 ? "Check your inbox in a few minutes. " : "") +
            (ok.indexOf("micah") !== -1 ? "Micah has a copy too and may reach out to go over it. " : "") +
            (f.checkin.value ? "You'll get a " + (f.checkin.value === "monthly" ? "monthly" : "quarterly") + " reminder to check in. " : "") +
            "<a href='my-plan.html'>View your full plan</a>.</div>";
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = btnText;
          err.innerHTML = "Couldn't send from here. Your results are saved on this device: <a href='my-plan.html'>open your plan</a> to print or save them as a PDF.";
        });
    });
  };

})();
