import type { Dataset, DraftItem, Investor } from "./types";
import { claimText, listText, ticketText, capitalText } from "./format";
import { safeCell, toCsv } from "./csv.mjs";
import humanFieldReview from "../data/human-field-review.json";
export { safeCell, toCsv } from "./csv.mjs";
export function exportRows(draft: DraftItem[], dataset: Dataset) {
  return draft
    .flatMap((item, index) => {
      const i = dataset.investors.find((x) => x.id === item.id);
      if (!i || i.scopeStatus !== "eligible") return [];
      const sourceIds = new Set(
        Object.values(i).flatMap((v) =>
          v && typeof v === "object" && "sources" in v ? v.sources : [],
        ),
      );
      return [
        {
          order: index + 1,
          investor_id: i.id,
          name: i.name,
          website: i.website,
          office: claimText(i.office),
          legal_domicile: claimText(i.legalDomicile),
          legal_identity_note: i.legalDomicile.note ?? "",
          sectors: claimText(i.sectors, listText),
          stages: claimText(i.stages, listText),
          geography: claimText(i.geography, listText),
          focus: claimText(i.focus, listText),
          focus_basis: i.focus.basis ?? "stated_or_not_established",
          focus_note: i.focus.note ?? "",
          typical_ticket: claimText(i.ticket, ticketText),
          ticket_status: i.ticket.status,
          ticket_note: i.ticket.note ?? "",
          capital: claimText(i.capital, capitalText),
          capital_status: i.capital.status,
          capital_note: i.capital.note ?? "",
          documented_company: i.investment.value?.company ?? "",
          evidence_publication_date:
            i.investment.value?.evidencePublishedAt ?? "",
          announcement_date: i.investment.value?.announcedAt ?? "",
          transaction_date: i.investment.value?.transactionDate ?? "",
          round_size: i.investment.value?.roundSize ?? "",
          round_currency: i.investment.value?.currency ?? "",
          individual_contribution: i.investment.value?.investorAmount ?? "",
          scope_status: i.scopeStatus,
          evidence_status: i.evidenceStatus,
          source_review: i.reviewStatus,
          reviewer: i.sourceReview?.reviewer ?? "",
          reviewed_at: i.sourceReview?.reviewedAt ?? "",
          review_note: i.sourceReview?.note ?? "",
          human_review:
            i.reviewStatus === "reviewed" ? "reviewed" : "not_performed",
          human_review_scope: "Entity-level audit not performed",
          human_field_review: humanFieldReview.investorIds.includes(i.id)
            ? `User-reported source check of five fields in ${humanFieldReview.reviewedVersion}; later edits not covered`
            : "not_performed",
          publication_status: dataset.publicationStatus,
          release: dataset.version,
          note: item.note,
          limitations: i.limitations.join("; "),
          sources: dataset.sources
            .filter((s) => sourceIds.has(s.id))
            .map((s) => s.url)
            .join("\n"),
        },
      ];
    })
    .map((row, index) => ({ ...row, order: index + 1 }));
}
function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function exportDraft(
  format: "csv" | "xlsx",
  draft: DraftItem[],
  dataset: Dataset,
) {
  const rows = exportRows(draft, dataset);
  if (!rows.length) throw new Error("Add an investor before exporting.");
  if (format === "csv") {
    download(
      new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" }),
      "investor-final-draft.csv",
    );
    return;
  }
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Final draft");
  const headers = Object.keys(rows[0]);
  sheet.columns = headers.map((key) => ({
    header: key,
    key,
    width: key === "note" || key === "sources" ? 55 : 24,
  }));
  rows.forEach((row) =>
    sheet.addRow(
      Object.fromEntries(Object.entries(row).map(([k, v]) => [k, safeCell(v)])),
    ),
  );
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = {
    from: "A1",
    to: { row: rows.length + 1, column: headers.length },
  };
  sheet.getRow(1).font = { bold: true, color: { argb: "FFF8FAFC" } };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF315CBD" },
  };
  const evidence = workbook.addWorksheet("Evidence");
  evidence.columns = [
    { header: "Source ID", key: "id", width: 24 },
    { header: "Publisher", key: "publisher", width: 25 },
    { header: "URL", key: "url", width: 70 },
    { header: "Published", key: "publishedAt", width: 18 },
    { header: "Retrieved", key: "retrievedAt", width: 18 },
    { header: "Excerpt", key: "excerpt", width: 65 },
    { header: "Summary", key: "summary", width: 75 },
  ];
  const selected = dataset.investors.filter((i) =>
    draft.some((d) => d.id === i.id),
  );
  const used = new Set(
    selected.flatMap((i) =>
      Object.values(i).flatMap((v) =>
        v && typeof v === "object" && "sources" in v ? v.sources : [],
      ),
    ),
  );
  dataset.sources
    .filter((s) => used.has(s.id))
    .forEach((s) => evidence.addRow(s));
  const readme = workbook.addWorksheet("Read me");
  readme.addRow([
    "Research preview. AI review is recorded per profile. User reported checking five fields in 15 prior-version profiles; this is not an entity-level audit or a review of later edits.",
  ]);
  readme.addRow(["Release", dataset.version]);
  readme.addRow([
    "Amounts keep their original currency. Round size is not an individual contribution.",
  ]);
  readme.addRow([
    "Unknown values do not mean zero. Notes and order belong to the user.",
  ]);
  const buffer = await workbook.xlsx.writeBuffer();
  download(
    new Blob([new Uint8Array(buffer)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    "investor-final-draft.xlsx",
  );
}
export function evidenceIds(i: Investor) {
  return [
    ...new Set(
      Object.values(i).flatMap((v) =>
        v && typeof v === "object" && "sources" in v ? v.sources : [],
      ),
    ),
  ];
}
