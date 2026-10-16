import { describe, it, expect } from "vitest";
import raw from "../data/investors.json";
import type { Dataset, Investor } from "../src/types";
import exclusions from "../data/intake/exclusion-checks-2026-10-16.json";
import candidates from "../data/candidates.json";
import ExcelJS from "exceljs";
import { Readable } from "node:stream";
import {
  DEFAULT_FILTERS,
  matches,
  rankInvestors,
  isRecent,
} from "../src/ranking";
import { parseSaved, moveDraft } from "../src/storage";
import { toCsv, exportRows } from "../src/export";
const data = raw as Dataset;
const jt = data.investors.find((i) => i.id === "jt")!;
const look = data.investors.find((i) => i.id === "look")!;
describe("Suitability boundaries", () => {
  it.each(["Austria", "Switzerland"])(
    "matches a documented Europe mandate to %s",
    (country) => {
      const fixture: Investor = {
        ...jt,
        geography: { ...jt.geography, status: "supported", value: ["Europe"] },
      };
      expect(
        matches(fixture, { ...DEFAULT_FILTERS, geography: country })[0].state,
      ).toBe("match");
    },
  );
  it.each(exclusions.records)(
    "keeps $name out of Czech results and exports",
    (control) => {
      expect(candidates.find((c) => c.id === control.id)?.systemDecision).toBe(
        control.expectedDecision,
      );
      expect(data.investors.some((i) => i.id === control.id)).toBe(false);
      // Deliberately offer the ranking/export boundary an out-of-scope record.
      // Matching fields are a test fixture, not researched facts about this company.
      const fixture: Investor = {
        ...jt,
        id: control.id,
        name: control.name,
        scopeStatus: "ineligible",
      };
      for (const includeUnknown of [true, false]) {
        expect(
          rankInvestors(
            [fixture, jt],
            { ...DEFAULT_FILTERS, includeUnknown },
            data.asOf,
          ).map((r) => r.investor.id),
        ).toEqual(["jt"]);
      }
      const rows = exportRows(
        [
          { id: fixture.id, note: "excluded" },
          { id: jt.id, note: "keep" },
        ],
        { ...data, investors: [fixture, jt] },
      );
      expect(rows).toHaveLength(1);
      expect(rows[0].order).toBe(1);
      expect(rows[0].name).toBe(jt.name);
    },
  );
  it("does not use include-unknown to admit unresolved Czech eligibility", () => {
    const unresolved: Investor = { ...jt, scopeStatus: "unresolved" };
    expect(rankInvestors([unresolved], DEFAULT_FILTERS, data.asOf)).toEqual([]);
    expect(
      exportRows([{ id: jt.id, note: "" }], {
        ...data,
        investors: [unresolved],
      }),
    ).toEqual([]);
  });
  it.each(["reflex", "rockaway"])(
    "retains %s with unknown ticket only when requested",
    (id) => {
      const i = data.investors.find((i) => i.id === id)!;
      expect(i.scopeStatus).toBe("eligible");
      expect(i.capital.value).toBeNull();
      const filters = {
        ...DEFAULT_FILTERS,
        amount: "500000",
        must: ["ticket"] as const,
      };
      const result = rankInvestors(
        [i],
        { ...filters, must: [...filters.must] },
        data.asOf,
      );
      expect(result[0].potential).toBe(true);
      expect(
        rankInvestors(
          [i],
          { ...filters, must: [...filters.must], includeUnknown: false },
          data.asOf,
        ),
      ).toEqual([]);
    },
  );
  it("labels observed portfolio matches and does not infer exclusions from missing categories", () => {
    const miton = data.investors.find((i) => i.id === "miton")!;
    expect(
      matches(miton, { ...DEFAULT_FILTERS, focus: "Marketplaces" })[0],
    ).toMatchObject({
      state: "match",
      explanation: expect.stringContaining("portfolio"),
    });
    expect(
      matches(miton, { ...DEFAULT_FILTERS, focus: "Hardware" })[0].state,
    ).toBe("unknown");
    const reflex = data.investors.find((i) => i.id === "reflex")!;
    expect(
      matches(reflex, { ...DEFAULT_FILTERS, stages: "Seed" })[0].state,
    ).toBe("unknown");
  });
  it("matches exact stages and broad sector mandates", () => {
    expect(
      matches(jt, {
        ...DEFAULT_FILTERS,
        sectors: "Artificial intelligence",
        stages: "Seed",
      }).map((c) => c.state),
    ).toEqual(["match", "match"]);
  });
  it("does not normalize away missing evidence", () => {
    const ranked = rankInvestors(
      [look, jt],
      { ...DEFAULT_FILTERS, stages: "Seed", amount: "500000" },
      data.asOf,
    );
    expect(ranked[0].score).toBe(100);
    expect(ranked.find((r) => r.investor.id === "look")?.score).toBe(63);
  });
  it("does not compare different currencies without a rate", () => {
    expect(
      matches(jt, { ...DEFAULT_FILTERS, amount: "500000", currency: "USD" })[0]
        .state,
    ).toBe("unknown");
  });
  it("excludes hard mismatches and separates essential unknowns", () => {
    const r = rankInvestors(
      [look, jt],
      { ...DEFAULT_FILTERS, amount: "500000", must: ["ticket"] },
      data.asOf,
    );
    expect(r[0].investor.id).toBe("jt");
    expect(r[1].potential).toBe(true);
    expect(
      rankInvestors(
        [jt],
        { ...DEFAULT_FILTERS, amount: "9000000", must: ["ticket"] },
        data.asOf,
      ),
    ).toHaveLength(0);
  });
  it("can exclude all unknown matches", () => {
    expect(
      rankInvestors(
        [look],
        { ...DEFAULT_FILTERS, amount: "500000", includeUnknown: false },
        data.asOf,
      ),
    ).toHaveLength(0);
  });
  it("handles initial-ticket endpoints inclusively", () => {
    expect(matches(jt, { ...DEFAULT_FILTERS, amount: "300000" })[0].state).toBe(
      "match",
    );
    expect(
      matches(jt, { ...DEFAULT_FILTERS, amount: "3000000" })[0].state,
    ).toBe("match");
  });
  it("does not infer founder origin from a company country", () => {
    const credo = data.investors.find((i) => i.id === "credo")!;
    expect(
      matches(credo, { ...DEFAULT_FILTERS, geography: "Czechia" })[0].state,
    ).toBe("unknown");
  });
  it("recognizes geography containment and global scope", () => {
    expect(
      matches(jt, { ...DEFAULT_FILTERS, geography: "Czechia" })[0].state,
    ).toBe("match");
    expect(
      matches(look, { ...DEFAULT_FILTERS, geography: "Germany" })[0].state,
    ).toBe("match");
  });
  it("uses dataset date, not the system clock, for activity", () => {
    expect(isRecent(look, "2026-10-15")).toBe(true);
    expect(isRecent(look, "2030-10-15")).toBe(false);
    expect(isRecent(look, "2024-01-01")).toBe(false);
  });
});
describe("Draft persistence and export", () => {
  it("round-trips a reordered Final draft CSV with unknowns and safe multiline notes", async () => {
    const note = '=SUM(1,2)\nConfirm "ticket", then contact.';
    const draft = moveDraft(
      [
        { id: "rockaway", note: "Check fund size" },
        { id: "reflex", note },
        { id: "jt", note: "Known ticket" },
      ],
      1,
      -1,
    );
    const rows = exportRows(draft, data);
    const csv = toCsv(rows);
    const sheet = await new ExcelJS.Workbook().csv.read(Readable.from([csv]), {
      map: (value) => value,
    });
    const headers = sheet.getRow(1).values as string[];
    const get = (row: number, key: string) =>
      sheet.getRow(row).getCell(headers.indexOf(key)).value;
    expect(sheet.rowCount).toBe(4);
    expect([2, 3, 4].map((r) => get(r, "name"))).toEqual([
      "Reflex Capital",
      "Rockaway Ventures",
      "J&T Ventures",
    ]);
    expect([2, 3, 4].map((r) => get(r, "order"))).toEqual(["1", "2", "3"]);
    expect(get(2, "note")).toBe("'" + note);
    expect(get(2, "ticket_status")).toBe("not_found");
    expect(get(2, "ticket_note")).toContain("No bounded");
    expect(get(3, "capital_status")).toBe("not_found");
    expect(get(3, "evidence_publication_date")).toBe("2025-12-19");
    expect(get(3, "individual_contribution")).toBe("");
    expect(get(2, "sources")).toContain("https://www.jtventures.cz/blog");
    expect(get(2, "human_field_review")).toBe("not_performed");
    expect(get(4, "human_field_review")).toContain("preview.4");
  });
  it("recovers from corrupt storage", () =>
    expect(parseSaved("{broken", []).draft).toEqual([]));
  it("drops duplicate and stale records and invalid settings", () => {
    const s = parseSaved(
      JSON.stringify({
        version: 1,
        draft: [
          { id: "jt", note: "a" },
          { id: "jt", note: "b" },
          { id: "gone", note: "" },
        ],
        filters: { sort: "x", currency: "DOGE", includeUnknown: "false" },
      }),
      ["jt"],
    );
    expect(s.draft).toEqual([{ id: "jt", note: "a" }]);
    expect(s.filters.currency).toBe("EUR");
    expect(s.filters.includeUnknown).toBe(true);
  });
  it("reorders without mutating or crossing boundaries", () => {
    const a = ["a", "b"];
    expect(moveDraft(a, 1, -1)).toEqual(["b", "a"]);
    expect(a).toEqual(["a", "b"]);
    expect(moveDraft(a, 0, -1)).toEqual(a);
  });
  it("exports order, original currency, notes and evidence", () => {
    const rows = exportRows(
      [
        { id: "jt", note: "first" },
        { id: "look", note: "second" },
      ],
      data,
    );
    expect(rows[0].name).toBe("J&T Ventures");
    expect(rows[0].human_review).toBe("not_performed");
    expect(rows[0].source_review).toBe("agent_reviewed");
    expect(rows[0].reviewer).toBe("Codex");
    expect(rows[0].legal_domicile).toBe("Czechia");
    expect(rows[0].legal_identity_note).toContain("08220867");
    expect(rows[0].sources).toContain(
      "https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/08220867",
    );
    expect(rows[0].sources).toContain("https://www.jtventures.cz/pristup");
    expect(rows[1].individual_contribution).toBe("");
    expect(rows[1].round_size).toBe(4000000);
  });
  it("escapes CSV quotes, newlines and spreadsheet formulas", () => {
    const csv = toCsv([{ note: '=HYPERLINK("bad")', text: "a, b\nnext" }]);
    expect(csv).toContain("'=HYPERLINK");
    expect(csv).toContain('""bad""');
    expect(csv).toContain('"a, b\nnext"');
  });
  it("keeps retrospective publication separate from announcement and transaction", () => {
    const [row] = exportRows([{ id: "presto", note: "" }], data);
    expect(row.evidence_publication_date).toBe("2024-09-07");
    expect(row.announcement_date).toBe("");
    expect(row.transaction_date).toBe("");
    expect(row.round_size).toBe(1000000);
    expect(row.individual_contribution).toBe("");
  });
  it("preserves ambiguous and imprecise amounts as unknown", () => {
    for (const id of ["kaya", "miton"]) {
      const [row] = exportRows([{ id, note: "" }], data);
      expect(row.round_size).toBe("");
      expect(row.individual_contribution).toBe("");
    }
  });
});
