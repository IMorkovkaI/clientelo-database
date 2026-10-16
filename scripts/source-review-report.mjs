import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
import { validateData } from "./validate-data.mjs";
import { evaluateBaseline } from "./evaluation.mjs";

export function summarizeReviews(dataset, candidates, ledger, baseline) {
  validateData(dataset);
  assert(ledger.version === dataset.version, "Review release mismatch");
  const ids = new Set();
  for (const r of ledger.reviews) {
    assert(!ids.has(r.investorId), "Duplicate review");
    ids.add(r.investorId);
    const i = dataset.investors.find((i) => i.id === r.investorId);
    const prior = baseline.investors.find((i) => i.id === r.investorId);
    assert(i, "Review needs a current profile");
    assert(
      r.outcome === i.scopeStatus &&
        (prior
          ? r.baselineScope === prior.scopeStatus
          : r.baselineScope === null &&
            [
              "cvca_expansion_2026-10-16",
              "public_source_expansion_2026-10-16",
            ].includes(r.reviewFrame)),
      "Review decision mismatch",
    );
    assert(
      r.reviewerType === "ai" && r.independent === false && r.reviewer,
      "AI review provenance required",
    );
    for (const key of [
      "reviewer",
      "reviewerType",
      "reviewedAt",
      "independent",
      "outcome",
      "note",
    ])
      assert(
        r[key] === i.sourceReview?.[key],
        "Ledger/profile provenance mismatch",
      );
    assert(r.sources.length > 0, "Review needs sources");
    for (const id of r.sources)
      assert(
        dataset.sources.some((s) => s.id === id),
        "Unknown review source",
      );
    const c = candidates.find((c) => c.id === i.id);
    assert(
      c?.systemDecision ===
        {
          eligible: "accepted",
          unresolved: "unresolved",
          ineligible: "out_of_scope",
        }[r.outcome],
      "Candidate/profile decision mismatch",
    );
  }
  const reviewed = dataset.investors.filter(
    (i) => i.reviewStatus === "agent_reviewed",
  );
  assert(
    reviewed.length === ids.size && reviewed.every((i) => ids.has(i.id)),
    "Review coverage mismatch",
  );
  const baselineReviews = ledger.reviews.filter((r) =>
    baseline.investors.some((i) => i.id === r.investorId),
  );
  return {
    release: dataset.version,
    asOf: dataset.asOf,
    method: ledger.method,
    candidateCount: candidates.length,
    profileCount: dataset.investors.length,
    sourceCount: dataset.sources.length,
    agentReviewed: reviewed.length,
    baselineReviewed: baselineReviews.length,
    addedProfileReviews: ledger.reviews.length - baselineReviews.length,
    eligibleProfiles: dataset.investors.filter(
      (i) => i.scopeStatus === "eligible",
    ).length,
    unresolvedProfiles: dataset.investors.filter(
      (i) => i.scopeStatus === "unresolved",
    ).length,
    discoveryOnly: candidates.filter((c) => c.research === "discovery_only")
      .length,
    screenedWithoutProfile: candidates.filter((c) => c.research === "screened")
      .length,
    candidateDecisions: Object.fromEntries(
      ["accepted", "unresolved", "out_of_scope"].map((k) => [
        k,
        candidates.filter((c) => c.systemDecision === k).length,
      ]),
    ),
    coverage: {
      typicalTicket: dataset.investors.filter((i) => i.ticket.value).length,
      datedInvestmentPublication: dataset.investors.filter(
        (i) => i.investment.value?.evidencePublishedAt,
      ).length,
      capitalObservation: dataset.investors.filter((i) => i.capital.value)
        .length,
    },
    changedScopeDecisions: baselineReviews.filter(
      (r) => r.outcome !== r.baselineScope,
    ).length,
    independentlyReviewed: 0,
    baselineEvaluation: evaluateBaseline(baseline, baselineReviews),
    precision: null,
    recall: null,
    metricNote:
      "Same-agent purposive source review, without independent reference labels. Review coverage and corrections are measured; accuracy and market recall are not.",
  };
}

if (process.argv[1]?.endsWith("source-review-report.mjs")) {
  const read = (path) => JSON.parse(readFileSync(path, "utf8"));
  const summary = summarizeReviews(
    read("data/investors.json"),
    read("data/candidates.json"),
    read("data/source-reviews.json"),
    read("data/baselines/2026-10-15/investors.json"),
  );
  writeFileSync(
    "reports/source-review-results.json",
    JSON.stringify(summary, null, 2) + "\n",
  );
  console.log(JSON.stringify(summary, null, 2));
}
