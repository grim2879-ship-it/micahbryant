// ============================================================
//  THIS WEEK — the only file to change each week.
//  Used by market.html (the weekly update) and invest-path.html
//  (the "this week for you" note on each path).
//  Journeys: ret = saving for retirement, near = close to or in retirement,
//  self = investing on your own, buy = buying a home, own = own my home,
//  rent = own rental property.
//  Also used by news.html (the board, the calendar) and my-plan.html.
//  Rules: say what changed, with sources. No predictions, no buy/sell,
//  no tickers. "for" lines say what it can mean, never what to buy.
//
//  tool:     this week's quick calculator from tools.js, and one sentence on
//            why it matters this week. Pick from the quarter's list in
//            tools.js (Q4: yearend, workcover, buckets, coverage), or "rate"
//            in a week when rates moved or the Fed meets.
//  rate:     this week's average 30-year fixed mortgage rate, or v: null
//            if no named source gave one. Starts the payment calculator.
//  board:    a few numbers people feel: [label, value, note]
//  calendar: scheduled releases. at = ISO time with the ET offset.
//            imp: 3 high, 2 medium, 1 low, 0 holiday or closure.
//            topic: rates, inflation, jobs, housing, growth, energy, markets.
//            act/fc/prev: actual, forecast (economists' estimate, from the
//            scans only), previous. Leave act "" until it's released.
//            what: what it is. why: why it reaches a household.
//            for: one line per journey it touches. tool: [link, link text].
// ============================================================
window.WEEKLY = {
  asof: "Monday, November 23, 2026",
  tool: { id: "workcover", why: "Open enrollment is open at many jobs right now, and it's the one time a year to check what your coverage at work would actually replace." },
  rate: { v: null, src: "" },
  board: [
    ["10-year Treasury yield", "4.90%", "Nov 25. Mortgage rates tend to follow it."],
    ["Inflation (PCE)", "3.6%", "September, over 12 months. The Fed's target is 2%."],
    ["S&P 500", "\u22120.51%", "Tuesday, Nov 24. Down more than 10% from its record before Monday's bounce."],
    ["Consumer confidence", "103.3", "November, up from 91.9. Highest since January 2025."],
    ["Oil (Brent)", "$90.58", "Nov 25. Feeds gas, shipping and travel costs."],
    ["December rate hike odds", "88.6%", "Market estimate on Nov 23, not a decision."]
  ],
  calendar: [
    { at: "2026-11-24T10:00:00-05:00", imp: 2, topic: "growth", name: "Consumer confidence (November)", act: "103.3", fc: "", prev: "91.9",
      what: "A monthly survey of how people feel about their finances and the economy.",
      why: "Confidence jumped to its highest since January 2025, but a better mood isn't the same as more money left at the end of the month. Affordability is still the issue.",
      for: { ret: "Feeling better is a good time to lock in the habit: raise contributions before spending catches up.", self: "Confidence can run ahead of real income. One survey isn't a reason to change a long-term plan." },
      tool: ["money-plan.html", "Give every dollar a job"], src: "The Conference Board" },
    { at: "2026-11-24T00:00:00-05:00", imp: 1, topic: "housing", name: "Home prices (FHFA and Case-Shiller)", act: "", fc: "", prev: "",
      what: "Two monthly measures of how home prices are changing across the country.",
      why: "Home prices and mortgage rates together decide what a home costs per month.",
      for: { buy: "Price and rate are the two numbers that set your payment.", own: "Rising values can mean a higher assessment, and higher property taxes, later." },
      tool: ["calculators.html#rate", "Payment at this week's rate"], src: "Scan calendar (Kiplinger, FXStreet)" },
    { at: "2026-11-25T07:00:00-05:00", imp: 1, topic: "housing", name: "Mortgage applications (MBA)", act: "", fc: "", prev: "\u22122.3%",
      what: "A weekly count of people applying for mortgages and refinances.",
      why: "It shows how buyers are reacting to rates right now.",
      for: { buy: "Fewer applications can mean less competition. Know your payment before you shop." },
      tool: ["calculators.html#rate", "Payment at this week's rate"], src: "Reuters-sourced calendar" },
    { at: "2026-11-25T08:30:00-05:00", imp: 3, topic: "inflation", name: "Core PCE inflation (October, monthly)", act: "", fc: "0.3%", prev: "0.3%",
      what: "The Fed's preferred measure of underlying inflation. Core leaves out food and energy, though you still pay for both.",
      why: "This is the number the Fed watches most before its December decision. Higher inflation can keep rates high, which reaches mortgages, credit cards and savings rates.",
      for: { ret: "Inflation is why your retirement number keeps moving. Re-check your Independence Number at today's prices once a year.", near: "Know which of your income sources rise with prices (Social Security adjusts each year) and which stay flat.", buy: "Inflation shapes rate expectations, and rate expectations shape mortgage quotes.", rent: "Repair, insurance and tax costs can rise faster than rents. Check your margins." },
      tool: ["independence-number.html", "Find your Independence Number"], src: "BEA, Reuters-sourced calendar" },
    { at: "2026-11-25T08:30:00-05:00", imp: 3, topic: "growth", name: "GDP, 3rd quarter (second estimate)", act: "", fc: "3.4%", prev: "2.2%",
      what: "The broadest measure of how fast the U.S. economy is growing, at an annual rate.",
      why: "Strong growth plus sticky inflation can keep the Fed from cutting rates.",
      for: { self: "What's driving growth (consumers, government, inventories) matters as much as the headline number." },
      tool: ["stress-test.html", "Take the stress test"], src: "BEA, Reuters-sourced calendar" },
    { at: "2026-11-25T08:30:00-05:00", imp: 2, topic: "jobs", name: "Initial jobless claims (weekly)", act: "", fc: "201K", prev: "203K",
      what: "How many people filed for unemployment benefits for the first time last week.",
      why: "It's the quickest read on layoffs. Low claims mean a strong job market.",
      for: { ret: "Your contributions come from your paycheck. Make sure that income is protected.", self: "Claims are noisy week to week, especially around holidays. The 4-week average says more." },
      tool: ["dime-calculator.html", "See what your family would need"], src: "Reuters-sourced calendar" },
    { at: "2026-11-25T08:30:00-05:00", imp: 2, topic: "growth", name: "Personal income (October)", act: "", fc: "0.4%", prev: "0.2%",
      what: "How much Americans earned in total last month, from wages, benefits and investments.",
      why: "Income growing faster than prices means more breathing room. Slower means less.",
      for: { ret: "When income rises, move part of the raise into savings before lifestyle catches up." },
      tool: ["money-plan.html", "Give every dollar a job"], src: "Reuters-sourced calendar" },
    { at: "2026-11-25T08:30:00-05:00", imp: 2, topic: "growth", name: "Durable goods orders (October)", act: "", fc: "0.7%", prev: "1.8%",
      what: "Orders for long-lasting goods like machinery, equipment and aircraft.",
      why: "It shows whether businesses are still investing. Aircraft orders cause big swings.",
      for: {}, tool: null, src: "Reuters-sourced calendar" },
    { at: "2026-11-25T08:30:00-05:00", imp: 1, topic: "housing", name: "Building permits", act: "", fc: "1.295M", prev: "1.398M",
      what: "Permits for new homes, a forward look at how many will be built.",
      why: "Fewer new homes can keep prices high where supply is already tight.",
      for: { buy: "Tight supply is part of why prices hold up even with high rates." },
      tool: ["calculators.html#rate", "Payment at this week's rate"], src: "Reuters-sourced calendar" },
    { at: "2026-11-25T10:00:00-05:00", imp: 2, topic: "housing", name: "New home sales (October)", act: "", fc: "650K", prev: "676K",
      what: "How many newly built homes sold last month, at an annual pace.",
      why: "It shows how buyers are handling today's prices and rates.",
      for: { buy: "If sales slow, builders sometimes offer incentives. Compare the payment, not just the price.", own: "Slower sales nearby can affect what similar homes sell for." },
      tool: ["calculators.html#rate", "Payment at this week's rate"], src: "Reuters-sourced calendar" },
    { at: "2026-11-25T10:30:00-05:00", imp: 1, topic: "energy", name: "Crude oil inventories (EIA)", act: "", fc: "", prev: "+3.38M bbl",
      what: "How much crude oil is stored in the U.S. this week.",
      why: "More oil in storage can ease prices at the pump over time.",
      for: {}, tool: null, src: "Reuters-sourced calendar" },
    { at: "2026-11-25T13:00:00-05:00", imp: 1, topic: "rates", name: "7-year Treasury auction", act: "", fc: "", prev: "4.894%",
      what: "The government borrowing money for seven years. The yield is what it has to pay.",
      why: "Weak demand can push yields up, and longer yields feed into mortgage rates.",
      for: {}, tool: null, src: "Reuters-sourced calendar" },
    { at: "2026-11-25T14:00:00-05:00", imp: 2, topic: "rates", name: "Fed Beige Book", act: "", fc: "", prev: "",
      what: "A plain-language report on business and job conditions in each of the Fed's 12 regions.",
      why: "It can show wage pressure or weakness before the national numbers do, and the Fed reads it before deciding rates.",
      for: { self: "It's a written report, not a number, so headlines can read it different ways." },
      tool: null, src: "Federal Reserve" },
    { at: "2026-11-26T00:00:00-05:00", imp: 0, topic: "markets", name: "Thanksgiving: U.S. markets closed", act: "", fc: "", prev: "", what: "", why: "", for: {}, tool: null, src: "" },
    { at: "2026-11-27T00:00:00-05:00", imp: 0, topic: "markets", name: "U.S. markets close early", act: "", fc: "", prev: "", what: "", why: "", for: {}, tool: null, src: "" },
    { at: "2026-11-29T00:00:00-05:00", imp: 2, topic: "energy", name: "OPEC+ meets on 2027 oil output", act: "", fc: "", prev: "",
      what: "The major oil-producing countries decide how much oil to pump next year.",
      why: "Oil prices feed gas, shipping, travel and heating costs, which show up in everyone's budget.",
      for: { near: "On a fixed income, energy costs are one of the first places inflation hits.", rent: "Utility and maintenance costs follow energy prices." },
      tool: ["money-plan.html", "Give every dollar a job"], src: "Reuters" },
    { at: "2026-12-09T00:00:00-05:00", imp: 3, topic: "rates", name: "Federal Reserve rate decision (Dec 8\u20139 meeting)", act: "", fc: "", prev: "",
      what: "The Fed decides whether to raise, hold or cut its key interest rate.",
      why: "As of Nov 23, markets priced an 88.6% chance of a quarter-point hike. That's a market estimate, not a decision. The rate reaches credit cards, home equity lines, savings accounts and CDs.",
      for: { ret: "Nothing about your contributions needs to change because of one Fed meeting.", near: "Higher rates can mean better yields on safer money and better income rates on some annuities. Know what you're offered before you lock anything in.", buy: "Mortgage quotes can move before and after the decision. Know your payment at a half point higher.", own: "A fixed-rate mortgage doesn't change. Variable-rate debt like a home equity line or credit cards can cost more.", rent: "Loans that reset or need refinancing soon would likely reset higher." },
      tool: ["calculators.html#rate", "Payment at this week's rate"], src: "FXStreet, Reuters" }
  ],
  items: [
    {
      h: "Interest rates could go up again in December",
      body: "Markets are pricing a high chance the Federal Reserve raises rates at its December meeting. The 10-year Treasury yield closed near 4.92%.",
      src: "Reuters, U.S. Treasury",
      for: {
        ret: "Nothing about your contributions needs to change because of one Fed meeting. Keep capturing your full employer match.",
        near: "Higher rates can mean better yields on safer money and better income rates on some annuities. Know what you're being offered before you lock anything in.",
        self: "Rate expectations move stock and bond prices quickly. Money you'll need in the next couple of years shouldn't depend on what the Fed does.",
        buy: "If rates rise in December, mortgage quotes can rise with them. Know what a one-point change does to your payment before you shop.",
        own: "A fixed-rate mortgage doesn't change. Variable-rate debt like a home equity line or credit cards can cost more.",
        rent: "Loans that reset or need refinancing soon would likely reset higher than the loans they replace. Talk to your lender well before the date."
      }
    },
    {
      h: "A big inflation report lands Wednesday",
      body: "October's PCE inflation figure, the Fed's preferred measure, comes out Wednesday at 8:30 AM ET, with an updated estimate of third-quarter growth. Business surveys show the economy still growing but cooling, with price pressures still elevated.",
      src: "U.S. Bureau of Economic Analysis calendar, FXStreet",
      for: {
        ret: "Inflation is why the number you're saving toward keeps moving. Re-check your Independence Number once a year at today's prices.",
        near: "Retirement spending rises with prices. Know which of your income sources keep up with inflation (Social Security adjusts each year) and which stay flat.",
        self: "A hot reading can move markets on the day. A single report isn't a reason to change a long-term plan.",
        buy: "Inflation readings shape rate expectations, and rate expectations shape mortgage quotes.",
        own: "Rising costs show up in insurance and property taxes too. Watch your escrow when it's recalculated.",
        rent: "Repair, insurance and tax costs can rise faster than rents. Check your margins, not just your rents."
      }
    },
    {
      h: "Stocks bounced back hard after a steep drop",
      body: "The major U.S. stock indexes rose sharply Monday, ending a seven-day losing streak for the S&P 500. The index had fallen more than 10% from its record, and one strong day did not erase that.",
      src: "AP News",
      for: {
        ret: "If retirement is years away, a drop means your contributions buy at lower prices. The habit matters more than the week.",
        near: "This is the risk that matters most near retirement: a drop right before or after you start withdrawing. Know which money you'd draw from in a down year.",
        self: "A 10% drop and a sharp rebound within weeks is normal volatility. Keep your cushion outside the market so you're never forced to sell.",
        buy: "If your down payment is invested, a drop like this can shrink it right before you need it.",
        own: "No direct effect on your home. If your emergency cushion is invested, it moved with the market too.",
        rent: "Your property reserves should be money you can reach at full value in a bad week, not money that moves with the market."
      }
    }
  ]
};
