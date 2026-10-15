import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
export function validateData(d) {
  const sourceIds = new Set();
  const ids = new Set();
  const validDate = (v) =>
    /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
  assert(validDate(d.asOf), "Dataset needs an as-of date");
  for (const s of d.sources) {
    assert(!sourceIds.has(s.id), "Duplicate source ID");
    sourceIds.add(s.id);
    assert(/^https:\/\//.test(s.url), "Evidence URL must be HTTPS");
    assert(
      s.excerpt && s.summary && s.publisher,
      "Source needs attributable evidence",
    );
    assert(validDate(s.retrievedAt), "Invalid retrieval date");
    assert(
      !s.publishedAt || validDate(s.publishedAt),
      "Invalid publication date",
    );
    assert(
      !s.publishedAt || s.publishedAt <= d.asOf,
      "Future publication date",
    );
  }
  for (const i of d.investors) {
    assert(!ids.has(i.id), "Duplicate investor ID");
    ids.add(i.id);
    assert(
      i.name && !/DEMO|SYNTHETIC|Example Ventures/i.test(i.name),
      "Synthetic data cannot enter research dataset",
    );
    assert(/^https:\/\//.test(i.website), "Official URL must be HTTPS");
    for (const key of [
      "office",
      "legalDomicile",
      "sectors",
      "stages",
      "geography",
      "focus",
      "ticket",
      "capital",
      "investment",
    ]) {
      const c = i[key];
      assert(
        c &&
          [
            "supported",
            "not_found",
            "not_disclosed",
            "not_checked",
            "conflicting",
          ].includes(c.status),
        `Invalid ${key} state`,
      );
      if (c.status === "supported") {
        assert(c.value !== null && c.sources.length > 0, `Unsupported ${key}`);
      } else assert(c.value === null, `Missing ${key} must be null`);
      c.sources.forEach((id) =>
        assert(sourceIds.has(id), `Unknown source ${id}`),
      );
    }
    if (i.ticket.value) {
      const t = i.ticket.value;
      assert(
        t.min > 0 &&
          t.max >= t.min &&
          ["EUR", "USD", "CZK"].includes(t.currency),
        "Invalid ticket",
      );
    }
    if (i.capital.value)
      for (const c of i.capital.value) {
        assert(
          c.amount > 0 && c.currency && c.metric && c.scope,
          "Invalid capital observation",
        );
        assert(!c.asOf || validDate(c.asOf), "Invalid capital date");
      }
    if (i.investment.value) {
      const v = i.investment.value;
      assert(v.company, "Investment company required");
      assert(
        !v.announcedAt || validDate(v.announcedAt),
        "Invalid announcement",
      );
      assert(!v.announcedAt || v.announcedAt <= d.asOf, "Future investment");
      if (v.investorAmount !== null)
        assert(v.investorAmount > 0, "Invalid individual contribution");
    }
    if (i.evidenceStatus === "sufficient") {
      assert(
        i.investment.value?.announcedAt,
        "Sufficient evidence requires dated investment",
      );
      assert(
        i.investment.sources.some(
          (id) => d.sources.find((s) => s.id === id)?.publishedAt,
        ),
        "Dated publication needed",
      );
      assert(
        i.office.status === "supported",
        "Czech management evidence required",
      );
    }
  }
  return true;
}
if (process.argv[1]?.endsWith("validate-data.mjs")) {
  const d = JSON.parse(readFileSync("data/investors.json", "utf8"));
  validateData(d);
  console.log(
    `Validated ${d.investors.length} profiles and ${d.sources.length} sources. Structural validation is not a human audit.`,
  );
}
