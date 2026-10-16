import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { validateData } from "../scripts/validate-data.mjs";
import { summarizeReviews } from "../scripts/source-review-report.mjs";
import { summarizeFieldReview } from "../scripts/field-review-report.mjs";
const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const original = read("data/investors.json");
describe("Evidence integrity", () => {
  it("requires sufficient evidence before admitting an eligible profile", () => {
    const d = structuredClone(original);
    d.investors[0].evidenceStatus = "insufficient";
    expect(() => validateData(d)).toThrow(
      "Eligible profile requires sufficient evidence",
    );
  });
  it("keeps ARES identity evidence linked to the exact company identifier", () => {
    const legal = read("data/intake/legal-entities-2026-10-16.json");
    const ids = {
      23823445: "cvca-jsk-investments",
      "05775574": "purple",
      "08220867": "jt",
    };
    for (const row of legal.records) {
      const i = original.investors.find((i) => i.id === ids[row.ico]);
      expect(i.legalDomicile.note).toContain(row.ico);
      expect(
        i.legalDomicile.sources.map(
          (id) => original.sources.find((s) => s.id === id).url,
        ),
      ).toContain(row.sourceUrl);
      expect(row.country).toBe("CZ");
      expect(i.investment.sources).not.toContain(
        i.legalDomicile.sources.at(-1),
      );
    }
  });
  it("keeps the reported human review tied to the 15-profile snapshot", () => {
    const human = read("data/human-field-review.json");
    const snapshot = read(
      "data/snapshots/pre-missing-data-expansion-2026-10-16.json",
    ).dataset;
    expect(human.reviewedVersion).toBe(snapshot.version);
    expect(human.investorIds).toEqual(snapshot.investors.map((i) => i.id));
    expect(human.investorIds).toHaveLength(15);
    expect(human.fields).toEqual([
      "sectors",
      "stages",
      "geography",
      "focus",
      "ticket",
    ]);
    expect(human.investorIds).not.toContain("reflex");
    expect(human.investorIds).not.toContain("rockaway");
  });
  it.each([
    [
      "malformed URL",
      (d) => {
        d.sources[0].url = "https://";
      },
    ],
    [
      "URL credentials",
      (d) => {
        d.sources[0].url = "https://user:password@example.org";
      },
    ],
    [
      "unearned human status",
      (d) => {
        d.investors[0].reviewStatus = "reviewed";
      },
    ],
    [
      "invalid transaction date",
      (d) => {
        d.investors[0].investment.value.transactionDate = "2026-02-30";
      },
    ],
    [
      "infinite ticket",
      (d) => {
        d.investors[0].ticket.value.max = Infinity;
      },
    ],
    [
      "future retrieval",
      (d) => {
        d.sources[0].retrievedAt = "2099-01-01";
      },
    ],
    [
      "empty supported sectors",
      (d) => {
        d.investors[0].sectors.value = [];
      },
    ],
    [
      "invalid capital currency",
      (d) => {
        d.investors[0].capital.value[0].currency = "oops";
      },
    ],
  ])("rejects %s", (_, mutate) => {
    const d = structuredClone(original);
    mutate(d);
    expect(() => validateData(d)).toThrow();
  });
  it("rejects a publication date not supported by a linked source", () => {
    const d = structuredClone(original);
    d.investors[0].investment.value.evidencePublishedAt = "2024-01-23";
    expect(() => validateData(d)).toThrow("must match");
  });
  it("rejects invented independence and invalid calendar dates", () => {
    const d = structuredClone(original);
    d.investors[0].sourceReview.independent = true;
    expect(() => validateData(d)).toThrow("provenance");
    d.investors[0].sourceReview.independent = false;
    d.investors[0].sourceReview.reviewedAt = "2026-02-30";
    expect(() => validateData(d)).toThrow("review date");
  });
  it("reports source review without inventing accuracy", () => {
    const summary = summarizeReviews(
      original,
      read("data/candidates.json"),
      read("data/source-reviews.json"),
      read("data/baselines/2026-10-15/investors.json"),
    );
    expect(summary.agentReviewed).toBe(17);
    expect(summary.changedScopeDecisions).toBe(6);
    expect(summary.baselineReviewed).toBe(8);
    expect(summary.addedProfileReviews).toBe(9);
    expect(summary.screenedWithoutProfile).toBe(6);
    expect(summary.discoveryOnly).toBe(16);
    expect(summary.candidateDecisions).toEqual({
      accepted: 17,
      unresolved: 15,
      out_of_scope: 7,
    });
    expect(summary.baselineEvaluation.reviewedProfiles).toBe(8);
    expect(summary.baselineEvaluation.evaluatedAccepted).toBe(2);
    expect(summary.precision).toBeNull();
    expect(summary.recall).toBeNull();
  });
  it("rejects a ledger decision that disagrees with the frozen baseline", () => {
    const ledger = read("data/source-reviews.json");
    ledger.reviews[0].baselineScope = "eligible";
    expect(() =>
      summarizeReviews(
        original,
        read("data/candidates.json"),
        ledger,
        read("data/baselines/2026-10-15/investors.json"),
      ),
    ).toThrow("decision mismatch");
  });
  it.each(["baselineScope", "reviewFrame"])(
    "rejects a forged expansion %s",
    (field) => {
      const ledger = read("data/source-reviews.json");
      const review = ledger.reviews.find((r) => r.baselineScope === null);
      review[field] =
        field === "baselineScope" ? "eligible" : "original_baseline";
      expect(() =>
        summarizeReviews(
          original,
          read("data/candidates.json"),
          ledger,
          read("data/baselines/2026-10-15/investors.json"),
        ),
      ).toThrow("decision mismatch");
    },
  );
});

describe("Owner-reported field assessment", () => {
  const review = read("data/human-field-review.json");
  const snapshot = read(
    "data/snapshots/pre-missing-data-expansion-2026-10-16.json",
  ).dataset;
  it("derives the 62-field denominator from the frozen version, not the expanded data", () => {
    const result = summarizeFieldReview(review, snapshot);
    expect(result.profileCount).toBe(15);
    expect(result.populatedFields).toBe(62);
    expect(result.unknownFields).toBe(13);
    expect(result.supportedFields).toBe(62);
    expect(result.sourceAgreement).toBe(1);
    expect(result.counts.map((c) => [c.populated, c.unknown])).toEqual([
      [14, 1],
      [15, 0],
      [13, 2],
      [9, 6],
      [11, 4],
    ]);
    expect(() => summarizeFieldReview(review, original)).toThrow(
      "version mismatch",
    );
  });
  it("does not invent an accuracy result without the explicit human verdict", () => {
    const r = structuredClone(review);
    delete r.aggregateVerdict;
    expect(summarizeFieldReview(r, snapshot).sourceAgreement).toBeNull();
    r.aggregateVerdict = { incorrectPopulatedFields: 2 };
    expect(summarizeFieldReview(r, snapshot).sourceAgreement).toBe(60 / 62);
  });
  it.each([-1, 63, 0.5])("rejects an impossible error count: %s", (count) => {
    const r = structuredClone(review);
    r.aggregateVerdict.incorrectPopulatedFields = count;
    expect(() => summarizeFieldReview(r, snapshot)).toThrow("error count");
  });
  it("rejects duplicate fields, duplicate profiles and new-profile contamination", () => {
    const r = structuredClone(review);
    r.fields.push(r.fields[0]);
    expect(() => summarizeFieldReview(r, snapshot)).toThrow(
      "Duplicate reviewed field",
    );
    r.fields.pop();
    r.investorIds.push(r.investorIds[0]);
    expect(() => summarizeFieldReview(r, snapshot)).toThrow(
      "Duplicate reviewed profile",
    );
    r.investorIds[r.investorIds.length - 1] = "reflex";
    expect(() => summarizeFieldReview(r, snapshot)).toThrow(
      "missing from frozen version",
    );
  });
});

describe("Review decision mapping", () => {
  it("accepts a documented out-of-scope decision consistently", () => {
    const d = structuredClone(original);
    const ledger = read("data/source-reviews.json");
    const candidates = read("data/candidates.json");
    const investor = d.investors[0];
    investor.scopeStatus = "ineligible";
    investor.sourceReview.outcome = "ineligible";
    ledger.reviews.find((r) => r.investorId === investor.id).outcome =
      "ineligible";
    candidates.find((c) => c.id === investor.id).systemDecision =
      "out_of_scope";
    expect(() =>
      summarizeReviews(
        d,
        candidates,
        ledger,
        read("data/baselines/2026-10-15/investors.json"),
      ),
    ).not.toThrow();
  });
});
