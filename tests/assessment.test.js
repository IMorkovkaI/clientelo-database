import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import ExcelJS from "exceljs";
import { Readable } from "node:stream";
import { toCsv } from "../src/csv.mjs";
import { evaluateBaseline } from "../scripts/evaluation.mjs";
import { estimateExpansion } from "../scripts/estimate-expansion.mjs";
const read = (path) => JSON.parse(readFileSync(path, "utf8"));

describe("Spreadsheet safety", () => {
  it("round-trips quoted and multiline evidence while neutralizing formulas", async () => {
    const rows = [
      {
        name: '=HYPERLINK("https://example.org")',
        note: 'Evidence, says "yes"\nSecond line',
        plus: "  +SUM(A1)",
        minus: "-1",
        at: "@A1",
        tab: "\t=1",
      },
    ];
    const csv = toCsv(rows);
    const sheet = await new ExcelJS.Workbook().csv.read(Readable.from([csv]));
    expect(sheet.getRow(2).getCell(1).value).toBe("'" + rows[0].name);
    expect(sheet.getRow(2).getCell(2).value).toBe(rows[0].note);
    for (const col of [3, 4, 5, 6])
      expect(sheet.getRow(2).getCell(col).value.startsWith("'")).toBe(true);
    expect(toCsv([], ["name"])).toContain('"name"');
  });
  it("ships source URLs and publication dates beside every reviewed profile", async () => {
    const book = new ExcelJS.Workbook();
    const sheet = await book.csv.readFile("public/data/source-reviewed.csv", {
      map: (value) => value,
    });
    const headers = sheet.getRow(1).values.slice(1);
    const get = (row, key) => row.getCell(headers.indexOf(key) + 1).value;
    const data = read("data/investors.json");
    expect(sheet.rowCount - 1).toBe(data.investors.length);
    for (let row = 2; row <= sheet.rowCount; row++) {
      const r = sheet.getRow(row);
      const investor = data.investors.find(
        (i) => i.id === get(r, "investor_id"),
      );
      for (const id of investor.investment.sources)
        expect(get(r, "investment_evidence_urls")).toContain(
          data.sources.find((s) => s.id === id).url,
        );
      expect(String(get(r, "evidence_published_at"))).toContain(
        investor.investment.value.evidencePublishedAt,
      );
      expect(get(r, "human_review")).toBe("not_performed");
      expect(get(r, "legal_domicile")).toBe(
        investor.legalDomicile.value ?? investor.legalDomicile.status,
      );
      expect(get(r, "legal_identity_note") || "").toBe(
        investor.legalDomicile.note ?? "",
      );
      expect(get(r, "ticket_note") || "").toBe(investor.ticket.note ?? "");
      if (!investor.ticket.value) {
        expect(get(r, "ticket_min") || "").toBe("");
        expect(get(r, "ticket_max") || "").toBe("");
      }
    }
  });
});

describe("Evaluation boundaries", () => {
  it("counts false positives and unresolved positives without upgrading corrected decisions", () => {
    const baseline = {
      version: "frozen",
      investors: ["a", "b", "c", "d"].map((id) => ({
        id,
        scopeStatus: "eligible",
      })),
    };
    const labels = [
      { investorId: "a", outcome: "eligible" },
      { investorId: "b", outcome: "ineligible" },
      { investorId: "c", outcome: "unresolved" },
    ];
    const result = evaluateBaseline(baseline, labels);
    expect(result.precisionAgainstAgentReference).toBe(0.5);
    expect(result.unresolvedAccepted).toBe(1);
    expect(result.unreviewedAccepted).toBe(1);
    expect(result.humanPrecision).toBeNull();
    expect(() => evaluateBaseline(baseline, [...labels, labels[0]])).toThrow(
      "Duplicate",
    );
  });
  it("preserves the two-positive baseline and explicitly dependent reference", () => {
    const baseline = read("data/baselines/2026-10-15/investors.json");
    const reviews = read("data/source-reviews.json").reviews;
    expect(() => evaluateBaseline(baseline, reviews)).toThrow(
      "missing from frozen baseline",
    );
    const result = evaluateBaseline(
      baseline,
      reviews.filter((r) =>
        baseline.investors.some((i) => i.id === r.investorId),
      ),
    );
    expect(result.evaluatedAccepted).toBe(2);
    expect(result.precisionAgainstAgentReference).toBe(1);
    expect(result.illustrativeWilson95[0]).toBeCloseTo(0.3424, 3);
    expect(result.referenceType).toBe("same_agent_source_review");
  });
});

describe("Expansion estimate", () => {
  it("reconciles every cost and increases research cost when verification takes longer", () => {
    const model = read("data/expansion-model.json");
    const result = estimateExpansion(model);
    for (const s of result.scenarios) {
      expect(s.candidates).toBeGreaterThanOrEqual(s.accepted);
      expect(s.initialEUR).toBeCloseTo(
        s.researchEUR +
          s.engineeringEUR +
          s.collectionToolsEUR +
          s.contingencyEUR,
        6,
      );
      expect(s.annualMaintenanceEUR).toBeGreaterThan(0);
    }
    const base = result.scenarios[1];
    model.scenarios[1].acceptedVerificationMinutes += 10;
    expect(
      estimateExpansion(model).scenarios[1].initialEUR - base.initialEUR,
    ).toBeCloseTo(
      ((base.accepted * 10) / 60) *
        model.scenarios[1].researchHourlyEUR *
        (1 + model.contingency),
      6,
    );
    model.scenarios[1].candidateAcceptance = 0;
    expect(() => estimateExpansion(model)).toThrow("Acceptance");
  });
});
