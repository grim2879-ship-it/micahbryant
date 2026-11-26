// ============================================================
//  QUICK CALCULATORS — the library behind "This week's tool".
//  Each tool: title, stops (1–6, the same six stops as the calls and
//  videos), quarters (1–4), who it's for, inputs, a calc, and one line
//  per stop on what the result means. weekly.js `tool` picks this
//  week's; without one, the quarter's list rotates by week.
//  No product projections here: no IUL growth or crediting rates.
// ============================================================
(function () {
  var $$ = function (n) { return Math.round(n).toLocaleString("en-US"); };
  var usd = function (n) { return (n < 0 ? "−$" : "$") + $$(Math.abs(n)); };
  var pct = function (n) { return (Math.round(n * 10) / 10) + "%"; };
  var pay = function (p, r, n) { var i = r / 100 / 12; return i ? p * i / (1 - Math.pow(1 + i, -n)) : p / n; };
  var fv = function (perYear, r, yrs) { var v = 0; for (var y = 0; y < yrs; y++) v = (v + perYear) * (1 + r / 100); return v; };

  var STOPS = [
    null,
    { n: "In debt or tight", f: "I make money and it's gone", hook: "If you want to see where your month actually goes, that's the first conversation I have with people." },
    { n: "Stable", f: "One bad month would sink me", hook: "Want to check what would hold if your income stopped for three months?" },
    { n: "Planned", f: "I don't know what I'm working toward", hook: "I build three versions of a plan with people. You pick where to start." },
    { n: "Carrying it out", f: "I know what to do, I just don't do it", hook: "With me, with your advisor, or on your own: I'll help you pick and set the check-ins." },
    { n: "Retirement income", f: "Will it be enough?", hook: "Want to see what replaces your paycheck, month by month?" },
    { n: "Money working", f: "My money just sits there", hook: "Let's name the job of every account you have." }
  ];
  // A path chosen elsewhere on the site suggests a starting stop
  var JOURNEY_STOP = { ret: 3, near: 5, self: 6, buy: 2, own: 3, rent: 6 };

  var T = {
    rate: { t: "What a rate change does to a payment", short: "Two numbers, the amount and the rate, show the monthly payment and what each half point changes.",
      stops: [2, 3], q: [1, 2, 3, 4], who: ["employee", "owner", "self"], full: ["invest-path.html?j=buy", "The buying-a-home path"],
      inputs: [["amt", "Amount you'd borrow", 350000, "$"], ["rate", "Interest rate", 6.75, "%"]],
      calc: function (v) { var a = pay(v.amt, v.rate, 360), b = pay(v.amt, v.rate + 0.5, 360);
        return { big: [["Monthly payment", usd(a) + "/mo"], ["Each half point higher adds", usd(b - a) + "/mo"]], note: "Principal and interest on a 30-year fixed loan. Taxes, insurance and any HOA come on top. An estimate, not a quote.", r: { up: (b - a) * 12 } }; },
      mean: { 2: function (r) { return "Half a point is about " + usd(r.up) + " a year. Make sure your cushion still covers three months after the new payment."; },
        3: function (r) { return "Put the payment in your plan first, then see what's left for your other goals. Half a point moves it about " + usd(r.up) + " a year."; } } },

    debt: { t: "Which debt to pay first", short: "Pay the minimums, then put every extra dollar on the highest rate. Here's what that order saves.",
      stops: [1], q: [1, 3], who: ["employee", "self", "owner"], full: ["debt-freedom.html", "Debt freedom planner"],
      inputs: [["b1", "Debt 1 balance", 6000, "$"], ["r1", "Debt 1 rate", 24, "%"], ["b2", "Debt 2 balance", 12000, "$"], ["r2", "Debt 2 rate", 8, "%"], ["p", "Total you can pay each month", 700, "$"]],
      calc: function (v) {
        function run(order) { var d = order.map(function (x) { return { b: x[0], r: x[1] }; }), m = 0, int = 0;
          while (d.some(function (x) { return x.b > 0.5; }) && m < 600) { m++; var left = v.p;
            d.forEach(function (x) { if (x.b > 0) { var i = x.b * x.r / 1200; int += i; x.b += i; } });
            d.forEach(function (x) { if (x.b > 0) { var mn = Math.min(x.b, Math.max(25, x.b * 0.02)); x.b -= mn; left -= mn; } });
            d.forEach(function (x) { if (x.b > 0 && left > 0) { var e = Math.min(x.b, left); x.b -= e; left -= e; } });
            if (left < 0 && m > 2) { var tot = d.reduce(function (s, x) { return s + x.b; }, 0); if (tot > v.b1 + v.b2) return { m: 600, int: int }; } }
          return { m: m, int: int }; }
        var hi = [[v.b1, v.r1], [v.b2, v.r2]].sort(function (a, b) { return b[1] - a[1]; }), sm = [[v.b1, v.r1], [v.b2, v.r2]].sort(function (a, b) { return a[0] - b[0]; });
        var A = run(hi), S = run(sm), stuck = A.m >= 600;
        return { big: stuck ? [["Debt-free date", "Not at this payment"], ["Try", "A higher monthly amount"]] : [["Debt-free in", A.m + " months"], ["Interest, highest rate first", usd(A.int)]],
          note: stuck ? "The payment doesn't cover the interest. Even a small increase changes this." : "Smallest balance first would cost " + usd(S.int) + " in interest" + (S.int - A.int > 1 ? ", about " + usd(S.int - A.int) + " more" : "") + ". Minimums assumed at 2% of the balance or $25.", r: { m: A.m, stuck: stuck } }; },
      mean: { 1: function (r) { return r.stuck ? "The first move is finding room in the month so the payment beats the interest." : "That's a date you can plan around. Once one debt is gone, its payment rolls into the next one."; } } },

    cushion: { t: "How long your cushion lasts", short: "Cash you can reach at full value is what turns a bad month into an inconvenience instead of a crisis.",
      stops: [1, 2], q: [1, 2], who: ["employee", "self", "owner", "retired"], full: ["stress-test.html", "One Bad Tuesday stress test"],
      inputs: [["ess", "Essential bills each month", 4000, "$"], ["cash", "Cash you could reach this week", 6000, "$"], ["save", "You could add each month", 300, "$"]],
      calc: function (v) { var wk = v.ess ? v.cash / (v.ess / 4.33) : 0, gap = Math.max(0, v.ess * 3 - v.cash), mo = v.save ? Math.ceil(gap / v.save) : null;
        return { big: [["Your cushion lasts", Math.floor(wk) + " weeks"], ["To reach 3 months", gap ? usd(gap) + " more" : "You're there"]], note: gap ? (mo ? "At " + usd(v.save) + " a month, that's about " + mo + " months away." : "") : "Next marker: six months of essentials.", r: { wk: wk, gap: gap } }; },
      mean: { 1: function (r) { return "Even one month of cushion stops new debt from piling on when something breaks."; },
        2: function (r) { return r.gap ? "Three months is the line where one bad month stops being a crisis." : "You've got the floor. Next is protecting the income that refills it."; } } },

    coverage: { t: "How much coverage replaces your income", short: "If your income stopped for good, how many years would your family need it replaced, and what do you have now?",
      stops: [2, 3], q: [3, 4], who: ["employee", "self", "owner"], full: ["dime-calculator.html", "Life insurance calculator"],
      inputs: [["inc", "Your yearly income", 70000, "$"], ["yrs", "Years your family would need it", 10, "n"], ["debt", "Mortgage and debts to clear", 200000, "$"], ["have", "Coverage you have now", 100000, "$"]],
      calc: function (v) { var need = v.inc * v.yrs + v.debt, gap = Math.max(0, need - v.have), yrsNow = v.inc ? Math.max(0, v.have - v.debt) / v.inc : 0;
        return { big: [["Rough need", usd(need)], ["Gap", gap ? usd(gap) : "Covered"]], note: "What you have now would clear the debts and replace about " + (Math.round(yrsNow * 10) / 10) + " years of income. A rough guide, not a quote.", r: { gap: gap } }; },
      mean: { 2: function (r) { return r.gap ? "Your cushion covers a bad month. Coverage is what covers the worst one." : "Your family's floor is in place. Check it again when income or debt changes."; },
        3: function (r) { return "Every goal in your plan runs on your income. This is what keeps the plan alive if it stops."; } } },

    workcover: { t: "What your coverage at work actually replaces", short: "Open enrollment is the one time a year to check it. Most work coverage is a multiple of salary, and it usually ends when the job does.",
      stops: [2, 3], q: [4], who: ["employee"], full: ["dime-calculator.html", "Life insurance calculator"],
      inputs: [["inc", "Your yearly income", 70000, "$"], ["mult", "Work coverage, times your salary", 1, "n"], ["yrs", "Years your family would need it", 10, "n"]],
      calc: function (v) { var have = v.inc * v.mult, need = v.inc * v.yrs;
        return { big: [["Work coverage", usd(have)], ["Years of income it replaces", (Math.round(v.mult * 10) / 10) + " of " + v.yrs]], note: "That leaves about " + usd(Math.max(0, need - have)) + " of income unreplaced, before any mortgage or debts. Check your benefits summary for your real multiple.", r: { short: need - have } }; },
      mean: { 2: function (r) { return "Work coverage is a good start, but it's tied to the job. If you leave or get laid off, it usually goes with it."; },
        3: function (r) { return "If your plan depends on this coverage, it depends on staying at this job. Decide that on purpose."; } } },

    retgap: { t: "Your retirement income gap", short: "Turn savings into a monthly paycheck and see what's left to fill.",
      stops: [5], q: [2, 4], who: ["retired", "employee", "owner"], full: ["independence-number.html", "Independence Number calculator"],
      inputs: [["need", "Monthly income you'll want", 6000, "$"], ["ss", "Social Security and pensions, monthly", 2800, "$"], ["sav", "Retirement savings", 400000, "$"]],
      calc: function (v) { var fromSav = v.sav * 0.04 / 12, gap = v.need - v.ss - fromSav;
        return { big: [["From your savings", usd(fromSav) + "/mo"], [gap > 0 ? "Monthly gap" : "Monthly cushion", usd(Math.abs(gap)) + "/mo"]], note: "Uses a 4% yearly withdrawal as a rough guide, not a promise. Taxes, health costs and inflation change the real number.", r: { gap: gap } }; },
      mean: { 5: function (r) { return r.gap > 0 ? "The gap is what's left to solve: working longer, saving more, spending less, or putting a floor under the essentials." : "The paycheck covers it on paper. The next question is what happens to it in a bad first five years."; } } },

    waiting: { t: "What waiting costs", short: "The same monthly amount, started now or later. The difference is time, not effort.",
      stops: [3, 6], q: [1, 2], who: ["employee", "self", "owner"], full: ["money-plan.html", "Give every dollar a job"],
      inputs: [["m", "Monthly amount", 300, "$"], ["yrs", "Years until you need it", 25, "n"], ["g", "Growth you want to assume, yearly", 6, "%"]],
      calc: function (v) { var now = fv(v.m * 12, v.g, v.yrs), w3 = fv(v.m * 12, v.g, Math.max(0, v.yrs - 3)), w5 = fv(v.m * 12, v.g, Math.max(0, v.yrs - 5));
        return { big: [["Starting now", usd(now)], ["Waiting 3 years costs", usd(now - w3)]], note: "Waiting 5 years costs " + usd(now - w5) + ". Growth is the number you entered, not a prediction; real returns go up and down.", r: { c: now - w3 } }; },
      mean: { 3: function (r) { return "A plan that starts small this month beats a perfect plan next year."; },
        6: function (r) { return "Money sitting idle has a cost too. Give it a job and a start date."; } } },

    buckets: { t: "How each tax bucket grows", short: "The same money in a taxable, a tax-deferred and a tax-free account. Where you hold it can matter as much as what it earns.",
      stops: [6, 5], q: [4, 1], who: ["employee", "self", "owner"], full: ["retirement-accounts.html", "Retirement accounts checkup"],
      inputs: [["amt", "Before-tax dollars you set aside each year", 6000, "$"], ["yrs", "Years", 25, "n"], ["g", "Growth you want to assume, yearly", 6, "%"], ["tn", "Your tax rate now", 22, "%"], ["tl", "Your tax rate in retirement", 22, "%"]],
      calc: function (v) {
        var after = v.amt * (1 - v.tn / 100);
        var taxable = fv(after, v.g * (1 - 0.15), v.yrs), deferred = fv(v.amt, v.g, v.yrs) * (1 - v.tl / 100), free = fv(after, v.g, v.yrs);
        return { big: [["Taxable", usd(taxable)], ["Tax-deferred", usd(deferred)], ["Tax-free", usd(free)]],
          note: "What you could spend after taxes. Taxable assumes about 15% of each year's growth goes to tax. Tax-deferred is taxed when you take it out; tax-free assumes the account's rules are met. Your CPA can tell you which applies to you.",
          r: { win: free > deferred + 1 ? "free" : deferred > free + 1 ? "deferred" : "tie" } }; },
      explain: "<b>Ways to fill each bucket.</b> Taxable: a regular brokerage or savings account. Tax-deferred: a traditional 401(k) or IRA. Tax-free: a Roth IRA or Roth 401(k), or cash-value life insurance such as an IUL, where loans and withdrawals can come out without tax if the policy is set up and kept in force correctly. Each has limits, costs and trade-offs. <a href='iul-explained.html'>How IUL works, with the trade-offs &rarr;</a>",
      mean: { 6: function (r) { return r.win === "free" ? "If you expect a higher tax rate later, money in the tax-free bucket keeps more of its growth." : r.win === "deferred" ? "If you expect a lower tax rate later, deferring can come out ahead." : "With the same tax rate now and later, deferred and tax-free come out even. The difference is the rate you expect."; },
        5: function (r) { return "Having money in more than one bucket lets you choose where each year's income comes from, and how it's taxed."; } } },

    yearend: { t: "What a year-end contribution could save in taxes", short: "Pre-tax contributions to a workplace plan or traditional IRA can lower this year's taxable income, up to the plan's yearly limit.",
      stops: [3, 6], q: [4], who: ["employee", "self", "owner"], full: ["retirement-accounts.html", "Retirement accounts checkup"],
      inputs: [["c", "Extra you could contribute before year-end", 3000, "$"], ["fed", "Your federal tax bracket", 22, "%"], ["st", "Your state tax rate", 5, "%"]],
      calc: function (v) { var s = v.c * (v.fed + v.st) / 100;
        return { big: [["Estimated tax lowered this year", usd(s)], ["What it costs you today", usd(v.c - s)]], note: "An estimate for pre-tax contributions. It's taxed later when you take it out. Limits and deadlines vary by account; check with your CPA.", r: { s: s } }; },
      mean: { 3: function (r) { return "That's about " + usd(r.s) + " that goes toward your future instead of this year's tax bill."; },
        6: function (r) { return "Same money, different bucket. Decide on purpose which bucket each dollar goes into."; } } },

    refund: { t: "What your tax refund could do", short: "One refund, three jobs. See what it does for debt or for your cushion.",
      stops: [1, 2], q: [1], who: ["employee", "self"], full: ["money-plan.html", "Give every dollar a job"],
      inputs: [["ref", "Your refund", 3000, "$"], ["apr", "Highest rate on your debt", 24, "%"], ["ess", "Essential bills each month", 4000, "$"]],
      calc: function (v) { return { big: [["On your highest-rate debt", "Saves ~" + usd(v.ref * v.apr / 100) + "/yr"], ["In your cushion", "+" + Math.floor(v.ref / (v.ess / 4.33)) + " weeks"]], note: "Interest saved is a rough one-year figure at that rate.", r: {} }; },
      mean: { 1: function () { return "If debt is growing, the refund on the highest rate usually does the most."; },
        2: function () { return "If you have less than a month of cushion, start there. Debt payoff is easier with a floor under you."; } } },

    pace: { t: "Your mid-year check: are you on pace?", short: "One goal, where you are, and what it takes from here.",
      stops: [3, 4], q: [2], who: ["employee", "self", "owner", "retired"], full: ["money-plan.html", "Give every dollar a job"],
      inputs: [["goal", "Goal amount", 10000, "$"], ["have", "Saved so far", 3500, "$"], ["mo", "Months left", 6, "n"], ["now", "You put in each month now", 800, "$"]],
      calc: function (v) { var need = v.mo ? Math.max(0, v.goal - v.have) / v.mo : 0, on = v.now >= need - 0.5;
        return { big: [["Needed each month", usd(need)], [on ? "You're on pace" : "Short each month", on ? "Yes" : usd(need - v.now)]], note: on ? "At your current amount you'd finish with about " + usd(v.have + v.now * v.mo - v.goal) + " to spare." : "Options: more each month, more time, or a smaller first milestone.", r: { on: on } }; },
      mean: { 3: function (r) { return r.on ? "The plan works. Protect it by automating the amount." : "Adjust the plan now rather than finding out in December."; },
        4: function (r) { return r.on ? "Keep the check-in on the calendar. That's what got you here." : "Pick one change and set a check-in date for it."; } } }
  };

  // Quarter lists for the weekly rotation (rate is added whenever rates move)
  var Q = { 1: ["refund", "debt", "cushion", "waiting"], 2: ["pace", "retgap", "waiting", "cushion"], 3: ["coverage", "cushion", "debt"], 4: ["yearend", "workcover", "buckets", "coverage"] };
  var QN = { 1: "Jan–Mar: tax season", 2: "Apr–Jun: mid-year check", 3: "Jul–Sep: back to school and renewals", 4: "Oct–Dec: year-end and open enrollment" };

  function thisWeek() {
    var W = window.WEEKLY || {}; if (W.tool && T[W.tool.id]) return W.tool;
    var d = new Date(), q = Math.floor(d.getMonth() / 3) + 1, wk = Math.floor((d - new Date(d.getFullYear(), 0, 1)) / 6048e5);
    var id = Q[q][wk % Q[q].length]; return { id: id, why: T[id].short };
  }
  function startStop() {
    var MB = window.MB, s = MB && parseInt(MB.get("stop"), 10); if (s >= 1 && s <= 6) return s;
    var j = MB && MB.get("journey"); return JOURNEY_STOP[j] || 0;
  }
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  // Renders one tool inside the standard frame
  function render(el, id, o) {
    o = o || {}; var tool = T[id]; if (!el || !tool) return;
    var W = window.WEEKLY || {}, stop = startStop(), vals = {}, uid = "t-" + id;
    tool.inputs.forEach(function (i) { vals[i[0]] = (id === "rate" && i[0] === "rate" && W.rate && W.rate.v) ? W.rate.v : i[2]; });
    el.classList.add("tf");
    el.innerHTML = (o.eyebrow ? "<div class='tf-eye'>" + o.eyebrow + "</div>" : "") +
      "<h3 class='tf-h'>" + tool.t + "</h3><p class='tf-why'>" + esc(o.why || tool.short) + "</p>" +
      (id === "rate" && W.rate && W.rate.v ? "<p class='tf-rate'>Starts at this week's average 30-year fixed rate, " + W.rate.v + "% (" + esc(W.rate.src) + ").</p>" : "") +
      "<div class='tf-in'>" + tool.inputs.map(function (i) { return "<label><span>" + i[1] + "</span><div class='tf-f tf-" + i[3] + "'><input id='" + uid + "-" + i[0] + "' inputmode='decimal' value='" + vals[i[0]] + "'></div></label>"; }).join("") + "</div>" +
      "<div class='tf-out'></div><p class='tf-note'></p>" + (tool.explain ? "<p class='tf-exp'>" + tool.explain + "</p>" : "") +
      "<div class='tf-stop'><div class='tf-sq'>Where are you right now?</div><div class='tf-chips'>" +
      STOPS.slice(1).map(function (s, k) { return "<button type='button' data-s='" + (k + 1) + "'>&ldquo;" + s.f + "&rdquo;</button>"; }).join("") + "</div><div class='tf-mean'></div></div>" +
      "<div class='tf-foot'><a href='" + tool.full[0] + "'>Go deeper: " + tool.full[1] + " &rarr;</a>" + (o.library === false ? "" : "<a href='calculators.html'>All calculators &rarr;</a>") + "</div>";
    var out = el.querySelector(".tf-out"), note = el.querySelector(".tf-note"), mean = el.querySelector(".tf-mean"), last = {};
    function num(k) { var x = parseFloat(String(el.querySelector("#" + uid + "-" + k).value).replace(/[^0-9.\-]/g, "")); return isFinite(x) ? x : 0; }
    function calc() {
      tool.inputs.forEach(function (i) { vals[i[0]] = num(i[0]); });
      var r = tool.calc(vals); last = r.r || {};
      out.innerHTML = r.big.map(function (b) { return "<div><span>" + b[0] + "</span><b>" + b[1] + "</b></div>"; }).join("");
      out.className = "tf-out n" + r.big.length; note.textContent = r.note || ""; stopLine();
    }
    function stopLine() {
      el.querySelectorAll(".tf-chips button").forEach(function (b) { b.classList.toggle("on", +b.getAttribute("data-s") === stop); });
      if (!stop) { mean.innerHTML = ""; return; }
      var S = STOPS[stop], f = tool.mean[stop];
      var BEST = { 1: "debt", 2: "cushion", 3: "pace", 4: "pace", 5: "retgap", 6: "buckets" }, alt = BEST[stop] !== id ? BEST[stop] : null;
      var line = f ? f(last) : "This number still belongs in your plan." + (alt ? " For where you are, start with <a href='calculators.html#" + alt + "'>" + T[alt].t.charAt(0).toLowerCase() + T[alt].t.slice(1) + "</a>." : "");
      mean.innerHTML = "<p><b>At your stop (" + S.n + "):</b> " + line + "</p><p class='tf-hook'>" + S.hook + "</p>" +
        "<a class='btn' href='book.html?utm_source=WEBSITE-TOOL-" + id.toUpperCase() + "&stop=" + stop + "'>Book a review</a>";
    }
    el.querySelectorAll("input").forEach(function (i) { i.addEventListener("input", calc); });
    el.querySelectorAll(".tf-chips button").forEach(function (b) { b.onclick = function () { stop = +b.getAttribute("data-s"); if (window.MB) MB.set("stop", String(stop)); stopLine(); }; });
    calc();
  }
  window.MBT = { TOOLS: T, STOPS: STOPS, Q: Q, QN: QN, thisWeek: thisWeek, render: render };
})();
