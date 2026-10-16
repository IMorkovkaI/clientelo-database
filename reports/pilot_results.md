# Czech pilot results

Dataset: 2026-10-16-preview.6. The CVCA expansion was checked on 16 October 2026; source records retain their individual retrieval and publication dates.

| Measure                                          | After initial source review | After additional-source follow-up |
| ------------------------------------------------ | --------------------------: | --------------------------------: |
| Candidate records                                |                          36 |                                39 |
| Researched profiles                              |                           8 |                                17 |
| Discovery-only candidates                        |                          28 |                                16 |
| Screened candidates without profiles             |                           0 |                                 6 |
| Profiles meeting inclusion rules                 |                           6 |                                17 |
| Unresolved candidates, including discovery leads |                          27 |                                15 |
| Out-of-scope candidates                          |                           3 |                                 7 |
| Sourced bounded typical ticket range             |                       6 / 8 |                           11 / 17 |
| Dated investment publication                     |                       8 / 8 |                           17 / 17 |
| Sourced capital observation                      |                       6 / 8 |                           11 / 17 |
| Recorded AI source reviews                       |                           8 |                                17 |
| Independent human reviews                        |                           0 |                                 0 |
| Independently established precision / recall     |                Not measured |                      Not measured |

DEPO, i&i Bio, Inven, Tilia, Jet Ventures and JSK's venture strategy were added. Tensor's main management base is now supported by EIF team-location evidence and its operational information. The [follow-up](czech_candidate_followup.md) resolves Credo and adds Orbit's growth equity activity. Nation1 remains outside the profiles, SkyLimit is excluded as PE, and Thein's broader VC eligibility remains unresolved. See [the expansion review](cvca_profile_promotion.md) and [initial review](source_review.md).

All 17 profiles have dated evidence of participation in a named investment. Presto and KAYA use retrospective publications; their original announcement and closing dates remain unknown. Evidence establishes historical participation, not present investment capacity.

Capital observations are not comparable totals: they include historical fund sizes, aggregate fund capital, fundraising targets, AUM and portfolio value. Jet and JSK publish partial ticket information without a bounded range; those details remain in notes and exports. No missing amount becomes zero or an invented range.

## Evaluation boundaries

The frozen original baseline under `data/baselines/2026-10-15/` remains unchanged. Its eight profiles are evaluated against same-agent source judgments. Six originally unresolved records now meet the rules; these corrections are not added to baseline true positives. The two original positives, Look AI Ventures and J&T Ventures, still meet the rules: TP = 2, FP = 0, with no unresolved or unchecked baseline positives.

Precision **against the same agent's reference judgments** is therefore 2/2 = 100%. The illustrative Wilson 95% interval is about 34.2–100%. This is descriptive agreement, not independently established accuracy: the sample is purposive, the reviewer is dependent, and shared errors can remain.

Nine expansion profiles have no original baseline verdict and are excluded from that evaluation. The complete pre-expansion state is preserved in `data/snapshots/pre-cvca-promotion-2026-10-16.json`. The next pass is preserved in pre-czech-followup-2026-10-16.json in the same directory. These are change-history snapshots, not new accuracy references.

Run `npm run review:report` to reproduce the counts and validate ledger/profile/candidate agreement. The [AI results file](source-review-results.json) keeps human entity precision, independent accuracy and recall unavailable. Software tests do not establish factual accuracy. The owner reports checking five fields in the prior 15-profile version; see expanded_pilot_review.md for scope and limitations. Entity precision remains unmeasured; research belongs to the agent.

The source/date table is [pilot_evidence.md](pilot_evidence.md). Coverage and budget assumptions are in [global_estimate.md](global_estimate.md); pilot effort has not been instrumented. See [assignment assessment](assignment_check.md) and [software validation](../docs/VALIDATION.md).

The latest additions are Reflex Capital and Rockaway Ventures. [Expanded review](expanded_pilot_review.md) records the additions, corrected exclusions, portfolio observations and the owner-reported field review. The separate owner-reported manual field result is described below.

## Manual field accuracy assessment

The owner checked sector, stage, geography, focus and typical ticket for the 15 preview.4 profiles and confirmed no incorrect populated values. The frozen snapshot yields 62 populated fields and 13 unknowns (75 field slots). Therefore owner-reported source agreement = (62 − 0) / 62 = **100%**. Field availability = 62/75 = **82.7%**. Unknowns and context omissions are separate from correctness of populated values.

| Field          | Populated | Unknown |
| -------------- | --------: | ------: |
| Sector         |        14 |       1 |
| Stage          |        15 |       0 |
| Geography      |        13 |       2 |
| Focus          |         9 |       6 |
| Typical ticket |        11 |       4 |
| Total          |        62 |      13 |

The explicit aggregate verdict is in [the review record](../data/human-field-review.json), with the [calculated result](human-field-review-results.json) generated by npm run review:report against [the preserved snapshot](../data/snapshots/pre-missing-data-expansion-2026-10-16.json). No cell-by-cell audit sheet was supplied. This is a purposive, unblinded owner-reported check, with fields clustered within profiles. No population interval is justified. Identity, Czech management, participation and capital are outside the human field check; later edits and additions are outside its version. No entity precision, recall or current-dataset-wide accuracy is inferred.

## Legal-entity follow-up

Preview.6 adds five sources, bringing the register to 70, without changing the 17-profile/39-candidate frame. Official ARES data corroborates three named legal entities by IČO; two official company pages link the identifiers to their brands. [Legal notes](legal_identity_check.md) distinguish specific entities from managers and fund vehicles. Kurzy was inaccessible and supplies no asserted facts in this pass. These additions remain agent-reviewed and are outside the earlier human check.
