import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import ExcelJS from "exceljs";
import { validateData } from "./validate-data.mjs";
const dataset = JSON.parse(readFileSync("data/investors.json", "utf8"));
validateData(dataset);
const candidates = JSON.parse(readFileSync("data/candidates.json", "utf8"));
writeFileSync(
  "public/data/investors.json",
  JSON.stringify(dataset, null, 2) + "\n",
);
writeFileSync(
  "public/data/candidates.json",
  JSON.stringify(candidates, null, 2) + "\n",
);
const csv = (rows, headers = Object.keys(rows[0] ?? {})) =>
  "\uFEFF" +
  [headers, ...rows.map((r) => headers.map((k) => r[k] ?? ""))]
    .map((row) =>
      row.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(","),
    )
    .join("\r\n");
writeFileSync("public/data/all_candidates.csv", csv(candidates));
writeFileSync("public/data/evidence_sources.csv", csv(dataset.sources));
const fields = [
  "candidate_id",
  "name",
  "discovery_source",
  "reviewer",
  "reviewed_at",
  "identity_correct",
  "czech_management",
  "vc_eligible",
  "investment_proven",
  "overall_eligible",
  "sector_correct",
  "ticket_correct",
  "capital_correct",
  "evidence_url",
  "reason",
  "minutes_spent",
];
const auditRows = candidates.map((c) => ({
  candidate_id: c.id,
  name: c.name,
  discovery_source: c.discoverySource,
}));
writeFileSync("public/data/manual_review_template.csv", csv(auditRows, fields));
const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet("Research preview");
const rows = dataset.investors.map((i) => ({
  investor_id: i.id,
  name: i.name,
  website: i.website,
  scope: i.scopeStatus,
  evidence: i.evidenceStatus,
  human_review: i.reviewStatus,
  sectors: i.sectors.value?.join("; ") ?? i.sectors.status,
  stages: i.stages.value?.join("; ") ?? i.stages.status,
  geography: i.geography.value?.join("; ") ?? i.geography.status,
  ticket_min: i.ticket.value?.min ?? "",
  ticket_max: i.ticket.value?.max ?? "",
  ticket_currency: i.ticket.value?.currency ?? "",
  ticket_status: i.ticket.status,
  capital: JSON.stringify(i.capital.value),
  company: i.investment.value?.company ?? "",
  announced_at: i.investment.value?.announcedAt ?? "",
  transaction_date: i.investment.value?.transactionDate ?? "",
  reviewed_at: "",
  last_source_check: i.lastChecked,
  limitations: i.limitations.join("; "),
}));
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
// Published, verified data is deliberately a separate release gate.
mkdirSync("data/exports", { recursive: true });
const verified = dataset.investors.filter(
  (i) =>
    i.scopeStatus === "eligible" &&
    i.evidenceStatus === "sufficient" &&
    i.reviewStatus === "reviewed",
);
if (verified.length)
  throw new Error(
    "Reviewed records must be released through an explicit reviewed publication process, not a preview build.",
  );
const exportHeaders = [
  "investor_id",
  "name",
  "verification_status",
  "verified_at",
  "investment_evidence_url",
];
writeFileSync("data/exports/investors_verified.csv", csv([], exportHeaders));
const verifiedBook = new ExcelJS.Workbook();
const v = verifiedBook.addWorksheet("Verified investors");
v.addRow(exportHeaders);
verifiedBook
  .addWorksheet("Read me")
  .addRow(["No independently audited records have been released."]);
await verifiedBook.xlsx.writeFile("data/exports/investors_verified.xlsx");
console.log(
  "Prepared research workbook, candidate/source CSVs, blind audit template and empty verified exports.",
);
