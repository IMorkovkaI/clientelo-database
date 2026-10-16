# CVCA profile additions — 16 October 2026

This report preserves the first expansion pass; the [subsequent follow-up](czech_candidate_followup.md) adds Orbit and resolves Credo. Counts and unresolved decisions below describe the earlier state.

Six organizations now have live research profiles after checks of management base, venture strategy and dated investment evidence. Five reuse existing candidate IDs; JSK adds one new candidate. The result is 14 profiles and 37 candidates, with 13 eligible profiles and Credo unresolved. All reviews are same-agent AI source checks, not human verification.

| Profile | Czech management evidence | Named investment and publication date | Financial treatment |
| --- | --- | --- | --- |
| DEPO Ventures | Current Prague leadership/contact, corroborated by Momenta's description of DEPO as Prague-based | Tatum, 2022-10-12 | Current EUR 250k–500k initial ticket; capital unknown. Deployed capital is not fund size. |
| i&i Bio | EIF lists its management team in Czechia; Prague adviser is distinguished from the Luxembourg fund | iQure, 2025-01-07 | EUR 0.5M–2M sweet spot; EUR 53M fund-size observation from 2023-09-20. |
| Inven Capital | Official investment team and CEZ operational contact in Prague, corroborated by EIB's Czech VC description | Vytal, 2025-03-11 | EUR 2M–30M ticket; EUR 500M aggregate fund capital, not available cash. |
| Tilia Impact Ventures | EIF Czech team location, current office and FaceUp's Prague-based description | FaceUp, 2026-05-19 | Current EUR 300k–1.2M ticket; historical EUR 26.5M Fund II size. |
| Jet Ventures (Jet Investment) | Official interview explicitly places headquarters in Brno; venture strategy scoped separately | Headmade Materials, 2025-09-30 | EUR 1.5M average, initial up to EUR 2M, follow-on up to EUR 2.5M: no invented minimum. EUR 50M fund target. |
| JSK Investments — Venture Capital | Self-managed investment leadership and operating-office narrative in Prague | MintNeuro, 2026-10-09 | Initial from EUR 300k with no upper bound; EUR 20M venture target includes EUR 10M internal capital. PE figures excluded. |

Each profile links its claims to public sources with excerpts, publication dates where available and retrieval dates. All new sources were inspected on 16 October 2026. See [the source/date table](pilot_evidence.md) and [canonical records](../data/investors.json) for exact URLs and financial scope. Jet's Headmade contribution is explicitly EUR 1M; other round totals are not attributed to individual investors.

[EIF's December 2025 fund-manager list](https://www.eif.org/files/attachments/eif-equity-fundmanagers-all-countries-dec-2025.pdf), page 3, identifies the team locations for i&i Bio, Tilia and Tensor. Team location and fund domicile are different. Together with current operational information, this resolves Tensor's Czech management-base question; it is now eligible. The list's as-of period is December 2025, not its retrieval date.

Sector aliases AI and Defence are normalized to the existing Artificial intelligence and Defense labels for search. Source wording is retained in evidence. General early-stage mandates are not silently converted into specific funding rounds.

## Scope and unresolved candidates

Jet and JSK each appear once, with their documented venture activities separated from PE. This applies the activity-based inclusion rule; it does not admit PE-only organizations or family offices without qualifying VC evidence. Abris remains Polish PE, outside this pilot. Other PE, foreign, debt and service-provider observations stay in the separate [CVCA extraction](cvca_membership_extraction.md).

Nation1/N1 now describes a team split between Prague and San Francisco. Its main Czech management base remains unresolved. Orbit's equity and debt activities need separate evidence; the Czech EIF private-debt listing does not qualify its equity activity. Credo's main base also remains unresolved. These are agent research tasks, not user homework.

## Preserved history

The pre-expansion dataset, candidates and review ledger are saved in `data/snapshots/pre-cvca-promotion-2026-10-16.json`. The original frozen baseline and editable manual review template are unchanged. New reviews use the explicit `cvca_expansion_2026-10-16` frame and a null baseline verdict. They contribute to coverage counts, never to the original baseline's accuracy denominator.
