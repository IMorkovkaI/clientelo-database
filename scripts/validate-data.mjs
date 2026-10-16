import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
export const validDate = (v) =>
  typeof v === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  !Number.isNaN(Date.parse(v)) &&
  new Date(v).toISOString().slice(0, 10) === v;
export function validHttps(value) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !!url.hostname &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
const positive = (v) => typeof v === "number" && Number.isFinite(v) && v > 0;
const currency = (v) => ["EUR", "USD", "CZK"].includes(v);
export function validateData(d) {
  const sourceIds = new Set();
  const ids = new Set();
  assert(validDate(d.asOf), "Dataset needs an as-of date");
  assert(
    d.publicationStatus === "research_preview",
    "Audited releases need a separate publication process",
  );
  for (const s of d.sources) {
    assert(!sourceIds.has(s.id), "Duplicate source ID");
    sourceIds.add(s.id);
    assert(
      validHttps(s.url),
      "Evidence URL must be valid HTTPS without credentials",
    );
    assert(
      ["primary", "institutional"].includes(s.kind),
      "Invalid source kind",
    );
    assert(
      s.excerpt && s.summary && s.publisher,
      "Source needs attributable evidence",
    );
    assert(validDate(s.retrievedAt), "Invalid retrieval date");
    assert(s.retrievedAt <= d.asOf, "Future retrieval date");
    assert(
      !s.publishedAt || s.publishedAt <= s.retrievedAt,
      "Publication after retrieval",
    );
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
    assert(
      validHttps(i.website),
      "Official URL must be valid HTTPS without credentials",
    );
    assert(
      ["eligible", "unresolved", "ineligible"].includes(i.scopeStatus),
      "Invalid scope status",
    );
    assert(
      ["sufficient", "insufficient", "conflicting"].includes(i.evidenceStatus),
      "Invalid evidence status",
    );
    assert(
      validDate(i.lastChecked) && i.lastChecked <= d.asOf,
      "Invalid last check date",
    );
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
        c?.basis === undefined ||
          (c.basis === "portfolio_observation" &&
            key === "focus" &&
            c.status === "supported" &&
            c.note),
        "Invalid claim basis",
      );
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
        assert(
          c.value != null && Array.isArray(c.sources) && c.sources.length > 0,
          `Unsupported ${key}`,
        );
        if (["sectors", "stages", "geography", "focus"].includes(key))
          assert(
            Array.isArray(c.value) &&
              c.value.length > 0 &&
              c.value.every((v) => typeof v === "string" && v.trim()),
            `Invalid ${key} list`,
          );
        if (["office", "legalDomicile"].includes(key))
          assert(
            typeof c.value === "string" && c.value.trim(),
            `Invalid ${key} text`,
          );
      } else assert(c.value === null, `Missing ${key} must be null`);
      c.sources.forEach((id) =>
        assert(sourceIds.has(id), `Unknown source ${id}`),
      );
    }
    if (i.ticket.value) {
      const t = i.ticket.value;
      assert(
        positive(t.min) &&
          positive(t.max) &&
          t.max >= t.min &&
          currency(t.currency) &&
          t.scope,
        "Invalid ticket",
      );
    }
    if (i.capital.value) {
      assert(
        Array.isArray(i.capital.value) && i.capital.value.length > 0,
        "Invalid capital list",
      );
      for (const c of i.capital.value) {
        assert(
          positive(c.amount) &&
            currency(c.currency) &&
            ["Fund target", "AUM", "Fund size", "Portfolio value"].includes(
              c.metric,
            ) &&
            c.scope,
          "Invalid capital observation",
        );
        assert(
          c.asOf === null || (validDate(c.asOf) && c.asOf <= d.asOf),
          "Invalid capital date",
        );
      }
    }
    if (i.investment.value) {
      const v = i.investment.value;
      assert(
        !v.evidencePublishedAt ||
          (validDate(v.evidencePublishedAt) && v.evidencePublishedAt <= d.asOf),
        "Invalid evidence publication date",
      );
      if (v.evidencePublishedAt)
        assert(
          i.investment.sources.some(
            (id) =>
              d.sources.find((s) => s.id === id)?.publishedAt ===
              v.evidencePublishedAt,
          ),
          "Investment evidence date must match its source publication",
        );
      assert(v.company, "Investment company required");
      assert(
        !v.announcedAt || validDate(v.announcedAt),
        "Invalid announcement",
      );
      assert(!v.announcedAt || v.announcedAt <= d.asOf, "Future investment");
      assert(
        v.transactionDate === null ||
          (validDate(v.transactionDate) && v.transactionDate <= d.asOf),
        "Invalid transaction date",
      );
      assert(
        v.roundSize === null || positive(v.roundSize),
        "Invalid round size",
      );
      assert(
        v.currency === null || currency(v.currency),
        "Invalid investment currency",
      );
      assert(
        (v.roundSize === null && v.investorAmount === null) ||
          currency(v.currency),
        "Amount needs currency",
      );
      if (v.investorAmount !== null)
        assert(positive(v.investorAmount), "Invalid individual contribution");
    }
    if (i.scopeStatus === "eligible") {
      assert(
        i.evidenceStatus === "sufficient",
        "Eligible profile requires sufficient evidence",
      );
    }
    if (i.evidenceStatus === "sufficient") {
      assert(
        i.investment.value?.evidencePublishedAt,
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
    assert(
      ["pending", "agent_reviewed", "reviewed"].includes(i.reviewStatus),
      "Invalid review status",
    );
    // This preview pipeline has no human-review ingestion or release approval.
    assert(
      i.reviewStatus !== "reviewed",
      "Human review cannot be asserted by changing a preview status",
    );
    if (i.reviewStatus === "agent_reviewed") {
      const r = i.sourceReview;
      assert(
        r?.reviewer &&
          r.reviewerType === "ai" &&
          r.independent === false &&
          r.note,
        "AI review needs explicit provenance",
      );
      assert(
        validDate(r.reviewedAt) && r.reviewedAt <= d.asOf,
        "Invalid review date",
      );
      assert(
        r.outcome === i.scopeStatus,
        "Review outcome differs from profile",
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
