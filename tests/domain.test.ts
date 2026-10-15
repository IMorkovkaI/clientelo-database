import { describe, it, expect } from "vitest";
import raw from "../data/investors.json";
import type { Dataset } from "../src/types";
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
    expect(rows[0].human_review).toBe("pending");
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
});
