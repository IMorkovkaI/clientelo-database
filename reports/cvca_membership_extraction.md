# CVCA membership extraction

Checked on 2026-10-16 against the [CVCA membership directory](https://cvca.cz/en/membership/). AI-assisted extraction by Codex; no independent human review.

Screened **84 entries**: 27 full members and 57 associates. Extracted **36 profiles**: all full members and nine investment-related or ambiguous associates. The other 48 associates were screened from their directory descriptions, not fully investigated. Five profiles carry forward the same-day Abris/ARX/CVI/DEPO/EVERITA extraction; 31 are additional detailed extractions.

## How to read the groups

Czech groups mean a listed Czech presence. The pilot requires a verified main investment management base in Czechia, so a Prague address alone does not qualify a new record. Country and investment strategy are recorded separately. Mixed strategies remain separate to avoid losing potential VC leads.

| Group | Profiles |
| --- | ---: |
| Czech VC candidates | 6 |
| VC — main management base unresolved | 2 |
| Czech-listed private equity | 10 |
| Czech-listed mixed strategies | 3 |
| Foreign-listed investors | 8 |
| Other investment activity or unclear entity | 6 |
| Advisory only | 1 |

## Evidence and missing information

Directory entry dates were observed on the membership index. They are not financial as-of dates, current update dates or investment dates. Individual profile publication dates remain unknown.

Reported association observations may be stale. Preserve currencies, bounds, fund scope, targets and deployment plans. Capital figures are never inferred dry powder. Empty financial arrays mean not found in this source.

These profiles do not provide dated transaction evidence sufficient to admit new investors into the pilot. Portfolio examples help identify follow-up sources; they do not establish a transaction date or current investment activity. An absent value means not found in this source, not zero or not publicly available anywhere.

This report preserves extraction-stage observations, before canonical promotion. Six profiles were subsequently admitted after primary-source checks and Tensor's scope was resolved; see [the expansion review](cvca_profile_promotion.md). A later [follow-up](czech_candidate_followup.md) resolves Credo, adds Orbit equity and records Nation1's remaining ambiguity. Existing candidate IDs are reused where available. The frozen audit baseline and user-editable review template are preserved.

## Files

- [All extracted profiles](../data/exports/cvca/all-extracted.csv)
- [Screening log for every member](../data/exports/cvca/membership-screening.csv)
- [Structured observations](../data/intake/cvca-members-2026-10-16.json)

Run `npm run cvca:report` to validate the intake and regenerate the report and CSVs. Copies of the CSVs are included under public/data/cvca for the next website build; generation does not publish the website.

## Extraction-stage follow-up plan

The plan at extraction time was to check official management, strategy and dated investment sources for DEPO, i&i Biotech, Inven, Nation1 and Tilia. Reconcile KAYA with its existing researched profile. Resolve Credo and Tensor's main management base. Inspect the VC activities of Jet and JSK and Orbit's growth-equity boundary separately from their PE/debt activity. Keep foreign PE, private debt, real estate, advisers and unclear entities outside the Czech VC pilot until the relevant criteria are met.

Important source issues: Tilia's displayed website name points to another firm's URL; QI's page title and Conseq body need identity reconciliation. KAYA's CVCA page has no descriptive investment data, so its VC grouping relies on the existing official-source profile. V4C's foreign address belongs to a GP entity and does not establish its management headquarters. Credo/Tensor financial observations must be reconciled with the existing official-source figures before merging.

## Czech VC candidates

[Download this group](../data/exports/cvca/czech_vc_candidates.csv)

### Depo Ventures

[CVCA profile](https://cvca.cz/en/depo-ventures-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-23; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | VC |
| Sectors | Explicitly sector agnostic |
| Investment geography | CEE |
| Investment amounts | EUR 50,000–300,000 (Preferred investment amount; exact initial/follow-on basis unspecified) |
| Capital observations | EUR 5,500,000 — Funds managed as listed; Unspecified managed funds; as of unknown |
| Portfolio examples | Tatum; Spendee; KardiAI |
| Classification / limits | VC with Prague presence; verify main base and dated participation before acceptance. Tatum duplicate removed. |

### i&i Biotech Investments

[CVCA profile](https://cvca.cz/en/biotech-investments/) · Retrieved 2026-10-16 · Directory entry 2020-01-18; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Biotechnology spin-off investing; Research commercialization |
| Sectors | Biotechnology; Drug development; Diagnostics; Medical devices |
| Investment geography | Czechia; Europe |
| Investment amounts | Not found in CVCA profile |
| Capital observations | Not found in CVCA profile |
| Portfolio examples | Not found in CVCA profile |
| Classification / limits | Potential specialist VC based on spin-off mandate. Manager/fund relationship, main base and dated deal require verification. CVCA supplies no ticket or capital amount. |

### Inven Capital

[CVCA profile](https://cvca.cz/en/inven-capital-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-14; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Later-stage cleantech growth investing |
| Sectors | Cleantech |
| Investment geography | EU; Israel; Norway; Liechtenstein; Switzerland |
| Investment amounts | EUR 2,000,000–30,000,000 (Preferred investment amount; exact initial/follow-on basis unspecified) |
| Capital observations | EUR 250,000,000 — Funds managed as listed; Subfunds A+B; as of unknown \| EUR 250,000,000 — Funds managed as listed; Subfunds C+D; as of unknown |
| Portfolio examples | Woltair; SunFire; tado |
| Classification / limits | Growth/venture candidate; confirm venture mandate and management with official sources. Two subfund group amounts retained separately; no inferred dry powder. |

### KAYA VC

[CVCA profile](https://cvca.cz/en/kaya-vc-2/) · Retrieved 2026-10-16 · Directory entry 2020-10-16; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Not found in CVCA profile |
| Sectors | Not found in CVCA profile |
| Investment geography | Not found in CVCA profile |
| Investment amounts | Not found in CVCA profile |
| Capital observations | Not found in CVCA profile |
| Portfolio examples | Not found in CVCA profile |
| Classification / limits | CVCA supplies only contact/location details. VC category relies on the existing primary-source-reviewed KAYA profile, not the name alone. Do not infer missing financial fields from this page. |

### Nation1

[CVCA profile](https://cvca.cz/en/nation1-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-14; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Pre-seed; Seed; Startup financing |
| Sectors | Technology |
| Investment geography | Czechia |
| Investment amounts | EUR 50,000–1,500,000 (Preferred investment amount; exact initial/follow-on basis unspecified) |
| Capital observations | EUR 35,000,000 — Funds managed as listed; Unspecified managed funds; as of unknown |
| Portfolio examples | VRgineers; Snuggs; Buildiro |
| Classification / limits | VC candidate with Prague presence; verify current strategy, main management and a dated investment. |

### Tilia Impact Ventures – Honorary Member

[CVCA profile](https://cvca.cz/en/tilia-impact-ventures-honorary-member/) · Retrieved 2026-10-16 · Directory entry 2020-01-06; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Social and environmental impact investing |
| Sectors | Environment; Education; Inclusion; Civic engagement; Health; Wellbeing |
| Investment geography | Czechia; CEE |
| Investment amounts | CZK 1,000,000–5,000,000 (Preferred investment amount) |
| Capital observations | CZK 62,700,000 — Funds managed as listed; Unspecified managed funds; as of unknown |
| Portfolio examples | Datlab; MIWA; Cyrkl |
| Classification / limits | Impact venture candidate; confirm mandate and dated deals. The displayed tilia.vc link points to skylimit.cz on CVCA: do not use that destination to establish identity. |


## VC — main management base unresolved

[Download this group](../data/exports/cvca/vc_management_unresolved.csv)

### Credo Ventures

[CVCA profile](https://cvca.cz/en/credo-ventures-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-14; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Startup investing; Growth; Expansion |
| Sectors | IT; Internet; Mobile communications |
| Investment geography | CEE |
| Investment amounts | EUR 50,000–10,000,000 (Preferred investment amount; exact initial/follow-on basis unspecified) |
| Capital observations | EUR 170,000,000 — Funds managed as listed; Unspecified managed funds; as of unknown |
| Portfolio examples | Codasip; Deepnote; Productboard |
| Classification / limits | Existing primary-source review lists Prague and Krakow without a settled main base. Preserve current unresolved status. Association EUR range differs from official USD 1–5m; do not overwrite the current profile. |

### Tensor Ventures

[CVCA profile](https://cvca.cz/en/tensor-ventures/) · Retrieved 2026-10-16 · Directory entry 2023-06-20; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Deeptech investing |
| Sectors | Deeptech |
| Investment geography | EU; United States |
| Investment amounts | EUR 250,000–1,000,000 (Preferred investment amount; exact initial/follow-on basis unspecified) |
| Capital observations | EUR 20,000,000 — Funds managed as listed; Unspecified managed funds; as of unknown |
| Portfolio examples | Veracity Protocol; Tatum; Superface |
| Classification / limits | Existing primary review leaves main management unresolved between Czech presence and Luxembourg entities. Retain association figures separately from newer fund targets. |


## Czech-listed private equity

[Download this group](../data/exports/cvca/czech_pe.csv)

### ARX Equity Partners

[CVCA profile](https://cvca.cz/en/arx-equity-partners-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-14; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Buyouts; Acquisitions; Expansion |
| Sectors | Not found in CVCA profile |
| Investment geography | Central Europe |
| Investment amounts | EUR 5,000,000–50,000,000 (Total transaction value, not investor contribution) |
| Capital observations | EUR 300,000,000 — Funds managed as listed; Unspecified managed funds; as of unknown |
| Portfolio examples | Wieden; Promens Zlín; Brebeck Composite |
| Classification / limits | PE strategy; listed transaction range is not a typical equity cheque. |

### Espira Investments

[CVCA profile](https://cvca.cz/en/espira-investments-2/) · Retrieved 2026-10-16 · Directory entry 2021-12-02; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Growth PE; Acquisition financing; Buyouts; Restructuring |
| Sectors | Not found in CVCA profile |
| Investment geography | CEE; Czechia; Slovakia |
| Investment amounts | EUR 1,000,000–3,000,000 (Preferred investment amount; exact initial/follow-on basis unspecified) |
| Capital observations | under EUR 30,000,000 — Funds managed as listed; Managed funds, scope unspecified; as of unknown |
| Portfolio examples | Not found in CVCA profile |
| Classification / limits | PE strategy; capital is under EUR 30m. XXX portfolio and deal-count placeholders omitted. |

### EVERITA Capital

[CVCA profile](https://cvca.cz/en/everita-capital-en/) · Retrieved 2026-10-16 · Directory entry 2020-01-23; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Growth PE |
| Sectors | Healthcare; Education; Food production; Specialist manufacturing; Business services |
| Investment geography | Czechia; Croatia; Poland; Slovakia; Slovenia |
| Investment amounts | EUR 2,000,000–5,000,000 (Preferred investment amount; exact initial/follow-on basis unspecified) |
| Capital observations | EUR 40,000,000 — Fundraising target; Target fund; as of unknown |
| Portfolio examples | Clintrial; Pekarna Hrstić |
| Classification / limits | PE; EUR 40m is a target, not raised or available capital. |

### Genesis Capital Equity s.r.o.

[CVCA profile](https://cvca.cz/en/genesis-capital-equity-s-r-o-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-14; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Acquisitions; Buyouts; Consolidation; Growth PE |
| Sectors | Not found in CVCA profile |
| Investment geography | Czechia; Slovakia; Poland; Hungary; Austria; Germany |
| Investment amounts | EUR 10,000,000–35,000,000 (Equity ticket) |
| Capital observations | EUR 500,000,000 — Funds managed as listed; Unspecified managed funds; as of unknown |
| Portfolio examples | Hecht Motors; Borcad CZ; TES Vsetín |
| Classification / limits | PE investor; equity ticket is explicitly distinguished from whole transaction size. |

### MAM Private Equity Fund SICAV a.s.

[CVCA profile](https://cvca.cz/en/mam-private-equity-fund-sicav-a-s/) · Retrieved 2026-10-16 · Directory entry 2020-01-14; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Buyouts; Leveraged acquisitions; Growth PE |
| Sectors | Explicitly sector agnostic |
| Investment geography | CEE; Czechia; Slovakia |
| Investment amounts | EUR 2,000,000–8,000,000 (Equity investment) |
| Capital observations | EUR 40,000,000 — Funds managed as listed; Open fund; as of unknown |
| Portfolio examples | Raycom; Telco VNT; Comguard |
| Classification / limits | PE strategy. Reconcile fund-versus-manager identity before building a new manager record. |

### SkyLimit Investments

[CVCA profile](https://cvca.cz/en/skylimit-investments-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-14; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Buyouts; Leveraged buyouts; Consolidation; Occasional growth capital |
| Sectors | Mechanical engineering |
| Investment geography | Czechia; Slovakia |
| Investment amounts | EUR 1,000,000–3,000,000 (Preferred investment amount; exact initial/follow-on basis unspecified) |
| Capital observations | EUR 5,000,000 — Funds managed as listed; Open investment structure; as of unknown |
| Portfolio examples | STS Olbramovice; INOX Technology; Ventos Energy Solutions |
| Classification / limits | PE strategy. Source says capital is growing but supplies no financial as-of date. |

### Stratum Partners

[CVCA profile](https://cvca.cz/en/stratum-partners-en/) · Retrieved 2026-10-16 · Directory entry 2024-08-13; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Growth equity; Buyouts; Recapitalization |
| Sectors | Manufacturing; Technology-enabled products/services; Digitalization; New energy; B2B/B2C services |
| Investment geography | Czechia; Slovakia; Neighbouring countries |
| Investment amounts | EUR 2,000,000–6,000,000 (Preferred investment amount; exact initial/follow-on basis unspecified) |
| Capital observations | EUR 40,000,000 — Funds managed as listed; Unspecified managed funds; as of unknown |
| Portfolio examples | Homecare Holding; R2B2; HC electronics |
| Classification / limits | PE/growth mandate; no explicit VC mandate established by the association page. |

### Thein

[CVCA profile](https://cvca.cz/en/thein-2/) · Retrieved 2026-10-16 · Directory entry 2024-03-18; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Leveraged buyouts; Growth capital |
| Sectors | Industry; Railways; IT infrastructure; Cybersecurity |
| Investment geography | Czechia; Slovakia |
| Investment amounts | EUR 1,000,000–5,000,000 (Equity contribution) |
| Capital observations | EUR 40,000,000 — Funds managed as listed; Unspecified managed funds; as of unknown |
| Portfolio examples | TOP ALULIT; PONEC; Thein Digital |
| Classification / limits | PE/industrial growth strategy; technology focus alone is not VC. |

### Versute Investments

[CVCA profile](https://cvca.cz/en/versute-investments-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-14; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Growth PE; Leveraged buyouts; Management buyouts |
| Sectors | Explicitly sector agnostic |
| Investment geography | Czechia; Slovakia |
| Investment amounts | EUR 1,000,000–5,000,000 (Invested equity) |
| Capital observations | EUR 40,000,000 — Funds managed as listed; Open-ended structure; as of unknown |
| Portfolio examples | Tiyo; DCK Holoubkov Bohemia; BOCO PARDUBICE machines |
| Classification / limits | PE investor. Separate operating office from registered office; both are listed in Prague. |

### Pale Fire Capital SE

[CVCA profile](https://cvca.cz/en/pale-fire-capital-se-en/) · Retrieved 2026-10-16 · Directory entry 2020-01-11; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Technology-led PE; Strategic stakes; Succession investments |
| Sectors | Technology; AI-enabled businesses; Traditional industries |
| Investment geography | Not found in CVCA profile |
| Investment amounts | Not found in CVCA profile |
| Capital observations | up to CZK 10,000,000,000 — Deployment plan; Planned deployment over five years; start date unspecified; as of unknown |
| Portfolio examples | Not found in CVCA profile |
| Classification / limits | PE strategy. Five-year deployment plan is not AUM, fund size or cash available. |


## Czech-listed mixed strategies

[Download this group](../data/exports/cvca/czech_mixed.csv)

### Jet Investment

[CVCA profile](https://cvca.cz/en/jet-investment-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-14; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Brno, Czechia; main management not established by this address |
| Strategy | Buyouts; Growth; Turnaround; Late-stage venture |
| Sectors | Manufacturing; Specialty chemicals; Advanced materials; Energy; Renewables; Aerospace; Automotive; Related services |
| Investment geography | Czechia; Slovakia; Austria; Germany; Poland |
| Investment amounts | EUR 15,000,000–80,000,000 (Preferred investment amount; exact initial/follow-on basis unspecified) |
| Capital observations | EUR 290,000,000 — Funds managed as listed; Unspecified managed funds; as of unknown |
| Portfolio examples | Fiberpreg CZ; MSV Metal Studénka; PBS Industry |
| Classification / limits | Mixed PE and explicit late-stage venture; identify the qualifying VC strategy/vehicle rather than exclude all venture activity. |

### Orbit Capital

[CVCA profile](https://cvca.cz/en/orbit-capital-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-12; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Growth equity; Venture debt |
| Sectors | Technology; Technology-enabled scale-ups |
| Investment geography | CEE |
| Investment amounts | EUR 6,000,000–15,000,000 (Growth equity); EUR 2,000,000–6,000,000 (Venture debt) |
| Capital observations | EUR 200,000,000 — Scale-up ambition, not confirmed AUM; Growth equity described as scaling to this amount; as of unknown \| EUR 30,000,000 — Funds managed as listed; Venture debt; as of unknown |
| Portfolio examples | Rohlik; Mews; Twisto CZ |
| Classification / limits | Keep equity and debt tickets separate. Growth equity requires a venture-boundary check; debt alone does not qualify. Scaling-to amount is not confirmed capital. |

### JSK Investments

[CVCA profile](https://cvca.cz/en/jsk-investments-en/) · Retrieved 2026-10-16 · Directory entry 2020-01-17; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Own-capital VC; Private/growth equity; Majority mid-market equity |
| Sectors | Not found in CVCA profile |
| Investment geography | Global ambition in venture strategy; deployment geography unspecified |
| Investment amounts | Not found in CVCA profile |
| Capital observations | Not found in CVCA profile |
| Portfolio examples | Not found in CVCA profile |
| Classification / limits | Explicit VC and PE arms; potentially eligible venture activity after verification. Different entity from the JŠK law firm in the directory. |


## Foreign-listed investors

[Download this group](../data/exports/cvca/foreign_listed.csv)

### Abris Capital

[CVCA profile](https://cvca.cz/en/abris-capital-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-14; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Warsaw, Poland; main management not established by this address |
| Strategy | Growth PE; Buyouts; Expansion |
| Sectors | Not found in CVCA profile |
| Investment geography | CEE |
| Investment amounts | EUR 30,000,000–70,000,000 (Preferred investment amount; exact initial/follow-on basis unspecified) |
| Capital observations | EUR 502,000,000 — Fund size; Abris Fund III; as of unknown \| EUR 450,000,000 — Fund size; Abris Fund II; as of unknown |
| Portfolio examples | AAA Auto |
| Classification / limits | Polish PE investor; user confirmed Polish identity. Do not sum historical funds into current AUM. |

### CVI

[CVCA profile](https://cvca.cz/en/cvi-2/) · Retrieved 2026-10-16 · Directory entry 2023-05-12; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Warsaw, Poland; main management not established by this address |
| Strategy | Private debt; Mezzanine; Occasional minority equity |
| Sectors | Explicitly sector agnostic |
| Investment geography | CEE |
| Investment amounts | EUR 2,000,000–15,000,000 (Mainly financing/debt, not a VC equity cheque) |
| Capital observations | EUR 800,000,000 — Funds managed as listed; Unspecified managed funds; as of unknown |
| Portfolio examples | Saunia; Algotech |
| Classification / limits | Polish-listed private-debt investor; occasional equity does not establish VC. |

### Enterprise Investors

[CVCA profile](https://cvca.cz/en/enterprise-investors-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-14; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Warsaw, Poland; main management not established by this address |
| Strategy | Buyouts; Expansion |
| Sectors | Not found in CVCA profile |
| Investment geography | CEE |
| Investment amounts | EUR 20,000,000–50,000,000 (Preferred investment amount; exact initial/follow-on basis unspecified) |
| Capital observations | over EUR 2,500,000,000 — Funds managed as listed; Managed funds, scope unspecified; as of unknown |
| Portfolio examples | Not found in CVCA profile |
| Classification / limits | Polish-listed PE investor. Capital is over EUR 2.5bn, not exactly that amount. |

### Innova Capital

[CVCA profile](https://cvca.cz/en/innova-capital-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-14; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Warsaw, Poland; main management not established by this address |
| Strategy | Growth PE; Buyouts; Bridge financing; Replacement capital |
| Sectors | Finance; TMT; Business services; Construction; Industrial; Automotive; Energy; Healthcare |
| Investment geography | Central Europe |
| Investment amounts | EUR 20,000,000–50,000,000 (Preferred investment amount; exact initial/follow-on basis unspecified) |
| Capital observations | EUR 900,000,000 — Funds managed as listed; Unspecified managed funds; as of unknown |
| Portfolio examples | Not found in CVCA profile |
| Classification / limits | Polish-listed PE investor. Placeholder portfolio names omitted. |

### Integral Capital Group

[CVCA profile](https://cvca.cz/en/integral-capital-group-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-14; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Budapest, Hungary; main management not established by this address |
| Strategy | PE |
| Sectors | Healthcare; Industrial; TMT; Consumer; Business services |
| Investment geography | CEE; Bulgaria; Romania; Adria; Czechia; Slovenia; Slovakia; Hungary |
| Investment amounts | EUR 5,000,000–15,000,000 (Preferred investment amount; exact initial/follow-on basis unspecified) |
| Capital observations | EUR 200,000,000 — Funds managed as listed; Unspecified managed funds; as of unknown |
| Portfolio examples | Borcad; Codecool; Luminochem |
| Classification / limits | Hungarian-listed PE investor. Exited or exit-signed holdings are not represented as current holdings. |

### Mid Europa Partners

[CVCA profile](https://cvca.cz/en/mid-europa-partners-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-14; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | London, United Kingdom; main management not established by this address |
| Strategy | Acquisitions; Buyouts; Expansion; Consolidation |
| Sectors | Consumer; Retail; Health services; Pharmacy; Technology; Media; Communications; Business services; Finance; Transport; Logistics |
| Investment geography | Not found in CVCA profile |
| Investment amounts | EUR 50,000,000–200,000,000 (Preferred investment amount; exact initial/follow-on basis unspecified) |
| Capital observations | EUR 5,200,000,000 — Funds managed as listed; Unspecified managed funds; as of unknown |
| Portfolio examples | Karneval; Oskar Mobil; Walmark |
| Classification / limits | Foreign-listed PE. Geography is XXX and remains unknown. Portfolio examples may be historical exits, not current holdings. |

### Sandberg Capital

[CVCA profile](https://cvca.cz/en/sandberg-capital/) · Retrieved 2026-10-16 · Directory entry 2020-01-08; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Bratislava, Slovakia; main management not established by this address |
| Strategy | Buy-and-build; Growth PE |
| Sectors | IT; Education; Retail; Agriculture |
| Investment geography | CEE |
| Investment amounts | EUR 5,000,000–20,000,000 (Preferred investment amount; exact initial/follow-on basis unspecified) |
| Capital observations | EUR 400,000,000 — Funds managed as listed; Unspecified managed funds; as of unknown |
| Portfolio examples | Seyfor; Bakaláři; Revolgy |
| Classification / limits | Slovak-listed PE investor; Czech investments do not establish Czech management. |

### V4C Investment Advisers Limited

[CVCA profile](https://cvca.cz/en/v4c-investment-advisers-limited-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-14; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Luxembourg, Luxembourg; main management not established by this address |
| Strategy | Buyouts; Expansion PE |
| Sectors | Explicitly sector agnostic |
| Investment geography | CEE; Poland; Romania; Czechia |
| Investment amounts | EUR 15,000,000–25,000,000 (Preferred investment amount; exact initial/follow-on basis unspecified) |
| Capital observations | EUR 156,000,000 — Funds managed as listed; Unspecified managed funds; as of unknown |
| Portfolio examples | Not found in CVCA profile |
| Classification / limits | Listed address is a Luxembourg general-partner entity, not proof of main management country. PE excludes it from VC regardless; label foreign-listed rather than confirmed Luxembourg-managed. |


## Other investment activity or unclear entity

[Download this group](../data/exports/cvca/other_investment_or_unclear.csv)

### Accolade

[CVCA profile](https://cvca.cz/en/accolade-2/) · Retrieved 2026-10-16 · Directory entry 2025-03-17; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Industrial property investing; Infrastructure ownership |
| Sectors | Industrial property; Logistics infrastructure |
| Investment geography | Europe |
| Investment amounts | Not found in CVCA profile |
| Capital observations | Not found in CVCA profile |
| Portfolio examples | Brno International Airport |
| Classification / limits | Real-estate/infrastructure investor, not VC. Tenant industries are not startup investment sectors; park counts are not capital. |

### Bonuvis s.r.o.

[CVCA profile](https://cvca.cz/en/bonuvis-s-r-o-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-25; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Corporate-finance advisory; Investment-club management |
| Sectors | Not found in CVCA profile |
| Investment geography | Europe; CEE |
| Investment amounts | Not found in CVCA profile |
| Capital observations | Not found in CVCA profile |
| Portfolio examples | Not found in CVCA profile |
| Classification / limits | Manages clubs for individuals/families. Identify direct investing entity and participation before qualifying; advisory activity alone is insufficient. |

### EMUN investiční společnost, a.s.

[CVCA profile](https://cvca.cz/en/emun-investicni-spolecnost-a-s-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-22; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Multi-family office; Asset management; Private-market funds; Co-investment structures |
| Sectors | Not found in CVCA profile |
| Investment geography | Not found in CVCA profile |
| Investment amounts | Not found in CVCA profile |
| Capital observations | over CZK 10,000,000,000 — Invested and committed assets; Invested and committed assets across platform, not necessarily liquid AUM; as of 2024-12-31 |
| Portfolio examples | Not found in CVCA profile |
| Classification / limits | Explicitly Prague-based family-office platform. Direct investment versus access-fund exposure needs verification. Preserve the actual financial as-of date. |

### QI investiční společnost, a.s.

[CVCA profile](https://cvca.cz/en/qi-investicni-spolecnost-a-s-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-10; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Investment management; details unclear |
| Sectors | Not found in CVCA profile |
| Investment geography | Not found in CVCA profile |
| Investment amounts | Not found in CVCA profile |
| Capital observations | Not found in CVCA profile |
| Portfolio examples | Not found in CVCA profile |
| Classification / limits | Heading names QI, body names Conseq. Identity/mandate mismatch and no direct-investment evidence; unresolved, not automatically a VC investor. |

### RSJ Investments

[CVCA profile](https://cvca.cz/en/rsj-investments-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-09; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Multi-asset fund management; Real-estate investing |
| Sectors | Real estate; Agriculture; Industry; Services; IT; Biotechnology; Healthy food; Renewables; Longevity |
| Investment geography | Not found in CVCA profile |
| Investment amounts | Not found in CVCA profile |
| Capital observations | Not found in CVCA profile |
| Portfolio examples | Not found in CVCA profile |
| Classification / limits | Broad investment group with substantial property exposure. Verify direct startup equity strategy before considering a venture record. |

### WOOD & Company Financial Services

[CVCA profile](https://cvca.cz/en/wood-company-financial-services-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-04; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Brokerage; Asset management; Investment banking; M&A advisory |
| Sectors | Not found in CVCA profile |
| Investment geography | Central Europe |
| Investment amounts | Not found in CVCA profile |
| Capital observations | Not found in CVCA profile |
| Portfolio examples | Not found in CVCA profile |
| Classification / limits | Page focuses on intermediary services. A qualifying direct-investing vehicle/mandate is not established; do not inherit the wider group's investments. |


## Advisory only

[Download this group](../data/exports/cvca/advisory_only.csv)

### Sušánka & partneři

[CVCA profile](https://cvca.cz/en/susanka-partneri-2/) · Retrieved 2026-10-16 · Directory entry 2020-01-08; profile update date unknown.

| Field | Observation |
| --- | --- |
| Listed location | Prague, Czechia; main management not established by this address |
| Strategy | Investment consulting; Wealth allocation advice |
| Sectors | Not found in CVCA profile |
| Investment geography | Not found in CVCA profile |
| Investment amounts | Not found in CVCA profile |
| Capital observations | Not found in CVCA profile |
| Portfolio examples | Not found in CVCA profile |
| Classification / limits | Describes advice and client exposure to VC/PE, not proof the adviser directly invests. Exclude from investor results on this evidence. |

