// ============================================================
//  THIS WEEK — the only file to change each week.
//  Used by market.html (the weekly update) and invest-path.html
//  (the "this week for you" note on each path).
//  Journeys: ret = saving for retirement, near = close to or in retirement,
//  self = investing on your own, buy = buying a home, own = own my home,
//  rent = own rental property.
//  Rules: say what changed, with sources. No predictions, no buy/sell,
//  no tickers. "for" lines say what it can mean, never what to buy.
// ============================================================
window.WEEKLY = {
  asof: "Monday, November 23, 2026",
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
