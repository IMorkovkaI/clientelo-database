# Investor Atlas · Czech pilot

A small React application for researching Czech venture investors, inspecting public evidence, and building a personal **Final draft**. Built from the original Czech assignment and the subsequent product/design discussion.

**Data status: research preview, not an independently audited investor database.** The application is functional; the research assignment remains incomplete until the human audit and global estimate are finished. Suitability weights are provisional.

## Try it

GitHub Pages deployment target: **https://imorkovkai.github.io/clientelo-database/**. The URL works after the first successful Pages deployment; check the [workflow](https://github.com/IMorkovkaI/clientelo-database/actions) for the current status.

Locally, use Node.js 22.12+:

```sh
npm ci
npm run dev
```

Open the Local URL printed by Vite. No API keys, paid databases, backend service, or accounts are required. Drafts and notes stay in this browser's local storage. Export before clearing browser data or changing devices.

## What works

- Ranked results with sector, stage, geography, focus, amount/currency, essential criteria, missing-data controls, and captured recent activity.
- Name search, sorting, empty states, responsive filters, preserved filter state.
- Investor details with per-claim sources, short excerpts, publication/retrieval dates, financial scope and research limitations.
- Final draft with add/remove/undo, keyboard-accessible ordering, inline notes and local persistence.
- Comparison of two or three chosen investors, differences-only view, shared notes and removal.
- CSV and genuine XLSX exports including order, notes, research status and evidence. Excel is loaded only when exporting.
- Methodology screen, research workbook, candidate list, source register and blind audit template.

## Data and methodology

- 8 real organizations have researched profiles; all await independent human audit.
- 36 candidates are recorded, including discovery-only and out-of-scope entities.
- 15 public source records include short excerpts and dates where published.
- Only 2 profiles meet the initial automated evidence/scope gate. These are not human-verified.
- Empty `data/exports/investors_verified.csv` and `.xlsx` deliberately prevent an unreviewed release from pretending to be verified.

Canonical records live in `data/investors.json` and `data/candidates.json`. `public/data/` contains generated download artifacts. Update canonical records, then run `npm run prepare:data` and the checks. `scripts/seed-data.mjs` reconstructs the initial extraction only; do not rerun it over subsequent research changes.

Read [the consolidated specification](docs/SPECIFICATION.md), [manual work](docs/MANUAL_WORK.md), [methodology](reports/methodology.md), [pilot results](reports/pilot_results.md), and [global estimate status](reports/global_estimate.md). The original `Investor_Database_AI_Handoff_CZ.md` is retained unchanged as historical input; later chat decisions are documented in the consolidated specification.

## Tests

```sh
npm run prepare:data
npm run check
npx playwright install chromium
TEST_PRODUCTION=1 npm run test:e2e
```

PowerShell with an existing Microsoft Edge installation:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
$env:TEST_PRODUCTION = '1'
npm run test:e2e
```

`check` validates data references, runs domain tests, typechecks, and creates a production build. Browser tests cover the main user journeys, actual XLSX parsing, mobile overflow, and accessibility. These tests **do not measure investor-data precision**.

For real independent audit results:

```sh
npm run audit:report -- path/to/completed-review.csv
```

Without a completed audit the command records `not_measured`. Keep the blank template unchanged, and complete a separate copy.

## GitHub Pages

In the repository's **Settings → Pages → Build and deployment**, select **GitHub Actions**. Push to `main`. The workflow validates data, tests, builds, audits dependencies and runs browser checks against the production build before deploying. Pull requests run the checks without publishing. Relative asset paths and hash navigation work under the repository subpath.

## Architecture

React + TypeScript + Vite, a versioned static dataset, pure ranking/storage/export modules, Vitest, Playwright and axe. No live data collection runs in a user's browser. Evidence extraction in this initial pilot is curated AI-assisted research, not a fully automated crawler. A larger pipeline can be added later without changing the published dataset contract.

## Security and limitations

Notes render as text; exported spreadsheet cells are protected against formula injection. Evidence URLs must be HTTPS. Production includes a restrictive Content Security Policy; no analytics or third-party assets load. GitHub Pages controls HTTP response headers. Browser-local data is not encrypted or synchronized; do not store confidential information in notes. The UUID dependency override addresses a reported ExcelJS transitive dependency advisory and is covered by the real export test.

See [validation notes](docs/VALIDATION.md) for the checks performed and their limits.
