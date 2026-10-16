# Investor Atlas

Find Czech venture investors, inspect their sources and build a shortlist called **Final draft**. You choose the investors, order and notes, then download CSV or Excel.

This is also the investor-database assignment deliverable: a plan, sourced sample, manual accuracy measurement and worldwide expansion estimate. Dataset **2026-10-16-preview.6**, dated 16 October 2026, contains **17 eligible profiles, 39 candidates and 70 source records**. It remains a research preview.

## Evaluate the assignment

| Required result                            | Repository evidence                                                                                                                                             |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inclusion, exclusion and verification plan | [Research plan](reports/research_plan.md), [methodology](reports/methodology.md)                                                                                |
| Sample with sources for each claim         | [Canonical profiles and sources](data/investors.json), [research CSV](public/data/source-reviewed.csv), [workbook](public/data/research-preview.xlsx)           |
| Proof and date of actual investment        | [Investment-evidence table](reports/pilot_evidence.md)                                                                                                          |
| Candidate decisions and corrections        | [Candidates](data/candidates.json), [AI review ledger](data/source-reviews.json)                                                                                |
| Manually checked accuracy                  | [Pilot results](reports/pilot_results.md), [owner's reported check](data/human-field-review.json), [calculated result](reports/human-field-review-results.json) |
| Worldwide coverage and cost                | [Estimate and sources](reports/global_estimate.md), [scenario calculation](reports/expansion-calculation.md), [model inputs](data/expansion-model.json)         |

The [full evaluation](reports/assignment_check.md) explains each result and its limits. The [initial plan](docs/Investor_Database_init_plan.md) is background; later decisions define this pilot. Revised estimates followed the initial sample and are not backdated.

## Who is included

The pilot counts investment organizations whose main investment management operation is in Czechia. A foreign fund domicile is allowed, and own-capital startup investors can qualify. Each organization appears once; funds and financial figures keep their own scope.

Acceptance requires identity, Czech management, VC activity and a named investment supported by dated public evidence. A Czech address, founder or portfolio company alone is insufficient. PE-only firms, private-debt-only investors, advisers and unresolved cases stay outside search. Abris, CVI and ARX are exclusion controls; Nation1 remains unresolved.

PE, family offices, angels and large private investors belong to the worldwide estimate. This Czech VC sample does not establish results for those categories.

## Sources and missing data

Each field links to sources with a URL, publisher, excerpt, explanation, publication date when known and retrieval date. The CSV carries field-to-source mappings; the workbook includes evidence and review history.

All **17/17** profiles have dated investment evidence. **11/17** have a bounded ticket range and **11/17** have a capital observation. Missing values stay marked as not found, not disclosed, not checked or conflicting. They never become zero. Round totals, contributions, fund sizes, targets, AUM and portfolio values remain separate. A past investment does not prove present funding capacity.

Kurzy blocked automated access. The official ARES register instead corroborated JSK Investments SICAV, Purple Ventures s.r.o. and J&T Ventures CG SICAV by IČO. [Legal notes](reports/legal_identity_check.md) and [saved records](data/intake/legal-entities-2026-10-16.json) show the matches. These establish specific legal entities and registered offices, not every associated fund's domicile, management base or investment activity.

## Manual accuracy result

The owner checked sector, stage, geography, focus and typical ticket against sources for all **15 preview.4 profiles**, then confirmed: “No incorrect populated values found.”

| Field          | Populated fields checked | Unknown |
| -------------- | -----------------------: | ------: |
| Sector         |                       14 |       1 |
| Stage          |                       15 |       0 |
| Geography      |                       13 |       2 |
| Focus          |                        9 |       6 |
| Typical ticket |                       11 |       4 |
| Total          |                   **62** |  **13** |

The result is **62/62 = 100% owner-reported source agreement** for populated fields. Field availability was **62/75 = 82.7%**. Unknowns and omissions are separate.

This was an unblinded, selected sample reported in chat, without individual field verdicts. It does not establish entity precision, recall, capital accuracy or accuracy across the current database. Reflex, Rockaway and later corrections, including ARES additions, are outside that check. The [preserved snapshot](data/snapshots/pre-missing-data-expansion-2026-10-16.json) fixes the denominator; the pilot report explains the method and sampling limits.

## Worldwide expansion estimate

Public reports and explicit recovery assumptions suggest about **9,000–31,000 qualifying public records**.

| Scenario | Initial collection | Annual maintenance |
| -------- | -----------------: | -----------------: |
| Low      |           €219,000 |            €35,000 |
| Middle   |      €1.43 million |           €263,000 |
| High     |      €7.01 million |      €1.73 million |

These planning budgets include unsuccessful candidates, research, verification, deduplication, QA, engineering, tools and contingency. They are not measured spending or guaranteed coverage. Pilot time and API spend were not captured. A 95% entity-precision target remains a proposed threshold. Broader samples and measured effort must recalibrate the model before global collection.

## Why React and JSON instead of Python and PostgreSQL

The initial plan proposed Python collection scripts, PostgreSQL and an optional service layer. We chose a smaller setup for an inspectable pilot that runs on GitHub Pages. The assignment requires reliable data and evidence, without prescribing a server or language. Python and PostgreSQL cannot replace source checking.

React and TypeScript handle search, provisional ranking, evidence, comparison and exports. Node scripts validate versioned JSON and generate reports. Git preserves changes and evaluation snapshots. Drafts stay in localStorage, without accounts or synchronization. Opening the app does not crawl websites or refresh data.

Python workers and PostgreSQL would make sense for scheduled collection, shared editing and larger datasets. See [the overview](docs/PROJECT_OVERVIEW.md) and [specification](docs/SPECIFICATION.md).

## What needed human input

The agent handled research, implementation and reporting. The owner supplied sources, clarified company/fund relationships, checked the five fields and identified omissions. Some sources and nested information needed that clarification.

Despite the initial plan, architecture and design, eligibility and evidence rules changed during development. That required more work from both sides. Contacts establish location without proving investment geography; portfolios show past experience without defining a future mandate; slides can hide context. JSK's portfolio-company target is neither capital nor focus. Snapshots and the review ledger preserve the corrections.

## Run and check

Use Node.js 22.12 or newer:

```sh
npm ci
npm run dev
```

Open the printed local address. Export your draft before clearing browser storage or changing devices.

```sh
npm run prepare:data
npm run check
npm audit --audit-level=moderate
```

Edit canonical data under data/, then regenerate downloads. Preserve snapshots, baselines and the [editable intake CSV](public/data/manual_review_template.csv). Intake rows need research before admission. [AGENTS.md](AGENTS.md) contains the working rules; [DESIGN.md](DESIGN.md) describes the visual system.

Latest local results: **55 unit/data tests and 17 production E2E tests passed**, including real CSV/Excel saves, encoding, notes, order, unknowns and export failure recovery. The build passed. The last dependency audit reported zero known vulnerabilities. See [validation](docs/VALIDATION.md) and [security review](reports/security_review.md) for scope.

## Publish

### What belongs on GitHub

| Include in the commit                                                                               | Keep local                                                                                          |
| --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| App source, scripts, tests, package.json and package-lock.json, configuration and .github/workflows | node_modules/, dist/, work/ (browsers, temporary files, logs), test-results/ and playwright-report/ |
| Canonical data, source records, intake, frozen snapshots, reports and documentation                 | .env files, credentials, private keys and personal draft notes                                      |
| public/ assets and generated research downloads, including CSV and XLSX                             | TypeScript build cache                                                                              |

Several required files are new and still untracked. Include those alongside modified files and intended deletions, including the renamed initial plan. Ignored files stay local unless force-added. The data/ and public/data/ copies are intentional: one holds research inputs/history; the other supplies website downloads. Browser drafts are localStorage data, not repository files.

The current file review covers about 115 files (1.8 MB), with no matching common secret patterns or already-tracked ignored files found. It does not scan Git history. Nothing has been staged or published by the agent.

### Check and deploy

E2E normally runs at publication; this earlier run was explicitly requested. Test the production build with:

```sh
npm run build
npx playwright install chromium
TEST_PRODUCTION=1 npm run test:e2e
```

In PowerShell set `$env:TEST_PRODUCTION = '1'`, then run `npm run test:e2e`. [Validation notes](docs/VALIDATION.md) include the tested Windows sandbox workaround. Download assertions remain strict.

Choose **GitHub Actions** in Settings → Pages, then push to main. The [workflow](.github/workflows/pages.yml) checks, builds and runs Chromium E2E on Ubuntu before deploying. Confirm [Actions](https://github.com/IMorkovkaI/clientelo-database/actions) and the [published app](https://imorkovkai.github.io/clientelo-database/). Local checks do not establish deployment success.

Notes render as text, exports protect against spreadsheet formulas, and source links require HTTPS. Production uses CSP and no runtime third-party scripts. Browser storage is unencrypted. Suitability weights remain provisional; users control Final draft.
