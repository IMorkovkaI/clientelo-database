import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import ExcelJS from "exceljs";
const file = process.argv[2];
const candidates = JSON.parse(readFileSync("data/candidates.json", "utf8"));
mkdirSync("reports", { recursive: true });
if (!file) {
  const report = {
    status: "not_measured",
    humanReviewed: 0,
    precision: null,
    recall: null,
    note: "Provide a completed independent human audit CSV. Software tests are not audit evidence.",
  };
  writeFileSync(
    "reports/audit-results.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(report);
} else {
  const workbook = new ExcelJS.Workbook();
  const sheet = await workbook.csv.readFile(file);
  const headers = sheet.getRow(1).values.slice(1);
  const rows = [];
  sheet.eachRow((row, n) => {
    if (n === 1) return;
    const entry = {};
    headers.forEach(
      (h, k) => (entry[h] = String(row.getCell(k + 1).value ?? "").trim()),
    );
    rows.push(entry);
  });
  let tp = 0,
    fp = 0,
    fn = 0,
    tn = 0;
  const seen = new Set();
  let reviewed = 0;
  for (const r of rows) {
    if (!r.overall_eligible) continue;
    if (!["yes", "no"].includes(r.overall_eligible))
      throw Error("overall_eligible must be yes/no or blank");
    if (
      !r.reviewer ||
      !/^\d{4}-\d{2}-\d{2}$/.test(r.reviewed_at) ||
      !r.reason ||
      !r.evidence_url
    )
      throw Error(
        "Each completed review needs reviewer, date, evidence URL and reason",
      );
    if (seen.has(r.candidate_id)) throw Error("Duplicate candidate review");
    seen.add(r.candidate_id);
    const candidate = candidates.find((c) => c.id === r.candidate_id);
    if (!candidate) throw Error("Unknown candidate");
    reviewed++;
    const accepted = candidate.systemDecision === "accepted";
    const eligible = r.overall_eligible === "yes";
    if (accepted && eligible) tp++;
    else if (accepted) fp++;
    else if (eligible) fn++;
    else tn++;
  }
  const n = tp + fp;
  const p = n ? tp / n : null;
  const z = 1.95996398454;
  const denominator = n ? 1 + (z * z) / n : 1;
  const center = n ? (p + (z * z) / (2 * n)) / denominator : null;
  const spread = n
    ? (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / denominator
    : null;
  const report = {
    status: reviewed ? "measured_on_supplied_reviews" : "not_measured",
    humanReviewed: reviewed,
    tp,
    fp,
    fn,
    tn,
    precision: p,
    precisionWilson95: n ? [center - spread, center + spread] : null,
    candidateSetRecall: tp + fn ? tp / (tp + fn) : null,
    note: "Descriptive evaluation only. Unresolved eligible candidates count as missed acceptance. This selected sample does not establish global recall or representative precision. Review corrections must not overwrite original system decisions.",
  };
  writeFileSync(
    "reports/audit-results.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(report);
}
