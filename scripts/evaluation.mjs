import assert from "node:assert/strict";

// Compare preserved predictions with later labels; never use corrected decisions.
export function evaluateBaseline(baseline, reviews) {
  const seen = new Set();
  let tp = 0,
    fp = 0,
    unresolvedAccepted = 0;
  for (const r of reviews) {
    assert(!seen.has(r.investorId), "Duplicate reference label");
    seen.add(r.investorId);
    const original = baseline.investors.find((i) => i.id === r.investorId);
    assert(original, "Reference label missing from frozen baseline");
    assert(
      ["eligible", "ineligible", "unresolved"].includes(r.outcome),
      "Invalid reference label",
    );
    if (original.scopeStatus !== "eligible") continue;
    if (r.outcome === "eligible") tp++;
    else if (r.outcome === "ineligible") fp++;
    else unresolvedAccepted++;
  }
  const unreviewedAccepted = baseline.investors.filter(
    (i) => i.scopeStatus === "eligible" && !seen.has(i.id),
  ).length;
  const n = tp + fp;
  const precision = n ? tp / n : null;
  const z2 = 1.95996398454 ** 2;
  const center = n ? (precision + z2 / (2 * n)) / (1 + z2 / n) : 0;
  const spread = n
    ? Math.sqrt(z2 * ((precision * (1 - precision)) / n + z2 / (4 * n * n))) /
      (1 + z2 / n)
    : 0;
  return {
    baselineVersion: baseline.version,
    referenceType: "same_agent_source_review",
    reviewedProfiles: reviews.length,
    tp,
    fp,
    unresolvedAccepted,
    unreviewedAccepted,
    evaluatedAccepted: n,
    precisionAgainstAgentReference: precision,
    illustrativeWilson95: n
      ? [Math.max(0, center - spread), Math.min(1, center + spread)]
      : null,
    humanPrecision: null,
    note: "Descriptive agreement with dependent AI reference labels, not validated accuracy. The Wilson interval only illustrates small-n uncertainty; purposive sampling and shared errors invalidate population inference. Unresolved and unchecked accepted records are reported separately, not counted as correct.",
  };
}
