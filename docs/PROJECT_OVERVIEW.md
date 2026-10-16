# Investor Atlas in plain words

Investor Atlas helps someone find investors that fit their company, inspect the evidence and choose a shortlist called **Final draft**. The Czech VC pilot is also a research deliverable: it includes inclusion rules, source records, review decisions and reports about what remains uncertain.

## How someone uses it

Set sector, company stage, location and investment amount. Results show the strongest documented matches first. Open a profile to check its strategy, ticket range, capital observations and investment evidence. Select two or three investors to compare. Add the investors you choose to Final draft, reorder them, write notes and export CSV or Excel.

The ranking policy is provisional. It helps sort results; it does not decide who belongs in Final draft or predict whether someone will invest. Missing information stays visible.

## How it works inside

| Part                   | Its job                                                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| Public-source research | The agent reads investor and portfolio-company pages, checks claims and records gaps.                          |
| Versioned JSON data    | Holds profiles, source links, dates, missing-data reasons and review decisions alongside the code.             |
| Validation and reports | Check data structure and consistency, preserve earlier decisions, calculate coverage and regenerate downloads. |
| React and TypeScript   | Display the screens and handle filters, ranking, comparison and user actions.                                  |
| Browser storage        | Keeps your filters, draft order and notes on this device. There is no account or synchronization.              |
| Vite and GitHub Pages  | Build and host the static website. GitHub Actions runs checks before deployment.                               |

The data flows from public sources through the agent's review into the saved dataset, then into the app and exports. The app does not research websites when you open it. New research requires a dataset update and a new build.

There is no backend server or live database service. That keeps this pilot easy to run and inspect. A shared editing system or automatic refresh service would require additional architecture later.

## The design system

The visual rules live in shared CSS: a pale gray background, near-white surfaces, dark text, blue actions and amber uncertainty. Status labels explain colors in words. System fonts, consistent spacing, thin borders and modest rounded corners keep dense information readable.

Results use compact rows with comparable fields. Filters sit on the left on desktop; evidence opens in a right-side panel. Final draft emphasizes notes and the user's order. Comparison aligns the same fields across two or three investors. Mobile moves filters into a drawer and stacks draft content. Visible focus indicators and labeled controls support keyboard use.

## What the current research establishes

The 16 October 2026 dataset contains 17 source-reviewed profiles and 70 source records. All meet the pilot rules; Nation1 remains a screened candidate without an established main management base. All 17 have dated investment participation evidence, while missing ticket or capital details remain explicit. The owner reported checking five fields for the earlier 15-profile version; later edits and additions are outside that review.

The owner reported no incorrect populated values in the earlier 15-profile, five-field check: 62/62 source agreement, with 13 unknowns separate. This is an unblinded aggregate report, not entity precision or validation of later edits. Current profiles retain AI source-review labels. The agent owns continued research, remaining candidates, legal-identity checks and recalibration of the worldwide coverage and cost scenarios. The user supplies product decisions, access when needed and final feedback.

See [pilot results](../reports/pilot_results.md) for research counts and [validation](VALIDATION.md) for software test results and release limitations.

The [assignment assessment](../reports/assignment_check.md) lists what is complete and what remains unsupported. The [cost model](../reports/expansion-calculation.md) provides three reproducible planning scenarios, with assumptions in [the estimate report](../reports/global_estimate.md).
