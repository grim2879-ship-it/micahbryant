// ============================================================
//  PATHS — the steps for each journey. Change rarely.
//  Each journey goes from foundation to money working for you.
//  Step: [title, why it matters, link, link text]
// ============================================================
window.JOURNEYS = {
  ret: { n: "Saving for retirement", goal: "Retire on your timeline, not the market's",
    pitch: "From a solid cushion to knowing your number and staying on pace.",
    steps: [
      ["Build a cushion outside your accounts", "If a surprise bill means pulling from your 401(k), you pay taxes and penalties on top of losing growth. A few months of spending in cash keeps your retirement money working.", "stress-test.html", "Take the stress test"],
      ["Get your full employer match", "It's the closest thing to free money there is. If you're leaving any of it behind, this comes before anything else.", "retirement-accounts.html", "Retirement accounts checkup"],
      ["Protect the income that funds it", "Your contributions come from your paycheck. If the paycheck stops, so does the plan, unless it's protected.", "dime-calculator.html", "See what your family would need"],
      ["Know your number", "The amount that would make work optional. Once you know it, every raise and every year has a clear job.", "independence-number.html", "Find your Independence Number"],
      ["Raise contributions with every raise", "Before your lifestyle catches up, move part of each raise into savings. It's the step that quietly does the most.", "money-plan.html", "Give every dollar a job"]
    ] },
  near: { n: "Close to or in retirement", goal: "Income that lasts as long as you do",
    pitch: "Turning what you've saved into a paycheck that holds up in a bad year.",
    steps: [
      ["Know your retirement income, month by month", "Social Security, any pension, and what you'll draw from savings. Seeing it as a monthly paycheck shows where the gaps are.", "independence-number.html", "Check your Independence Number"],
      ["Keep cash for a down year", "A market drop right as you start withdrawing does the most damage. Money set aside for one to two years means you never have to sell low.", "stress-test.html", "See your breathing room"],
      ["Cover the essentials without the market", "Some people put a floor under their basic bills with Social Security timing, a pension choice or an annuity, so groceries never depend on the market.", "retirement-accounts.html", "Look at your accounts and income options"],
      ["Line up health coverage until Medicare", "Retiring before 65 means bridging coverage until Medicare starts. It's often one of the biggest costs early on.", "book.html?utm_source=WEBSITE-PATH", "Talk it through"],
      ["Update beneficiaries and your will", "Accounts go to whoever's named on them. Check every one, and make sure someone knows where everything is.", "life-events.html", "Life event planner"]
    ] },
  self: { n: "Investing on my own", goal: "Money that works for your goals, not your nerves",
    pitch: "Giving every account a job, so a bad week never touches your bills.",
    steps: [
      ["Keep your cushion outside the market", "Cash you can reach at full value in a bad week. It's what lets you leave investments alone when they're down.", "stress-test.html", "Take the stress test"],
      ["Get any employer match first", "A match is a guaranteed return before markets do anything. Capture it before investing elsewhere.", "retirement-accounts.html", "Retirement accounts checkup"],
      ["Give each account a job", "Retirement, a house, a business, the kids. Money you'll need within a few years has a different job than money for 20 years from now.", "money-plan.html", "Give every dollar a job"],
      ["Name beneficiaries on every account", "Retirement accounts ask. Regular brokerage accounts often don't unless you add a transfer-on-death designation.", "life-events.html", "Life event planner"],
      ["Know the number that makes work optional", "Then your investing has a finish line, not just a balance.", "independence-number.html", "Find your Independence Number"]
    ] },
  buy: { n: "Buying a home", goal: "A home that doesn't stretch everything else",
    pitch: "Buying with a payment you can carry and a cushion left over.",
    steps: [
      ["Know the payment at today's rate", "Price and rate are enough to see the monthly payment, and what each half-point change does to it.", "market.html#homes", "Payment at this week's rate"],
      ["Keep the down payment out of the market", "Money you need within a year or two shouldn't be able to drop 10% the month you need it.", "money-plan.html", "Give every dollar a job"],
      ["Still have a cushion after closing", "Many buyers put everything into the down payment. The first water heater shows why that hurts.", "stress-test.html", "Take the stress test"],
      ["Protect the mortgage", "If something happened to you, could your family keep the house? Coverage sized to the mortgage answers that.", "dime-calculator.html", "Life insurance calculator"],
      ["Plan the first year of owning", "Taxes, insurance and repairs change after year one. Build them into your monthly plan from the start.", "life-events.html?event=home", "New home checklist"]
    ] },
  own: { n: "Own my home", goal: "A paid-off home and a strong cushion",
    pitch: "Making the house part of your foundation, not the whole thing.",
    steps: [
      ["Know which of your debts can change", "A fixed mortgage doesn't move. Home equity lines and credit cards can cost more when rates rise. Pay those down first.", "debt-freedom.html", "Debt freedom planner"],
      ["Keep cash, not just equity", "Equity can't pay a bill this week. A cash cushion can.", "stress-test.html", "See your breathing room"],
      ["Make sure your family could keep the house", "Coverage sized to the mortgage, so the house stays theirs if something happens to you.", "dime-calculator.html", "Life insurance calculator"],
      ["Watch your escrow", "Insurance and property taxes rise over time, and your payment follows. Check it when it's recalculated.", "money-plan.html", "Update your money plan"],
      ["Put the house into your bigger number", "A paid-off home lowers what you need in retirement. Count it in your Independence Number.", "independence-number.html", "Find your Independence Number"]
    ] },
  rent: { n: "Own rental property", goal: "Rentals that carry themselves and keep your family secure",
    pitch: "Keeping your rentals working for you through vacancies, rate changes and life.",
    steps: [
      ["Keep reserves you can reach at full value", "Property cash that isn't invested in the market, so a vacancy or a roof never forces a bad decision.", "stress-test.html", "Take the stress test"],
      ["Know what a rate reset would do", "If a loan resets or needs refinancing soon, price and rate are enough to see the new payment.", "market.html#homes", "Payment at this week's rate"],
      ["Cover the debt in your name", "If something happened to you, your family would keep paying the loans or sell, possibly at a bad time. Coverage sized to that debt gives them time.", "dime-calculator.html", "Life insurance calculator"],
      ["Make sure someone could run it without you", "A manager, a partner or a family member who knows the tenants, the loans and the accounts. Write it down.", "life-events.html", "Life event planner"],
      ["Count rental income toward your number", "Rental income you can rely on lowers what your savings need to reach.", "independence-number.html", "Find your Independence Number"]
    ] }
};
