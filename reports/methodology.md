# Pilot methodology, version 1

As of 15 October 2026. Inclusion and missing-data rules are specified in `docs/SPECIFICATION.md`.

## Discovery

Eight purposively selected organizations were researched through public official websites and investment announcements. Twenty-eight additional entities were captured from [CVCA membership](https://cvca.cz/en/membership/). This combines a development set and a discovery frame; it is neither a full census nor a representative evaluation sample. Association membership is discovery evidence, not proof of investor eligibility. Three association/service entities are marked out of scope, and other directory candidates remain unresolved.

## Extraction and provenance

Initial extraction was curated by an AI assistant from browser-accessible public pages. The implementation does not claim an autonomous scraper or a fully automated end-to-end research pipeline. Canonical JSON preserves claim/source relations, source dates, null reasons and scoped financial values. Public source records retain short quotations and paraphrases, not full copyrighted pages. `source-excerpts.json` hashes the excerpts only. Changing source pages cannot be reconstructed from these hashes.

## Evidence gate and review

Initial acceptance requires a clear investor identity, evidence for Czech management, VC activity and a dated named investment. Eligibility and evidence sufficiency are provisional machine judgments; human review remains pending. Dated investor participation can establish existence without establishing current check-writing capacity. Older evidence does not make a real investor fictitious. Absence of evidence is unresolved, not proof of non-investor status.

## Financial handling

Keep source currency, scope and dates. Fundraising targets are not final closes. AUM is not portfolio value or dry powder. Do not infer a typical ticket from a single deal or allocate whole-round capital equally across participating investors. Missing financial values remain null with a reason.

## Independent evaluation

Before evaluation, freeze the candidate frame and system decisions. Have a human independently label candidates with the verdict hidden; preserve judgments and corrections separately. Calculate precision among audited accepted records and candidate-set recall among audited eligible records. The audit script reports a Wilson 95% interval for precision when there are audited acceptances. It is descriptive for the supplied sample and cannot repair selection bias. Count unresolved outcomes and audit coverage separately. Field correctness, missing-field coverage, duplicates and evidence validity should be reported separately.

## Publication

The static app is a research preview. Only records with eligible scope, sufficient evidence and an approved human review may enter a verified release. Current verified exports are empty. The preview workbook is named accordingly. UI tests validate behavior, not factual accuracy.
