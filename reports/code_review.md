# Code review and corrections

This records the earlier review before sample expansion. Its test totals and optional audit tooling refer to that stage. The current handoff passed 55 unit/data tests and the production build; the unused audit CLI and empty verified files have been removed. See [current validation](../docs/VALIDATION.md). The scoped owner-reported manual field result is in [pilot results](pilot_results.md); entity precision remains unmeasured.

Reviewed the uncommitted implementation against HEAD on 16 October 2026 using review-agent's defect-first method. Review was performed directly, without delegated agents. The review phase was read-only; the user's separate request to improve/correct the project authorized the fixes below. Locations refer to the corrected files.

## Findings corrected

**[P2] Keep investment evidence in each reviewed export row — scripts/prepare-data.mjs:123.** The new source-reviewed CSV included a company and publication date but omitted the investment source URL. A downloaded row could not substantiate its participation claim. Rows now include investment evidence URLs and a field-to-source mapping, with a regression check against the canonical dataset.

**[P2] Map ineligible reviews to the candidate schema — scripts/source-review-report.mjs:48.** The new ledger validator compared an ineligible profile with a candidate decision called ineligible, although the candidate schema uses out_of_scope. A legitimate exclusion would fail release preparation. An explicit mapping and regression test now cover this path.

**[P2] Preserve AI review provenance through publication validation — scripts/validate-data.mjs:227.** With the new agent_reviewed state, changing only reviewStatus to reviewed passed validation and could make browser exports say human-reviewed while retaining AI provenance. The preview validator now rejects human-reviewed states; a future human release requires an explicit separate pipeline. No current record was upgraded.

**[P2] Protect the newly published CSV from spreadsheet formulas — src/csv.mjs:9; scripts/prepare-data.mjs:8.** The new reviewed CSV reused a generator that quoted values but did not neutralize formula prefixes. Quotes alone do not prevent spreadsheet evaluation. Browser and generated exports now use one tested CSV encoder that prefixes formula-like text and preserves multiline evidence.

**[P2] Identify institutional evidence accurately — src/App.tsx:132.** Newly added institutional sources support management-base and historical-capital claims, but every non-primary source was labeled Discovery source. The panel now labels them Institutional source and displays claim notes, including the limits of supported inferences.

## Additional hardening and assignment corrections

The broader security/assignment review also found pre-existing gaps: malformed URLs and financial/date values could pass validation, and the legacy audit compared reviews with mutable current decisions. These were corrected, but are not described as regressions introduced by the new research changes. The audit now uses the frozen baseline, preserves CSV date strings, and requires explicit human reviewer type and independence.

The assignment previously lacked a numerical coverage estimate and budget. It now includes sourced anchors, assumption-based scenarios, a generated evidence table, a prospective revised plan and an honest requirement-by-requirement assessment. Same-agent reference agreement is separated from human precision and independently established accuracy.

## Overall assessment

The confirmed code defects above are fixed and regression checks pass. The project remains a research preview. All 34 unit/research tests and the production build pass; the dependency audit reports zero vulnerabilities. Browser tests have 11 passes and two file-download failures caused by a reproduced filesystem access problem in the local browser environment. No successful GitHub deployment is claimed. Human-reviewed precision remains unavailable, and the worldwide budget is a planning model rather than measured spending.
