# Validation record

Checked on 16 October 2026 using Node.js 22.23.1 on Windows. Browser tests ran against the production build with Playwright Chromium 156, not the Vite development server.

| Check                           | Result                                   |
| ------------------------------- | ---------------------------------------- |
| Generate research downloads     | Passed                                   |
| Dataset validation              | Passed: 8 profiles and 15 source records |
| Domain tests                    | 14 passed                                |
| TypeScript and production build | Passed                                   |
| Dependency audit                | 0 reported vulnerabilities               |
| Production browser tests        | 12 passed                                |
| Whitespace check                | Passed                                   |

The browser suite covers searching, evidence, filters, unknown amounts, saved notes after reload, draft ordering, comparison, removal and undo, CSV download, and a downloaded Excel workbook parsed back into worksheets. Accessibility scans found no serious or critical violations on results, details, Final draft and methodology. This is an automated check, not an accessibility certification.

Mobile checks cover 320px, 390px and 560px widths with the default font and a wider monospace fallback. They check results and drafts with one and two entries, and confirm navigation buttons remain on screen. The 320px draft screenshot was also inspected visually.

## The GitHub failure and its fix

The supplied log from [run 38716138243](https://github.com/IMorkovkaI/clientelo-database/actions/runs/38716138243) shows that validation, domain tests, the build, dependency audit and six browser tests passed. The mobile overflow assertion failed twice, which correctly prevented deployment.

Local diagnostics found that the header's logo and navigation could not fit into one mobile row. Before the fix, a 320px viewport had a 349px document width. At 390px, a wider fallback font produced a 399px document width. The original 390px test passed with Windows' default font, so that local test alone missed the problem.

Mobile navigation now has its own row, with the Methodology label visible. The expanded regression checks also exposed the results toolbar's minimum content width at 320px with a wider font; those controls now wrap. Page overflow is not hidden, and the assertion remains strict. Failures include viewport measurements and the overflowing elements.

## What remains unverified

- This local run used Windows. The updated workflow still needs a successful run on GitHub's Ubuntu runner.
- The deployed GitHub Pages site must be checked after that run. A successful local build does not establish deployment success.
- Safari, Firefox and physical mobile devices were not tested in this pass.
- Source truth, investor eligibility and field accuracy still need independent human review. Structural validation does not measure those qualities.

The build reports a large ExcelJS chunk. Excel export loads it on demand, and the real workbook export test passed. The warning does not fail the build.

Run instructions are in [README.md](../README.md). Research and review tasks are in [MANUAL_WORK.md](MANUAL_WORK.md).
