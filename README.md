# micahbryant.netlify.app

Static site. No build step. Netlify publishes this folder on every change to `main`.

## Weekly update
- `weekly.js` is the only file that changes each week: the date, the stories (one line per journey), this week's mortgage rate, the number board and the economic calendar.
- It feeds `market.html` (This week), `news.html` (News and calendar), `invest-path.html` and `my-plan.html`.
- Every Sunday a scheduled task drafts it on a branch and opens a pull request.
- Netlify builds a preview link for the pull request. Check it, then merge to publish.
- Rules: say what changed, with sources. No predictions, no buy/sell, no tickers.

## Other settings
- `config.js`: Calendly link, YouTube, MailerLite, licensed states.
- `paths.js`: the steps for each journey. Changes rarely. A step is marked done automatically when the visitor has used its tool (see `MB.STEP` in `shared.js`).
- `tools.js`: the quick calculator library (calculators.html). Each tool is tagged with the six stops and the quarters it fits. `weekly.js` `tool` picks the one shown on This week; without it, the quarter's list rotates. No product projections (no IUL growth or crediting rates) on the public site.
- `news.js`: the calendar page's logic. Add `?now=2026-11-25T09:15:00-05:00` to news.html to preview it as of a given time.
