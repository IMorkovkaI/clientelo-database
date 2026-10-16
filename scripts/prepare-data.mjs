import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { toCsv as csv } from "../src/csv.mjs";
import { summarizeReviews } from "./source-review-report.mjs";
import ExcelJS from "exceljs";
import { validateData } from "./validate-data.mjs";
import { createHash } from "node:crypto";
const dataset = JSON.parse(readFileSync("data/investors.json", "utf8"));
validateData(dataset);
const candidates = JSON.parse(readFileSync("data/candidates.json", "utf8"));
const reviewLedger = JSON.parse(
  readFileSync("data/source-reviews.json", "utf8"),
);
const humanFieldReview = JSON.parse(
  readFileSync("data/human-field-review.json", "utf8"),
);
// Validate the release before writing any derived files.
summarizeReviews(
  dataset,
  candidates,
  reviewLedger,
  JSON.parse(readFileSync("data/baselines/2026-10-15/investors.json", "utf8")),
);
if (dataset.investors.some((i) => i.reviewStatus === "reviewed"))
  throw new Error(
    "Human-reviewed records require a separate publication process.",
  );
mkdirSync("public/data", { recursive: true });
const evidenceRows = dataset.investors.map((i) => {
  const sources = i.investment.sources.map((id) =>
    dataset.sources.find((s) => s.id === id),
  );
  return `| ${i.name} | ${i.scopeStatus} | ${i.investment.value?.company ?? "Unknown"} | ${i.investment.value?.evidencePublishedAt ?? "Unknown"} | ${sources.map((s) => `[${s.publisher}](${s.url}) (retrieved ${s.retrievedAt})`).join("; ")} |`;
});
writeFileSync(
  "reports/pilot_evidence.md",
  `# Pilot investment evidence\n\nGenerated from the canonical dataset. Publication dates support historical participation; they are not necessarily announcement or closing dates. Review provenance: same-agent AI source review, 16 October 2026.\n\n| Investor | Scope | Company | Evidence published | Source and retrieval |\n| --- | --- | --- | --- | --- |\n${evidenceRows.join("\n")}\n`,
);
mkdirSync("public/reports", { recursive: true });
for (const name of [
  "assignment_check.md",
  "research_plan.md",
  "methodology.md",
  "pilot_results.md",
  "pilot_evidence.md",
  "human-field-review-results.json",
  "source-review-results.json",
  "global_estimate.md",
  "expansion-calculation.md",
  "expansion-results.json",
  "legal_identity_check.md",
]) {
  if (name.endsWith(".md")) {
    // Downloaded reports link back to the repository, including evidence/history
    // that intentionally is not duplicated in the website's public folder.
    const source = readFileSync(`reports/${name}`, "utf8");
    const reportUrl = `https://github.com/IMorkovkaI/clientelo-database/blob/main/reports/${name}`;
    const linked = source.replace(
      /(\[[^\]]*\]\()([^\s)]+)(\))/g,
      (match, before, target, after) =>
        /^(?:https?:|#)/.test(target)
          ? match
          : `${before}${new URL(target, reportUrl).href}${after}`,
    );
    writeFileSync(`public/reports/${name}`, linked);
  } else {
    copyFileSync(`reports/${name}`, `public/reports/${name}`);
  }
}
copyFileSync("data/expansion-model.json", "public/data/expansion-model.json");
copyFileSync(
  "data/human-field-review.json",
  "public/data/human-field-review.json",
);
writeFileSync(
  "public/data/source-reviews.json",
  JSON.stringify(reviewLedger, null, 2) + "\n",
);
writeFileSync(
  "public/data/source-excerpts.json",
  JSON.stringify(
    dataset.sources.map((s) => ({
      ...s,
      excerptSha256: createHash("sha256").update(s.excerpt).digest("hex"),
      hashScope: "short excerpt only, not complete webpage",
    })),
    null,
    2,
  ) + "\n",
);
writeFileSync(
  "public/data/investors.json",
  JSON.stringify(dataset, null, 2) + "\n",
);
writeFileSync(
  "public/data/candidates.json",
  JSON.stringify(candidates, null, 2) + "\n",
);
writeFileSync("public/data/all_candidates.csv", csv(candidates));
writeFileSync("public/data/evidence_sources.csv", csv(dataset.sources));
// manual_review_template.csv is editable investor intake. Never regenerate it.
const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet("Research preview");
const rows = dataset.investors.map((i) => ({
  investor_id: i.id,
  name: i.name,
  website: i.website,
  office: i.office.value ?? i.office.status,
  legal_domicile: i.legalDomicile.value ?? i.legalDomicile.status,
  legal_identity_note: i.legalDomicile.note ?? "",
  scope: i.scopeStatus,
  evidence: i.evidenceStatus,
  source_review: i.reviewStatus,
  reviewer: i.sourceReview?.reviewer ?? "",
  review_note: i.sourceReview?.note ?? "",
  human_review: i.reviewStatus === "reviewed" ? "reviewed" : "not_performed",
  human_review_scope: "Entity-level audit not performed",
  human_field_review: humanFieldReview.investorIds.includes(i.id)
    ? `User-reported five-field source check in ${humanFieldReview.reviewedVersion}; later edits not covered`
    : "not_performed",
  focus: i.focus.value?.join("; ") ?? i.focus.status,
  focus_basis: i.focus.basis ?? "stated_or_not_established",
  focus_note: i.focus.note ?? "",
  sectors: i.sectors.value?.join("; ") ?? i.sectors.status,
  stages: i.stages.value?.join("; ") ?? i.stages.status,
  geography: i.geography.value?.join("; ") ?? i.geography.status,
  ticket_min: i.ticket.value?.min ?? "",
  ticket_max: i.ticket.value?.max ?? "",
  ticket_currency: i.ticket.value?.currency ?? "",
  ticket_status: i.ticket.status,
  ticket_scope: i.ticket.value?.scope ?? "",
  ticket_note: i.ticket.note ?? "",
  capital: JSON.stringify(i.capital.value),
  capital_note: i.capital.note ?? "",
  company: i.investment.value?.company ?? "",
  investment_evidence_urls: i.investment.sources
    .map((id) => dataset.sources.find((s) => s.id === id).url)
    .join("; "),
  claim_evidence: JSON.stringify(
    Object.fromEntries(
      Object.entries(i)
        .filter(([, v]) => v && typeof v === "object" && "sources" in v)
        .map(([key, v]) => [
          key,
          v.sources.map((id) => dataset.sources.find((s) => s.id === id).url),
        ]),
    ),
  ),
  round_size: i.investment.value?.roundSize ?? "",
  round_currency: i.investment.value?.currency ?? "",
  individual_contribution: i.investment.value?.investorAmount ?? "",
  investment_note: i.investment.value?.note ?? "",
  announced_at: i.investment.value?.announcedAt ?? "",
  evidence_published_at: i.investment.value?.evidencePublishedAt ?? "",
  transaction_date: i.investment.value?.transactionDate ?? "",
  reviewed_at: i.sourceReview?.reviewedAt ?? "",
  last_source_check: i.lastChecked,
  limitations: i.limitations.join("; "),
}));
writeFileSync(
  "public/data/source-reviewed.csv",
  csv(rows.filter((r) => r.source_review === "agent_reviewed")),
);
sheet.columns = Object.keys(rows[0]).map((key) => ({
  header: key,
  key,
  width: 24,
}));
rows.forEach((r) => sheet.addRow(r));
sheet.views = [{ state: "frozen", ySplit: 1 }];
for (const [name, data] of [
  ["Evidence", dataset.sources],
  ["All candidates", candidates],
  [
    "AI source reviews",
    reviewLedger.reviews.map((r) => ({
      ...r,
      sources: r.sources.join("; "),
      changedFields: r.changedFields.join("; "),
    })),
  ],
  [
    "Read me",
    [
      {
        status:
          "Research preview. No independent human audit has been performed.",
        release: dataset.version,
        warning:
          "Source checks are not human verification. Round sizes are not investor contributions.",
      },
    ],
  ],
]) {
  const sh = workbook.addWorksheet(name);
  sh.columns = Object.keys(data[0]).map((key) => ({
    header: key,
    key,
    width: 35,
  }));
  data.forEach((row) => sh.addRow(row));
}
await workbook.xlsx.writeFile("public/data/research-preview.xlsx");
console.log(
  "Prepared research workbook, candidate/source CSVs and assessment reports. Editable intake left unchanged.",
);
