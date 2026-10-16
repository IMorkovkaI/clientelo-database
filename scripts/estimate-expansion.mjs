import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";

export function estimateExpansion(model) {
  const count = (id) => {
    const value = model.sources.find((s) => s.id === id)?.count;
    assert(
      Number.isFinite(value) && value > 0,
      `Missing population anchor: ${id}`,
    );
    return value;
  };
  const fraction = (value) =>
    Number.isFinite(value) && value >= 0 && value <= 1;
  for (const key of [
    "institutionalRegionalOverlap",
    "qaFraction",
    "contingency",
  ])
    assert(fraction(model[key]), `Invalid ${key}`);
  for (const key of [
    "qaMinutes",
    "maintenanceEngineeringHours",
    "hostingToolsAnnualEUR",
  ])
    assert(Number.isFinite(model[key]) && model[key] >= 0, `Invalid ${key}`);
  const scenarios = model.scenarios.map((s) => {
    for (const [key, value] of Object.entries(s))
      if (key !== "name")
        assert(Number.isFinite(value) && value >= 0, `Invalid ${key}`);
    for (const key of [
      "institutionalPublicYield",
      "familyOfficePublicYield",
      "angelPublicYield",
      "crossCategoryDuplicates",
      "candidateAcceptance",
    ])
      assert(fraction(s[key]), `Invalid ${key}`);
    assert(s.candidateAcceptance > 0, "Acceptance must exceed zero");
    const institutional = Math.round(
      ((count("nvca") + count("invest-europe")) *
        (1 - model.institutionalRegionalOverlap) +
        s.additionalInstitutionalPopulation) *
        s.institutionalPublicYield,
    );
    const familyOffices = Math.round(
      count("deloitte") * s.familyOfficePublicYield,
    );
    const people = Math.round(
      (count("eban") + count("unh")) * s.angelPublicYield +
        s.otherRegionsPublicAngels,
    );
    const accepted = Math.round(
      (institutional + familyOffices + people) *
        (1 - s.crossCategoryDuplicates),
    );
    const candidates = Math.ceil(accepted / s.candidateAcceptance);
    const hours = {
      discoveryExtraction: (candidates * s.discoveryExtractionMinutes) / 60,
      acceptedVerification: (accepted * s.acceptedVerificationMinutes) / 60,
      rejectedVerification:
        ((candidates - accepted) * s.rejectedVerificationMinutes) / 60,
      deduplication: (candidates * s.deduplicationMinutes) / 60,
      qualityAssurance: (accepted * model.qaFraction * model.qaMinutes) / 60,
    };
    const researchHours = Object.values(hours).reduce((a, b) => a + b, 0);
    const researchEUR = researchHours * s.researchHourlyEUR;
    const engineeringEUR = s.engineeringHours * s.engineeringHourlyEUR;
    const collectionToolsEUR = candidates * s.toolsPerCandidateEUR;
    const subtotalEUR = researchEUR + engineeringEUR + collectionToolsEUR;
    const contingencyEUR = subtotalEUR * model.contingency;
    const annualMaintenanceEUR =
      (((accepted *
        s.refreshesPerYear *
        (s.refreshMinutes + model.qaFraction * model.qaMinutes)) /
        60) *
        s.researchHourlyEUR +
        model.maintenanceEngineeringHours * s.engineeringHourlyEUR +
        model.hostingToolsAnnualEUR) *
      (1 + model.contingency);
    return {
      name: s.name,
      institutional,
      familyOffices,
      people,
      accepted,
      candidates,
      hours,
      researchHours,
      researchEUR,
      engineeringEUR,
      collectionToolsEUR,
      contingencyEUR,
      initialEUR: subtotalEUR + contingencyEUR,
      annualMaintenanceEUR,
    };
  });
  return {
    version: model.version,
    asOf: model.asOf,
    currency: model.currency,
    status: model.status,
    scenarios,
  };
}

if (process.argv[1]?.endsWith("estimate-expansion.mjs")) {
  const model = JSON.parse(readFileSync("data/expansion-model.json", "utf8"));
  const results = estimateExpansion(model);
  writeFileSync(
    "reports/expansion-results.json",
    JSON.stringify(results, null, 2) + "\n",
  );
  const number = (v) => Math.round(v).toLocaleString("en-US");
  const rows = results.scenarios
    .map(
      (s) =>
        `| ${s.name} | ${number(s.accepted)} | ${number(s.candidates)} | ${number(s.researchHours)} | €${number(s.initialEUR)} | €${number(s.annualMaintenanceEUR)} |`,
    )
    .join("\n");
  writeFileSync(
    "reports/expansion-calculation.md",
    `# Expansion calculation\n\nGenerated from data/expansion-model.json. These are planning scenarios, not measured costs or confidence intervals. Read global_estimate.md for definitions, sources and limitations.\n\n| Scenario | Publishable records | Candidates screened | Research hours | Initial cost | Annual maintenance |\n| --- | ---: | ---: | ---: | ---: | ---: |\n${rows}\n\nMaintenance refreshes the existing records; new investor discovery and additions are extra. Figures exclude VAT.\n`,
  );
  console.log(JSON.stringify(results, null, 2));
}
