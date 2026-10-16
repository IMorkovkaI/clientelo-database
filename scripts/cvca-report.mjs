import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { toCsv } from "../src/csv.mjs";

const batch = JSON.parse(
  readFileSync("data/intake/cvca-members-2026-10-16.json", "utf8"),
);
const screening = JSON.parse(
  readFileSync("data/intake/cvca-screening-2026-10-16.json", "utf8"),
);
const groups = {
  czech_vc_candidates: "Czech VC candidates",
  vc_management_unresolved: "VC — main management base unresolved",
  czech_pe: "Czech-listed private equity",
  czech_mixed: "Czech-listed mixed strategies",
  foreign_listed: "Foreign-listed investors",
  other_investment_or_unclear: "Other investment activity or unclear entity",
  advisory_only: "Advisory only",
};
const relations = {
  equal: "",
  greater_than: "over ",
  less_than: "under ",
  up_to: "up to ",
};
const date = (value) => {
  assert.match(value, /^\d{4}-\d{2}-\d{2}$/u);
  assert.equal(new Date(value).toISOString().slice(0, 10), value);
};
const url = (value) => {
  const parsed = new URL(value);
  assert.equal(parsed.protocol, "https:");
  assert.equal(parsed.hostname, "cvca.cz");
  assert.equal(parsed.username + parsed.password, "");
};
const unique = (values) => assert.equal(new Set(values).size, values.length);
date(batch.retrievedAt);
unique(batch.records.map((r) => r.candidateId));
unique(batch.records.map((r) => r.source.url));
unique(screening.members.map((r) => r.name));
assert.equal(
  screening.members.filter((r) => r.membership === "full").length,
  screening.fullMembers,
);
assert.equal(
  screening.members.filter((r) => r.membership === "associate").length,
  screening.associateMembers,
);
assert.equal(
  screening.members.length,
  screening.fullMembers + screening.associateMembers,
);
assert.equal(
  screening.members.filter((r) => r.reviewDepth === "profile_extracted").length,
  batch.records.length,
);
for (const member of screening.members) {
  date(member.directoryEntryDate);
  date(member.retrievedAt);
  url(member.sourceUrl);
  assert.ok(["full", "associate"].includes(member.membership));
  assert.ok(
    ["profile_extracted", "directory_description_screened"].includes(
      member.reviewDepth,
    ),
  );
  if (member.membership === "full")
    assert.equal(member.reviewDepth, "profile_extracted");
}
for (const r of batch.records) {
  assert.ok(Object.hasOwn(groups, r.group), r.name);
  url(r.source.url);
  date(r.source.retrievedAt);
  date(r.source.directoryEntryDate);
  assert.equal(r.source.retrievedAt, batch.retrievedAt);
  assert.equal(
    r.verificationStatus,
    "association_extraction_pending_primary_verification",
  );
  const member = screening.members.find(
    (m) =>
      m.sourceUrl === r.source.url && m.reviewDepth === "profile_extracted",
  );
  assert.ok(member, r.name);
  assert.equal(member.name, r.name);
  assert.equal(member.membership, r.membership);
  assert.equal(member.screeningCategory, r.group);
  assert.equal(member.directoryEntryDate, r.source.directoryEntryDate);
  for (const observation of [...r.investmentRanges, ...r.capitalObservations]) {
    assert.match(observation.currency, /^[A-Z]{3}$/u);
    assert.ok(observation.scope);
  }
  for (const range of r.investmentRanges) {
    assert.ok(Number.isFinite(range.min) && range.min > 0);
    assert.ok(Number.isFinite(range.max) && range.max >= range.min);
  }
  for (const capital of r.capitalObservations) {
    assert.ok(Number.isFinite(capital.amount) && capital.amount > 0);
    assert.ok(Object.hasOwn(relations, capital.relation));
    assert.ok(capital.metric);
    if (capital.asOf !== null) date(capital.asOf);
  }
}

const amount = (value) =>
  value.toLocaleString("en-GB", { maximumFractionDigits: 2 });
const ranges = (r) =>
  r.investmentRanges
    .map((v) => `${v.currency} ${amount(v.min)}–${amount(v.max)} (${v.scope})`)
    .join("; ") || "Not found in CVCA profile";
const capital = (r) =>
  r.capitalObservations
    .map(
      (v) =>
        `${relations[v.relation]}${v.currency} ${amount(v.amount)} — ${v.metric}; ${v.scope}; as of ${v.asOf ?? "unknown"}`,
    )
    .join(" | ") || "Not found in CVCA profile";
const list = (value) =>
  value?.length ? value.join("; ") : "Not found in CVCA profile";
const sectors = (r) =>
  r.sectorStatus === "explicitly_sector_agnostic"
    ? "Explicitly sector agnostic"
    : list(r.sectors);
const flat = batch.records.map((r) => ({
  candidate_id: r.candidateId,
  name: r.name,
  group: r.group,
  membership: r.membership,
  listed_city: r.listedLocation.city,
  listed_country: r.listedLocation.country,
  location_basis: r.listedLocation.basis,
  strategy: list(r.strategy),
  sectors: sectors(r),
  sector_status: r.sectorStatus,
  investment_geography: list(r.geography),
  investment_amounts: ranges(r),
  capital_observations: capital(r),
  investment_ranges_json: JSON.stringify(r.investmentRanges),
  capital_observations_json: JSON.stringify(r.capitalObservations),
  portfolio_examples: list(r.portfolioExamples),
  source_url: r.source.url,
  source_publisher: r.source.publisher,
  source_publication_date: r.source.publishedAt ?? "",
  directory_entry_date: r.source.directoryEntryDate,
  retrieved_at: r.source.retrievedAt,
  dated_investment_evidence: r.investmentEvidenceDate ?? "",
  classification_note: r.classificationNote,
  verification_status: r.verificationStatus,
  reviewer_type: batch.reviewerType,
  independent_review: batch.independent,
}));
for (const directory of ["data/exports/cvca", "public/data/cvca"]) {
  mkdirSync(directory, { recursive: true });
  writeFileSync(`${directory}/all-extracted.csv`, toCsv(flat));
  writeFileSync(
    `${directory}/membership-screening.csv`,
    toCsv(screening.members),
  );
  for (const group of Object.keys(groups)) {
    writeFileSync(
      `${directory}/${group}.csv`,
      toCsv(
        flat.filter((r) => r.group === group),
        Object.keys(flat[0]),
      ),
    );
  }
}
const cell = (text) =>
  String(text).replaceAll("|", "\\|").replaceAll("\n", " ");
const report = [
  "# CVCA membership extraction",
  "",
  `Checked on ${batch.retrievedAt} against the [CVCA membership directory](${screening.sourceUrl}). AI-assisted extraction by Codex; no independent human review.`,
  "",
  `Screened **${screening.members.length} entries**: ${screening.fullMembers} full members and ${screening.associateMembers} associates. Extracted **${batch.records.length} profiles**: all full members and nine investment-related or ambiguous associates. The other 48 associates were screened from their directory descriptions, not fully investigated. Five profiles carry forward the same-day Abris/ARX/CVI/DEPO/EVERITA extraction; 31 are additional detailed extractions.`,
  "",
  "## How to read the groups",
  "",
  "Czech groups mean a listed Czech presence. The pilot requires a verified main investment management base in Czechia, so a Prague address alone does not qualify a new record. Country and investment strategy are recorded separately. Mixed strategies remain separate to avoid losing potential VC leads.",
  "",
  "| Group | Profiles |",
  "| --- | ---: |",
  ...Object.entries(groups).map(
    ([key, label]) =>
      `| ${label} | ${batch.records.filter((r) => r.group === key).length} |`,
  ),
  "",
  "## Evidence and missing information",
  "",
  batch.publicationDateNote,
  "",
  batch.financialNote,
  "",
  "These profiles do not provide dated transaction evidence sufficient to admit new investors into the pilot. Portfolio examples help identify follow-up sources; they do not establish a transaction date or current investment activity. An absent value means not found in this source, not zero or not publicly available anywhere.",
  "",
  "This report preserves extraction-stage observations, before canonical promotion. Six profiles were subsequently admitted after primary-source checks and Tensor's scope was resolved; see [the expansion review](cvca_profile_promotion.md). A later [follow-up](czech_candidate_followup.md) resolves Credo, adds Orbit equity and records Nation1's remaining ambiguity. Existing candidate IDs are reused where available. The frozen audit baseline and user-editable review template are preserved.",
  "",
  "## Files",
  "",
  "- [All extracted profiles](../data/exports/cvca/all-extracted.csv)",
  "- [Screening log for every member](../data/exports/cvca/membership-screening.csv)",
  "- [Structured observations](../data/intake/cvca-members-2026-10-16.json)",
  "",
  "Run `npm run cvca:report` to validate the intake and regenerate the report and CSVs. Copies of the CSVs are included under public/data/cvca for the next website build; generation does not publish the website.",
  "",
  "## Extraction-stage follow-up plan",
  "",
  "The plan at extraction time was to check official management, strategy and dated investment sources for DEPO, i&i Biotech, Inven, Nation1 and Tilia. Reconcile KAYA with its existing researched profile. Resolve Credo and Tensor's main management base. Inspect the VC activities of Jet and JSK and Orbit's growth-equity boundary separately from their PE/debt activity. Keep foreign PE, private debt, real estate, advisers and unclear entities outside the Czech VC pilot until the relevant criteria are met.",
  "",
  "Important source issues: Tilia's displayed website name points to another firm's URL; QI's page title and Conseq body need identity reconciliation. KAYA's CVCA page has no descriptive investment data, so its VC grouping relies on the existing official-source profile. V4C's foreign address belongs to a GP entity and does not establish its management headquarters. Credo/Tensor financial observations must be reconciled with the existing official-source figures before merging.",
];
for (const [key, label] of Object.entries(groups)) {
  report.push(
    "",
    `## ${label}`,
    "",
    `[Download this group](../data/exports/cvca/${key}.csv)`,
    "",
  );
  for (const r of batch.records.filter((entry) => entry.group === key)) {
    report.push(
      `### ${r.name}`,
      "",
      `[CVCA profile](${r.source.url}) · Retrieved ${r.source.retrievedAt} · Directory entry ${r.source.directoryEntryDate}; profile update date unknown.`,
      "",
      "| Field | Observation |",
      "| --- | --- |",
      `| Listed location | ${cell(r.listedLocation.city)}, ${cell(r.listedLocation.country)}; main management not established by this address |`,
      `| Strategy | ${cell(list(r.strategy))} |`,
      `| Sectors | ${cell(sectors(r))} |`,
      `| Investment geography | ${cell(list(r.geography))} |`,
      `| Investment amounts | ${cell(ranges(r))} |`,
      `| Capital observations | ${cell(capital(r))} |`,
      `| Portfolio examples | ${cell(list(r.portfolioExamples))} |`,
      `| Classification / limits | ${cell(r.classificationNote)} |`,
      "",
    );
  }
}
mkdirSync("reports", { recursive: true });
writeFileSync(
  "reports/cvca_membership_extraction.md",
  report.join("\n") + "\n",
);
console.log(
  `Validated and exported ${batch.records.length} profiles and ${screening.members.length} screening decisions; this generator does not modify canonical profiles or editable intake.`,
);
