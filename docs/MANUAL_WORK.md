# Human work, separate from implementation

## Required from the repository owner

1. Authenticate GitHub on the machine used to push, if it is not already connected. Never paste a token into chat, source files or commit messages.
2. In repository Settings → Pages, choose **GitHub Actions** as the source if it has not been enabled.
3. Test the live URL after the deployment is successful. Check search, details, Final draft, comparison, notes after refresh, and both exports.

## Required from an independent human reviewer

The coding/research AI cannot perform this step on behalf of a human. Do not call automated source inspection a manual audit.

1. Copy `public/data/manual_review_template.csv` to a separate working file. It intentionally omits the system verdict.
2. For each assigned candidate, open the sources and independently check identity, the main management office, VC eligibility and actual investment participation. Add supporting URLs and a reason.
3. Fill `reviewer`, `reviewed_at` (YYYY-MM-DD), and `overall_eligible` (`yes`/`no`). Leave unresolved outcomes blank with an explanatory reason; do not guess. Other judgment columns accept yes/no/not_applicable; blank means not reviewed. Record research minutes.
4. Review populated sector, ticket and capital claims separately. Check currency, metric, scope, publication and as-of dates. A round amount is not an investor ticket.
5. Adjudicate disagreements without overwriting the original independent judgment. Use a second reviewer where possible.
6. Freeze the audited rows and run `npm run audit:report -- path/to/completed-review.csv`. The script compares original system decisions, not corrected release data. Review field metrics separately; the current script reports entity-level precision and candidate-set recall only.

The current discovery set is not a random sample. Audit all 36 if practical, or predefine a representative sampling procedure. Report deliberately selected edge cases separately. A small sample is not evidence of global accuracy.

## Research that remains (can be AI-assisted, must be checked)

- Complete the 28 discovery-only candidates. Directory entries do not establish current eligibility.
- Resolve Czech management and dated investment evidence for the six unresolved profiles.
- Capture a dated investment source for Purple Ventures, Presto Ventures, KAYA VC and Miton.
- Check exact legal identities, aliases and manager/fund relationships. Do not use a domain as a universal unique key.
- Expand discovery beyond one association to estimate Czech coverage and selection bias.
- Review source reuse terms before bulk collection or republication. Only short evidence excerpts are currently distributed.
- Develop separate public-data coverage estimates for VC, PE, family offices and angels by region; remove overlapping organizations.
- Measure search/API costs and human review minutes for accepted, unresolved and excluded records. Include refresh and maintenance costs.

## Product decisions still open

- Approve or revise suitability weights; the current policy is explicitly provisional.
- Review sector normalization and country/region mappings, particularly founder-origin mandates.
- Decide whether the final assignment release should be Czech-language, English-language or both. The implemented interface follows the English chat.

## Release checklist

- [ ] Independent review file completed and retained.
- [ ] Evidence gaps resolved or accurately labeled.
- [ ] Corrected dataset versioned separately from evaluation predictions.
- [ ] Precision, sample size, uncertainty and field coverage reported.
- [ ] Global coverage and cost estimate has dated sources and measured assumptions.
- [ ] Verified export produced through an approved publication step.

The current app is a testable research preview. Completing the software does not complete these research obligations.
