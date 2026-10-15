# Investor Atlas

Find Czech venture investors, check the evidence behind their profiles, and build a shortlist you can export. The app calls that shortlist your **Final draft**. You choose who belongs in it and in what order.

This is a working research preview for the investor database assignment. It contains eight researched profiles and 36 candidate records. Independent human review is still pending, so data accuracy has **not been measured**. Suitability weights are provisional too.

## Try the app

[Open Investor Atlas](https://imorkovkai.github.io/clientelo-database/) after the first successful GitHub Pages deployment. Check [GitHub Actions](https://github.com/IMorkovkaI/clientelo-database/actions) if the page is unavailable.

To run it locally, install Node.js 22.12 or newer, then:

```sh
git clone https://github.com/IMorkovkaI/clientelo-database.git
cd clientelo-database
npm ci
npm run dev
```

Open the local address printed in the terminal. There are no accounts, API keys or backend services to configure.

## Search, check, then choose

1. Set your sector, stage, location and investment criteria. Results explain their fit and flag missing information. You can make a criterion essential.
2. Open an investor's profile to see its sources, dates, investment evidence and financial details.
3. Add investors to Final draft. Reorder them, write notes, or remove an entry and undo the removal.
4. Select two or three investors to compare. Use the differences-only view to narrow your choices.
5. Export your draft as CSV or Excel. Both include your notes and source links.

Drafts and notes stay in this browser's local storage. Export a copy before clearing browser data or moving to another device. Nothing synchronizes between devices.

## What the data can tell you

The pilot covers VC organizations whose main investment management office is in Czechia. Investing in Czech companies or having a Czech registered address alone does not qualify an organization.

Profiles link claims to public sources. Missing information stays missing, with a reason such as “not found” or “not disclosed.” A funding round's total is kept separate from an investor's contribution; fund size, AUM and portfolio value are separate metrics too.

The current sample has 15 source records. Two profiles pass the initial evidence and scope checks, but neither has passed independent human review. The verified exports are deliberately empty. See [pilot results](reports/pilot_results.md) for coverage and [methodology](reports/methodology.md) for the inclusion rules.

The remaining work is listed in [MANUAL_WORK.md](docs/MANUAL_WORK.md): complete the research, independently audit the sample, measure accuracy, and support the worldwide coverage and cost estimate with evidence. Software tests cannot establish investor-data accuracy.

## Run the checks

```sh
npm run prepare:data
npm run check
npm audit --audit-level=moderate
npx playwright install chromium
```

`check` validates the data, runs the domain tests, checks TypeScript and builds the app. Run browser tests against that production build:

```sh
# macOS / Linux
TEST_PRODUCTION=1 npm run test:e2e
```

```powershell
# PowerShell
$env:TEST_PRODUCTION = '1'
npm run test:e2e
```

On Windows, you can use an installed Microsoft Edge instead of downloading Chromium by setting `$env:PLAYWRIGHT_CHANNEL = 'msedge'`. CI uses Playwright's Chromium. See [validation notes](docs/VALIDATION.md) for coverage and limitations.

## Work on the project

The app uses React, TypeScript and Vite. The dataset is versioned with the source code; opening the app does not crawl investor websites. Ranking, storage and export logic live in separate modules under `src/`.

| Location               | What belongs here                                        |
| ---------------------- | -------------------------------------------------------- |
| `src/`                 | Screens, styles, ranking, browser storage and exports    |
| `data/investors.json`  | Canonical researched profiles and evidence               |
| `data/candidates.json` | Canonical discovery and inclusion decisions              |
| `public/data/`         | Generated downloads, workbook and review template        |
| `scripts/`             | Data validation, download generation and audit reporting |
| `tests/`               | Domain and browser tests                                 |
| `docs/`, `reports/`    | Product decisions, human tasks and research results      |

Edit canonical data, then run `npm run prepare:data` and the checks. Do not edit the generated downloads directly. `scripts/seed-data.mjs` recreates the original research sample and can overwrite later work; it is not part of the update process.

For an independent review, copy the blank review template, complete that copy, then run:

```sh
npm run audit:report -- path/to/completed-review.csv
```

The command reports entity-level precision and candidate-set recall. Without a review file, it records `not_measured`. Field-level checks and publication of a verified dataset remain separate work.

Read [AGENTS.md](AGENTS.md) for repository guidance, [the specification](docs/SPECIFICATION.md) for product decisions, and [DESIGN.md](DESIGN.md) for the visual direction. The original Czech handoff is preserved in `Investor_Database_AI_Handoff_CZ.md`; the consolidated specification records the later chat decisions.

## Publish through GitHub

In **Settings → Pages → Build and deployment**, select **GitHub Actions**. Push changes to `main`. The workflow validates, tests and builds the app, checks dependencies, then runs browser tests against the production build. Deployment runs only when those checks pass. Pull requests run the checks without publishing.

Assets use relative paths so the app can run under `/clientelo-database/`. Draft navigation uses URL hashes.

## Storage and security

Notes render as text, and spreadsheet exports escape formula-like values. Evidence links must use HTTPS. The production page sets a Content Security Policy and loads no analytics or third-party assets. GitHub Pages controls the HTTP response headers.

Browser storage is neither encrypted nor a backup. Keep confidential information out of draft notes.
