# torn-merit-tracker — Project Profile

(Global operating mandate — Agile roles, working style — lives in `~/.claude/CLAUDE.md`
and already applies here. This file only adds what's specific to this project.)

## Tech Stack & Infrastructure

Default to these unless the goal is genuinely unreachable with them — don't propose a
different framework/language without saying why the current stack blocks the goal.

- **Build:** TypeScript + Vite + `vite-plugin-monkey`, which bundles the project into a
  single Tampermonkey userscript (`dist/torn-honors-medals-tracker.user.js`)
- **Runtime:** none of its own — the built script runs inside a user's browser via the
  Tampermonkey extension, injected into torn.com
- **Hosting/Infrastructure:** none — distributed as a userscript file/URL, not deployed
  as a service
- **Testing:** none set up — no test runner in `package.json`
- **Package manager:** npm (`package-lock.json` present)

## Domain

- **The product:** a Tampermonkey userscript that tracks the player's honors and medals
  progress on Torn.com in real time, with a status box UI styled to match the site.
- **End user:** individual Torn.com players who install the userscript and supply their
  own Torn API key.
- **Business model:** none apparent — reads as a free community tool (MIT licensed);
  confirm if that's still the intent.
