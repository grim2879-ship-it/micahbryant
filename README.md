# micahbryant.netlify.app

Static site. No build step. Netlify publishes this folder on every change to `main`.

## Weekly update
- `weekly.js` is the only file that changes each week (date, items, sources, one line per journey).
- Every Sunday a scheduled task drafts it on a branch and opens a pull request.
- Netlify builds a preview link for the pull request. Check it, then merge to publish.
- Rules: say what changed, with sources. No predictions, no buy/sell, no tickers.

## Other settings
- `config.js`: Calendly link, YouTube, MailerLite, licensed states.
- `paths.js`: the steps for each journey. Changes rarely.
