# Czech pilot methodology, version 4

Updated 16 October 2026. The agent owns discovery, research, verification, analysis and reporting. The user supplies product decisions or access that the agent cannot obtain.

## Inclusion rules

Count investment organizations once, with funds and financial observations scoped underneath them. Include an organization when public evidence establishes its identity, main investment management base in Czechia, venture investment activity and participation in a named investment documented by a dated publication. A foreign fund domicile does not automatically disqualify a Czech-managed organization.

Use activity to classify an investor. An own-capital investment group can qualify when it demonstrably makes startup equity or convertible investments; it need not operate a conventional externally funded VC vehicle. Miton is labeled accordingly. PE-only firms, service providers, directories, advisers and organizations without their own qualifying investments do not belong in this VC pilot. Individual angels and general family-office coverage belong to later categories. A mixed organization can qualify through a documented VC strategy; scope its profile to that strategy and exclude unrelated PE, debt and real-estate figures.

A Czech registered address, Czech founder or investment in a Czech company alone is insufficient. Main-base decisions may use an explicit operating-base description or institutional team-location evidence, corroborated by operational team and office information. Record any inference. When several offices exist without a stated base, leave the case unresolved. Missing financial information does not automatically exclude a real investor.

## Discovery and checking

The initial frame combined eight organizations in a purposive development sample with 28 entities from [CVCA membership](https://cvca.cz/en/membership/), including three association/service entries marked out of scope. Membership is a lead, not eligibility evidence. The CVCA expansion promoted five existing leads and added JSK, bringing the frame to 37 candidates and 14 researched profiles. The follow-up added Orbit as the fifteenth profile and resolved Credo; Nation1, SkyLimit and Thein now have explicit screening decisions without live profiles. The next public-source pass added Reflex and Rockaway, bringing the live sample to 17 profiles and the candidate frame to 39. Abris, CVI and ARX now have explicit out-of-scope decisions. This frame is not a census or random sample.

For each profile, inspect the official domain and strategy, identify the operating base, find a named investment in an investor or portfolio-company publication, then check financial claims and dates. Record corrections and unresolved claims rather than filling gaps with estimates. Distinguish related managers, funds, brands and portfolio companies.

Official investor and portfolio-company pages are preferred. Public association reports can corroborate identity or history. They may be stale: a 2022 fund figure stays historical even when retrieved in 2026. Marketing claims and announcements establish what was publicly stated; they do not independently prove settlement or available capital.

## Evidence and missing information

Every supported field has source IDs. Sources retain publisher, URL, title, short excerpt, paraphrase, publication date when available and actual retrieval date. Null reasons are not found, not disclosed, not checked and conflicting. A missing amount is never zero.

Publication, announcement, transaction, financial as-of and retrieval dates are separate. A later recap may prove a historical investment without providing its original announcement date. The app's recent-evidence filter uses publication dates, not deal closing dates.

Preserve currencies and financial meaning. Typical ticket, whole-round size, individual contribution, fund size, target, AUM and portfolio value are different fields. Do not sum overlapping vehicles or infer dry powder. The excerpt hashes cover short quotations only; they do not preserve complete historical webpages.

## Review and evaluation

The original profiles and decisions are frozen under `data/baselines/2026-10-15/`. The dated agent ledger records reviewer type, lack of independence, before/after decisions, changed fields, rationale and source IDs. Run `npm run review:report` to validate consistency and calculate coverage. Nine new profiles have an explicit expansion review frame and no baseline verdict; they do not enter the original accuracy denominator. The pre-expansion data is preserved under `data/snapshots/`.

This is AI-assisted checking by the same agent, without blinding. It can repeat extraction mistakes. Report review coverage and corrections, but leave precision, recall and field accuracy unmeasured without a suitable reference assessment. Do not turn agreement with earlier AI decisions into independently established accuracy.

The owner reported manually checking sector, stage, geography, focus and typical ticket for all 15 preview.4 profiles, then explicitly confirmed no incorrect populated values. The preserved snapshot contains 62 populated fields and 13 unknown fields across those sections. Source agreement is 62/62 = 100%; field availability is 62/75 = 82.7%. This aggregate report was supplied in chat, without a cell-by-cell sheet. It is purposive and unblinded; fields cluster within profiles. No population interval or entity precision is inferred. Later edits, new profiles and capital are outside this check. Run `npm run review:report` to reproduce the denominators and result from data/human-field-review.json and the frozen snapshot.

## Publication

The app publishes an honestly labeled research preview with per-profile AI review provenance. The AI-reviewed CSV contains all reviewed profiles, including unresolved ones, with scope status. It is not an eligible-only list. Research exports retain their agent provenance; no empty human-verified files or optional audit workflow are published. The validator still rejects unsupported human-review promotion.

Research is curated by the agent using public pages. Opening the app does not crawl the web or update the dataset. Software checks validate structure and behavior, not the truth of investor claims.

## Assignment assessment and planning outputs

Read research_plan.md, assignment_check.md, global_estimate.md and expansion-calculation.md together. The source-review report now also computes baseline precision against dependent AI reference judgments; this is descriptive agreement, not independently established accuracy. The scoped owner-reported field result is calculated separately from AI baseline agreement. Human entity precision remains unmeasured.

Portfolio descriptions can support explicitly labeled observations. They do not establish an exclusive future mandate; unobserved categories remain unknown. Contacts support location, not investment-country criteria. Issuer legal documents can support domicile with their verification limits stated. A portfolio-company count is separate from capital and focus.
