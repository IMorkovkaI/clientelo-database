# Consolidated specification

This document collects the decisions made in the chat and takes precedence over implementation suggestions in the original handoff. The original remains a reference, not an instruction to silently broaden the product.

## Purpose and scope

An assignment deliverable for a Czech firm. The primary user searches for suitable investors, selects a Final draft and exports it. The pilot concerns Czech-based VC investment organizations. PE, individual angels, family offices and other categories belong to future expansion. One investment organization is counted once; funds and capital observations have their own scope.

A Czech investor's main investment management office must be in Czechia. A fund domiciled abroad may qualify. Investing in Czech companies, Czech nationality or a Czech registered address alone is insufficient. Main-office ambiguity means unresolved, not rejected. Include equity and convertible startup investment. An accelerator qualifies only with its own qualifying investments.

Required for eligibility: clear identity, Czech management base, VC strategy, named investment with dated public participation evidence. Missing ticket, capital or strategy details do not automatically invalidate an otherwise eligible investor. Record scope, evidence, activity and reviewer provenance separately. Own-capital groups qualify by venture investment activity and retain a distinct organization type.

## Data behavior

Each claim links to one or more public sources with publisher, URL, title, short excerpt, published date (nullable), retrieval date, and explanation. Unknown reasons: not found, not disclosed, not checked, conflicting. Zero is never a substitute for missing financial data. A source excerpt hash is not a full-page snapshot. Do not claim historical page reproducibility from a URL alone.

Separate ticket, whole-round size, investor contribution, fund size, fundraising target, AUM and portfolio value. Do not infer dry powder. Distinguish announcement, transaction, financial as-of, source publication and retrieval dates. Original currencies remain intact; cross-currency fit is unknown without an approved dated exchange rate.

## Screens and flows

1. **Investors:** restrained desktop layout, left filters, name search, compact ranked rows, active filter chips, sort, per-result fit explanation, profile/evidence link and Add to Final draft. Mobile filters open separately.
2. **Details:** a right panel with identity, current-search fit, investment profile, dated investment evidence, capital, organizational scope, limitations and sources. Expand evidence beside claims. Native dialog provides focus containment and Escape close.
3. **Final draft:** chosen investors, user order, inline notes, comparison selection, removal/undo and CSV/XLSX exports. Persist locally across navigation and refresh. No accounts.
4. **Comparison:** two or three columns, identical rows, evidence, explicit unknowns, differences-only, shared notes and removal. Full-list reordering stays in Final draft. No automatic winner.
5. **Methodology:** definitions, current quality counts, review status and downloads.

## Provisional suitability policy

The user explicitly deferred the final ranking discussion. The UI marks the current policy provisional. The isolated baseline weights are sector 25, stage 25, geography 25, ticket 15 and focus 10. Omitted user criteria are removed from the denominator; missing investor data is not. Supported exact or documented broad matches earn credit. Essential mismatches exclude; essential unknowns are separated after confirmed essential matches when included. Activity breaks ties using captured dates. Founder-origin mandates cannot be established solely from company location.

Known limitation: the current sector vocabulary is deliberately small and exact-match oriented; broad Technology/Deep tech mandates should not be over-interpreted. Define a reviewed taxonomy before treating this as a validated recommendation system.

## Design

See PRODUCT.md and DESIGN.md. Light cool-gray canvas, near-white surfaces, charcoal text, muted-blue actions, amber uncertainty, small radii, thin borders, system sans, tabular financial values. Rows rather than card grids. Text labels accompany every status color.

## Delivery boundaries

The agent performs research and source-by-source review. The owner also supplied sources, clarified ambiguities and reported a five-field check on 15 preview.4 profiles: 62/62 populated fields with no reported error, 13 unknowns separate. This is a scoped, unblinded result, not an entity audit or validation of later edits. The app exposes the research preview and evidence gaps. Worldwide coverage and costs are documented planning scenarios; complete Czech coverage and worldwide accuracy remain unmeasured. The owner will publish. Run E2E at publication or when the user explicitly requests it earlier, as stated in AGENTS.md.
