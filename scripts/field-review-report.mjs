import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
import { validDate } from "./validate-data.mjs";

export function summarizeFieldReview(review, snapshot) {
  assert(
    review.reviewedVersion === snapshot.version,
    "Field review version mismatch",
  );
  assert(review.reviewerType === "human", "Human-reported review required");
  assert(
    validDate(review.reviewedAt) && review.reviewer,
    "Review needs a date and reviewer",
  );
  assert(
    review.investorIds.length && review.fields.length,
    "Review sample cannot be empty",
  );
  assert(
    new Set(review.investorIds).size === review.investorIds.length,
    "Duplicate reviewed profile",
  );
  assert(
    new Set(review.fields).size === review.fields.length,
    "Duplicate reviewed field",
  );
  assert(
    review.fields.every((f) =>
      ["sectors", "stages", "geography", "focus", "ticket"].includes(f),
    ),
    "Unsupported review field",
  );
  const profiles = review.investorIds.map((id) => {
    const i = snapshot.investors.find((i) => i.id === id);
    assert(i, "Reviewed profile missing from frozen version");
    return i;
  });
  const counts = review.fields.map((field) => ({
    field,
    populated: profiles.filter((i) => i[field].status === "supported").length,
    unknown: profiles.filter((i) => i[field].status !== "supported").length,
  }));
  const populated = counts.reduce((n, c) => n + c.populated, 0);
  const unknown = counts.reduce((n, c) => n + c.unknown, 0);
  const errors = review.aggregateVerdict?.incorrectPopulatedFields ?? null;
  assert(
    errors === null ||
      (Number.isInteger(errors) && errors >= 0 && errors <= populated),
    "Invalid reported error count",
  );
  return {
    reviewedVersion: review.reviewedVersion,
    reviewedAt: review.reviewedAt,
    reviewer: review.reviewer,
    profileCount: profiles.length,
    counts,
    populatedFields: populated,
    unknownFields: unknown,
    reportedIncorrectFields: errors,
    sourceAgreement:
      errors === null || !populated ? null : (populated - errors) / populated,
    supportedFields: errors === null ? null : populated - errors,
    method:
      "Owner-reported manual source check, aggregate verdict supplied in project chat. One populated profile field is one observation; no independent cell-by-cell audit is claimed.",
    limitation:
      "Purposive sample; fields cluster within profiles and the reviewer saw the existing values. Unknowns and omissions are separate from correctness of supplied values. No population confidence interval, entity precision, recall, capital accuracy or validation of later edits/additions is implied.",
  };
}

if (process.argv[1]?.endsWith("field-review-report.mjs")) {
  const read = (path) => JSON.parse(readFileSync(path, "utf8"));
  const result = summarizeFieldReview(
    read("data/human-field-review.json"),
    read("data/snapshots/pre-missing-data-expansion-2026-10-16.json").dataset,
  );
  writeFileSync(
    "reports/human-field-review-results.json",
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(
    `Human-reported source agreement: ${result.supportedFields}/${result.populatedFields}; ${result.unknownFields} unknown fields reported separately.`,
  );
}
