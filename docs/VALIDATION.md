# Validation record

## Current handoff: preview.6, 16 October 2026

Prepared for the owner to publish. The user later requested production E2E and an Impeccable design pass. Tests used Node.js 22.23.1 and Chromium 156.0.8078.4 on Windows. Nothing was committed, pushed or deployed.

| Check                                                   | Current result                                                                                                                 |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Data preparation and canonical validation               | Passed: 17 profiles, 39 candidates, 70 sources                                                                                 |
| Review ledger and evaluation version checks             | Passed; human check stays tied to preview.4                                                                                    |
| Manual field-result calculation                         | Reproduced 62/62 source agreement, 13 unknowns separate                                                                        |
| Unit/data tests                                         | **55 passed in three files**                                                                                                   |
| Final draft CSV                                         | Passed round-trip checks for ordering, unknowns, multiline notes, formulas, dates and evidence; legal identity fields retained |
| TypeScript and production build                         | Passed                                                                                                                         |
| Dependency advisory check                               | Zero known vulnerabilities reported by npm audit                                                                               |
| Local Markdown links and basic working-tree secret scan | Passed; no Git-history scan or remote link verification claimed                                                                |
| Whitespace                                              | Passed                                                                                                                         |
| Production E2E                                          | **17 passed**, zero failures, in 31.4 seconds; successful process exit                                                         |
| Deployed app and Ubuntu workflow                        | Pending the owner's publication                                                                                                |

The lazy-loaded ExcelJS chunk still produces a build warning. The earlier file-saving failure was resolved as described below. Canceled attempts remain historical failures; the current pass saved and parsed actual downloads with strict assertions.

The editable intake CSV and frozen investor baseline retain their previous SHA-256 values: 4EEABDE6BD46B5EC8156BF47EA58C1CC4648E21135A950FE16992B3EFD3CBE43 and E9D422F6AEA2DEF4E5D326A475D6BF32322DF3913C274088B24E285D73138E88 respectively. A pre-legal-corroboration snapshot preserves preview.5.

ARES corroboration adds three legal-entity records and two official identifier sources. Tests keep that evidence separate from actual investment proof. The human check covers earlier populated sector, stage, geography, focus and ticket fields only; the software pass does not expand its scope or establish factual accuracy.

Cleanup removed the destructive old seed script, unused optional audit CLI/result and empty verified exports. Canonical evidence, research history, evaluation snapshots and editable intake remain. Website downloads contain the deliverable reports; their relative Markdown links resolve back to repository evidence. The renamed initial plan is preserved at docs/Investor_Database_init_plan.md.

## Production E2E and design follow-up

All 17 tests passed without retries or skipped assertions. Coverage includes search, exclusions, evidence, unknowns, saved drafts, order, comparison, removal/undo, report links and exports. Mobile checks passed at 320, 390 and 560px with default and wide fallback fonts. Accessibility scans found no serious or critical violations on results, details, Final draft and methodology; this is not certification.

The CSV test selected three investors, reordered them, entered a quoted multiline note with Czech characters and a euro sign, and reloaded. It clicked Download CSV, required no download failure, saved the actual file, checked its UTF-8 BOM and parsed it with ExcelJS. It checked order, formula protection, notes, unknowns, URLs, dates and legal-identity notes. Other tests saved Excel and verified its worksheets, and simulated failed Excel loading before successfully downloading CSV. Artifacts remain in ignored test-results/.

### Temporary-directory fix

Paired controls used the same Chromium build, data URL and explicit download directory. The sandbox's default TEMP folder produced a canceled plain-text download. With TEMP and TMP inside the project, it saved and read back as hello. Earlier logs also showed profile rename failures with Access denied. This isolates the temporary-directory access problem, without identifying every underlying Windows policy.

playwright.config.ts now keeps Windows browser profiles and downloads in the writable project. Application download code and strict save assertions remain intact. The sandbox also stalled while Playwright stopped its managed preview process, so the complete local run used a separately managed production server with TEST_EXTERNAL_SERVER=1. It exited with code zero. CI retains Playwright's managed server on Ubuntu.

To reproduce the sandbox setup, build and start a preview in one terminal:

```sh
npm run build
npm run preview -- --port 4195 --strictPort
```

In a second PowerShell terminal:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location) 'work/pw-browsers'
npx playwright install chromium
$env:TEST_PRODUCTION = '1'
$env:TEST_PORT = '4195'
$env:TEST_EXTERNAL_SERVER = '1'
npm run test:e2e
```

Stop the preview afterward. Clear TEST_EXTERNAL_SERVER to return to automatic server setup. Browser files stay ignored under work/.

### Design changes checked

The light research workspace stays. The initial pass made CSV primary; the user's follow-up swaps the colors so Download Excel is primary and CSV secondary. The group explains which investors and information are exported. Loading labels identify the active format; both buttons disable during preparation. Note fields have visible boundaries and larger text. Shared color tokens use OKLCH. Desktop and mobile screenshots were inspected after the passing run. The later color swap passed the production build and changes no layout or download behavior. Investor data and the accuracy measurement were unchanged.

### GitHub file review

Reviewed existing tracked files and unignored new files, excluding intended deletions: about 115 files, 1.8 MB. No file exceeds 5 MiB. No common access-token/private-key patterns or already-tracked ignored files were found. This was a working-file check, not a Git-history scan. The lockfile is included; dependencies, build output, downloaded browsers, temporary files, local logs, Playwright artifacts and environment files are ignored. New data, reports, scripts and the renamed initial plan remain untracked and must be included in the owner's commit. Nothing was staged, committed or published.

## Historical validation before expansion

Checked on 16 October 2026 for release 2026-10-16-preview.2 using Node.js 22.23.1 on Windows. Browser tests ran against the production build with Playwright Chromium 156. The full browser suite is **not passing in this environment**; both file-download checks fail as described below.

| Check                           | Result                                          |
| ------------------------------- | ----------------------------------------------- |
| Generate research downloads     | Passed                                          |
| Dataset and review consistency  | Passed: 8 profiles, 24 sources, 8 AI reviews    |
| Domain and research tests       | 34 passed                                       |
| TypeScript and production build | Passed                                          |
| Dependency audit                | 0 reported vulnerabilities                      |
| Production browser tests        | 11 passed; CSV and Excel download checks failed |
| Whitespace check                | Passed                                          |

The browser suite covers searching, evidence, filters, unknown amounts, saved notes after reload, draft ordering, comparison, removal and undo, review provenance, publication dates and file exports. The combined draft/CSV test reaches the final download check before failing. Accessibility scans found no serious or critical violations on results, details, Final draft and methodology. This is an automated check, not an accessibility certification.

Mobile checks cover 320px, 390px and 560px widths with the default font and a wider monospace fallback. They check results and drafts with one and two entries, and confirm navigation buttons remain on screen. The updated desktop results screenshot was inspected visually; the 320px draft was inspected in the earlier validation pass.

## Current download-test limitation

Chromium reports `canceled` when saving either CSV or XLSX. The same result occurs with an unrelated five-byte text download from a data URL, both in isolation and with a dedicated download directory. A fresh isolated reproduction recorded Chromium Download.InterruptedReason = 2 ([FILE_ACCESS_DENIED](https://raw.githubusercontent.com/chromium/chromium/main/components/download/public/common/download_interrupt_reason_values.h)) and a browser profile rename failure with Windows Access denied. This identifies a filesystem access failure in this environment; the exact sandbox/Windows rule causing it has not been established. Edge could not start reliably in the same sandbox. No product fix or test bypass is justified by that evidence.

A separate diagnostic captured the actual XLSX blob generated by the app before file saving and parsed it with ExcelJS. It contained the expected two Final draft rows (header plus J&T Ventures), four Evidence rows, `agent_reviewed` provenance and `not_performed` human review. That validates workbook generation, not successful browser download. The CSV test now checks completion and contents instead of only accepting a download-start event.

The first test-server startup stalled; the final run used an explicitly started Vite production preview on port 4182. Both download assertions remain enforced in CI. This release still needs passing download checks and a successful GitHub run before deployment can be reported as tested.

## The GitHub failure and its fix

The supplied log from [run 38716138243](https://github.com/IMorkovkaI/clientelo-database/actions/runs/38716138243) shows that validation, domain tests, the build, dependency audit and six browser tests passed. The mobile overflow assertion failed twice, which correctly prevented deployment.

Local diagnostics found that the header's logo and navigation could not fit into one mobile row. Before the fix, a 320px viewport had a 349px document width. At 390px, a wider fallback font produced a 399px document width. The original 390px test passed with Windows' default font, so that local test alone missed the problem.

Mobile navigation now has its own row, with the Methodology label visible. The expanded regression checks also exposed the results toolbar's minimum content width at 320px with a wider font; those controls now wrap. Page overflow is not hidden, and the assertion remains strict. Failures include viewport measurements and the overflowing elements.

## What remains unverified

- This local run used Windows. The updated workflow still needs a successful run on GitHub's Ubuntu runner.
- The deployed GitHub Pages site must be checked after that run. A successful local build does not establish deployment success.
- Safari, Firefox and physical mobile devices were not tested in this pass.
- Source checks and inclusion decisions are recorded as AI-assisted review in `reports/source_review.md`. Independent factual accuracy remains unmeasured; it is not established by these software tests.

The build reports a large ExcelJS chunk. Excel export loads it on demand. The warning does not fail the build; the browser file-saving limitation is separate.

Run instructions are in [README.md](../README.md). Research and review tasks are in [MANUAL_WORK.md](MANUAL_WORK.md).

## Assignment and security correction pass

The latest check regenerated reports and exports, validated all eight profiles and 24 sources, passed all 34 unit/research tests, and built the production bundle. A fresh npm audit reported zero vulnerabilities after network permission was granted. Production E2E again finished with 11 passes and the same two canceled file downloads. No tests were skipped or weakened.

Regression checks now cover malformed/credential-bearing source URLs, impossible and future dates, nonfinite financial values, empty supported lists, AI-to-human status relabeling, out-of-scope review mapping, formula-safe CSV round-tripping, per-record export evidence, frozen-baseline metrics and cost reconciliation. The CSV parser in the export test uses string mode to avoid ExcelJS's automatic date conversion.

The browser test also checks all six report links, the scenario table and methodology overflow at 320px. Accessibility scans still report no serious/critical violations. Network permission allowed npm and localhost checks; it did not fix the browser's file-save access failure. See code_review.md and security_review.md in reports for scope and residual limits. No GitHub deployment was performed in this pass.

The updated methodology screen was also inspected visually at 1280px: the quality metrics, three scenario rows and report download links are readable and aligned.

## CVCA extraction, 16 October 2026

The separate intake now contains 36 detailed profiles and an 84-entry screening log. The report generator checks unique identifiers and profile URLs, matches each extracted profile to the screening log, checks membership counts and classifications, and validates dates, currencies and financial ranges. Generated CSVs separate Czech VC candidates, unresolved VC management, Czech-listed PE, mixed strategies, foreign-listed investors and other cases.

`npm run prepare:data` and `npm run check` passed: intake validation, existing data checks, all 34 tests and the production build. An additional ExcelJS round-trip read all 36 CSV records, retained retrieval dates as strings and parsed the structured financial observations. SHA-256 comparisons confirmed the canonical investors, candidate list, frozen investor baseline and editable review template were unchanged. This checks the extraction files and software, not factual accuracy or current investment capacity. The existing ExcelJS bundle-size warning remains.

Browser tests were not rerun for this data/report-only addition. The previous download limitation remains documented above. These changes have not been pushed or deployed.

## CVCA profile additions, 16 October 2026

Added six researched profiles and resolved Tensor's Czech management base. The dataset contains 14 profiles, 47 sources and 37 candidates; 13 profiles meet the pilot rules and Credo remains unresolved. The pre-expansion state is saved in data/snapshots. New review rows are explicitly outside the frozen baseline, whose evaluation still covers eight original profiles and two original positives.

`npm run prepare:data` and `npm run check` passed, including all 36 unit/data tests and the production build. Regression checks verify that expansion rows cannot forge baseline verdicts and that partial ticket notes survive CSV export without fabricated range bounds. The existing ExcelJS chunk-size warning remains. Git whitespace checks passed.

SHA-256 checks confirmed that the editable intake template and frozen investor baseline retain their pre-expansion hashes. Updated exports contain all 14 profiles. These checks establish structural and software consistency, not independent factual accuracy.

A targeted production E2E run was started, then canceled at the user's request before a result was reported. No browser-test pass is claimed for this addition. E2E tests, including the added profile/evidence/Final draft coverage, are deferred until preparation to publish to GitHub. No changes were pushed or deployed.

Removed the Remaining research section from the Methodology screen; research work stays in the project reports and MANUAL_WORK.md.

## Credo, Nation1 and Orbit follow-up, 16 October 2026

Credo's scope is now eligible and Orbit's growth-equity profile is included. Nation1 remains unresolved outside live profiles; SkyLimit is excluded as PE; Thein's broader venture eligibility remains unresolved. The dataset has 15 profiles, 53 sources and 37 candidates. Three candidates now have screening decisions without profiles, distinguished from 19 discovery-only entries.

`npm run prepare:data` and `npm run check` passed: canonical data validation, review consistency, report regeneration, all 36 unit/data tests and the production build. Baseline checks still evaluate eight original profiles and two original positives; seven later profiles stay outside that denominator. The ExcelJS chunk-size warning remains unchanged.

SHA-256 checks confirmed the frozen investor baseline and editable intake template are unchanged. Git whitespace checks passed. No E2E tests were run and no changes were pushed or published, as requested. Research judgments and financial limitations are documented in reports/czech_candidate_followup.md.

## Additional sources and missing-data pass, 16 October 2026

Version preview.5 has 17 eligible profiles, 39 candidates and 65 source records. Reflex and Rockaway were added with unknown financial values. Abris, CVI and ARX have explicit exclusion decisions. JSK's issuer statute supports legal domicile and more precise stage criteria. Miton and Purple have labeled portfolio observations; absent portfolio categories stay unknown. The owner's reported five-field review of the prior 15 profiles is preserved separately and does not validate later edits.

Data preparation and validation passed. The production build passed; the known lazy ExcelJS bundle warning remains. All 45 unit/data tests passed after the final test additions. New tests cover excluded and unresolved scope, missing-ticket settings, portfolio-based matching, review scope and Final draft CSV round-trip parsing. The CSV check uses the application's export functions and an independent CSV reader to verify order, multiline/quoted notes, formula protection, unknowns, source links, dates and review labels. It does not prove a browser can save the download.

The fresh dependency audit completed after network access was granted and reported zero known vulnerabilities. Git whitespace checks passed. SHA-256 checks confirm the editable intake template and frozen investor baseline retain their prior hashes.

A production browser test attempt was started prematurely under a broad interpretation of release preparation. The first local server did not respond. A fresh preview server returned HTTP 200; a test-loader JSON import issue was corrected. The next attempt reached test discovery, but browser launch failed because Chromium was not installed in that execution environment. The user then reiterated the publication-only E2E rule, and the run was canceled. No E2E pass is claimed. No browser install, retry or substitute browser check will run until the actual GitHub publication step. AGENTS.md now states this explicitly. Nothing was pushed or deployed.
