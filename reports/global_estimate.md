# Public coverage and worldwide cost estimate

Prepared 16 October 2026. This is an assumption-based planning estimate, not a market census, price quote or measured pilot budget. All cited material is publicly accessible. The original handoff numbers are not used.

## What can be collected

Count one investment manager, family office or individual investor per record. Keep funds underneath managers. Include only direct investment in private companies with identifiable parties and dated investment evidence. Classify activity as VC, PE, family office or individual investing; a rich person is not an investor merely because they appear on a wealth list. Exclude advisers, service providers, LP-only investors, public-stock-only investors and duplicate brands. The Czech pilot remains VC only.

Official sites, portfolio-company announcements, public registers and association directories are the discovery routes. A register proves legal identity, not investment activity. Private identities and undisclosed amounts cannot be recovered by inference. Public evidence of a past investment does not establish that an investor is currently accepting pitches.

## Dated population anchors

These reports describe different populations, not downloadable lists of qualifying records. Their figures set scale; every recoverability percentage below is our assumption.

| Source | Reference period | Published count | Meaning |
| --- | --- | ---: | --- |
| [NVCA 2026 Yearbook](https://nvca.org/2026-nvca-yearbook/) | End 2025 | 2,984 | US VC firms in existence |
| [Invest Europe, published 23 July 2026](https://www.investeurope.eu/publications-policy/publications/2026/positioned-for-the-challenge-capital-under-management-dry-powder-2025/) | 2025 | 3,243 | European PE/VC firms; count is on the public summary page |
| [Deloitte family office landscape](https://www.deloitte.com/global/en/services/deloitte-private/research/defining-the-family-office-landscape.html) | 2024 | 8,030 | Estimated global single family offices, not all direct investors |
| [EBAN statistics, page 5](https://www.eban.org/wp-content/uploads/2025/12/Stats-Compendium-2024.pdf) | 2024 | About 47,600 | European angels affiliated with networks or associations |
| [UNH Center for Venture Research, page 1](https://paulcollege.unh.edu/sites/default/files/media/2025-12/FY%202024%20Analysis%20Report%20Final.pdf) | 2024 | 445,535 | Estimated active US angels, many without public individual records |

All five sources were inspected on 16 October 2026. The Invest Europe member-only download was not used. Deloitte projections for later years are not observed counts. EBAN's secondary US estimate is not used; UNH's own US study is the anchor. Definitions and reporting years differ, so addition alone would be misleading.

## Recoverable worldwide records

The model separates organizations from people, then discounts overlap. Low, middle and high mean different collection scopes and effort, not statistical bounds.

| Planning input | Low | Middle | High |
| --- | ---: | ---: | ---: |
| Additional institutional population outside the US VC/European PE-VC anchors | 3,000 | 6,000 | 10,000 |
| Institutional share recoverable with qualifying public evidence | 60% | 70% | 80% |
| Family office share recoverable with direct-investment proof | 10% | 17.5% | 25% |
| US/European angel anchor share publicly documentable | 0.5% | 1.5% | 3% |
| Publicly documentable individuals in other regions | 500 | 2,000 | 5,000 |
| Further overlap removed across categories | 5% | 8% | 10% |

Institutional calculation: `((2,984 + 3,243) × 95% + additional population) × public yield`. The 5% regional overlap discount is an assumption. Additional population covers US PE and markets outside the two anchors. No source count currently establishes that addition; it is the largest organizational uncertainty.

People calculation: `(47,600 + 445,535) × public yield + other-region people`. These populations have different visibility definitions; the small recovery fractions are a deliberately conservative collection hypothesis, not measured conversion rates. Large private investors are counted here or through their family office, without adding a separate wealth-list population. Remove aliases and connected vehicles; count a person separately only with separate personal deal evidence.

The resulting initial collection scope is approximately **9,000–31,000 records**, with a middle scenario near **18,000**. The precise scenario outputs are in [the generated calculation](expansion-calculation.md), with all inputs in `data/expansion-model.json`. This range is highly sensitive to assumed public yields and other-region additions. It is not proof that all these records can be found. Regions with poor public reporting will be underrepresented; private and undisclosed investors remain outside coverage.

Before the CVCA profile expansion, the Czech frame had six eligible candidates, 27 unresolved and three excluded. If 20%, 35% or 50% of unresolved candidates qualify, and broader discovery adds zero, three or five nonduplicate investors, the scenarios are `6 + round(27 × yield) + additions` = **11, 18 or 25** eligible organizations. These are collection hypotheses, not confidence intervals. That initial eight-profile sample could not validate the extrapolation. The follow-up frame now has 17 eligible, 15 unresolved and seven excluded candidates; the original 11–25 scenario remains a historical planning assumption, not an updated forecast. Its low case is already below the observed 17. The [CVCA directory](https://cvca.cz/en/membership/) underlies 28 discovery entries (retrieved 15 October); the eight-profile development sample supplied the others.

## Expected reliability

Identity and investment participation should be more reliable than financial completeness because publication requires direct supporting evidence. The current pilot has dated investment publications for 17/17 profiles, bounded ticket ranges for 11/17 and some capital observation for 11/17. Orbit's ticket range is undated association information requiring confirmation. Jet and JSK have partial ticket information without a complete range. Capital observations include targets and portfolio values, so field presence is not completeness of comparable total capital. None proves available cash.

For planning, use **95% entity precision as a release target**, not an achieved or statistically predicted result. Worldwide precision cannot yet be estimated empirically. Expected field coverage is a lower-confidence assumption: institutional sectors 80–95%, typical tickets 40–70%, correctly scoped capital 30–60%; family offices and individuals will often fall below these ranges. These ranges express the anticipated effect of private disclosures and the mixed pilot evidence, not measured category statistics. Do not fill absent data to hit a coverage target.

Before scaling, check 50 candidates in each of six strata: Czech VC, other European VC/PE, North American VC/PE, Asia-Pacific VC/PE, family offices, and individuals, with languages represented. Log all candidate attempts and failures. Measure accepted-record precision separately from field correctness and missingness. Re-estimate yields, overlap and effort after each stratum. A release target should be demonstrated on an independent reference sample; sample size and uncertainty must accompany any reported result.

## Cost assumptions and formulas

The inputs represent analyst-equivalent labor, even if AI assists. They are not a claim about actual agent/API expenditure. No per-record timing was captured in the pilot. Rates below are budget choices in EUR, not sourced market wage quotes. The model uses only free public information; tool/API and labor costs still exist.

| Input | Low | Middle | High |
| --- | ---: | ---: | ---: |
| Accepted / screened candidates | 60% | 50% | 40% |
| Discovery and extraction minutes per candidate | 10 | 20 | 35 |
| Verification minutes per accepted record | 20 | 35 | 50 |
| Review minutes per rejected/unresolved candidate | 5 | 10 | 15 |
| Deduplication minutes per candidate | 3 | 5 | 8 |
| Research hourly cost | €25 | €40 | €60 |
| Engineering hours × rate | 100 × €60 | 200 × €80 | 400 × €100 |
| Retrieval/tool allowance per candidate | €0.25 | €0.75 | €1.50 |
| Refreshes per existing record per year | 0.5 | 1 | 2 |
| Minutes per refresh | 10 | 15 | 20 |

Candidate count = ceiling(publishable records / acceptance). Initial labor includes discovery/extraction and deduplication for every candidate, accepted verification, rejected/unresolved review, and a separate 30-minute quality check on 10% of accepted records. Multiply labor hours by the research rate, add engineering and tools, then add **20% contingency**. Quality-assurance work is budgeted, not claimed as already performed.

Annual maintenance covers the stated refresh rate plus 10% quality sampling, 80 engineering hours at the scenario rate, €1,200 hosting/tools and 20% contingency. It does not include acquiring new investors, taxes or paid data licenses. Global language difficulty and inaccessible sources are represented by the high-effort scenario, not calibrated regional costs.

Run `npm run estimate:report` to regenerate [the totals](expansion-calculation.md) and `reports/expansion-results.json`. Use these to decide the scale of a next pilot, not to authorize a worldwide budget. At the middle rate, every extra ten research minutes per candidate adds approximately `candidate count / 6 × €40 × 1.2` to the initial budget; the model makes that sensitivity visible.
