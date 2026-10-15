import type { Dataset, DraftItem, Investor } from "./types";
import { claimText, listText, ticketText, capitalText } from "./format";
export function safeCell(value: unknown) {
  const text = String(value ?? "");
  return /^[\s]*[=+@-]/u.test(text) || /^[\t\r\n]/u.test(text)
    ? `'${text}`
    : text;
}
export function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => `"${safeCell(v).replaceAll('"', '""')}"`;
  return (
    "\uFEFF" +
    [
      headers.map(escape).join(","),
      ...rows.map((row) => headers.map((k) => escape(row[k])).join(",")),
    ].join("\r\n")
  );
}
export function exportRows(draft: DraftItem[], dataset: Dataset) {
  return draft.flatMap((item, index) => {
    const i = dataset.investors.find((x) => x.id === item.id);
    if (!i) return [];
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
        sectors: claimText(i.sectors, listText),
        stages: claimText(i.stages, listText),
        geography: claimText(i.geography, listText),
        focus: claimText(i.focus, listText),
        typical_ticket: claimText(i.ticket, ticketText),
        ticket_status: i.ticket.status,
        capital: claimText(i.capital, capitalText),
        capital_status: i.capital.status,
        documented_company: i.investment.value?.company ?? "",
        announcement_date: i.investment.value?.announcedAt ?? "",
        transaction_date: i.investment.value?.transactionDate ?? "",
        round_size: i.investment.value?.roundSize ?? "",
        round_currency: i.investment.value?.currency ?? "",
        individual_contribution: i.investment.value?.investorAmount ?? "",
        scope_status: i.scopeStatus,
        evidence_status: i.evidenceStatus,
        human_review: i.reviewStatus,
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
  });
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
  readme.addRow(["Research preview; independent human audit pending."]);
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
