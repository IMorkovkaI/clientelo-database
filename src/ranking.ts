import type { Criterion, Filters, Investor } from "./types";
export const DEFAULT_FILTERS: Filters = {
  query: "",
  sectors: "",
  stages: "",
  geography: "",
  amount: "",
  currency: "EUR",
  focus: "",
  includeUnknown: true,
  recentOnly: false,
  must: [],
  sort: "fit",
};
// Provisional chat proposal. Change this isolated policy after the suitability discussion.
export const RANKING_POLICY = {
  version: "provisional-1",
  weights: { sectors: 25, stages: 25, geography: 25, ticket: 15, focus: 10 },
};
export const LABELS: Record<Criterion, string> = {
  sectors: "Sector",
  stages: "Stage",
  geography: "Geography",
  ticket: "Ticket",
  focus: "Focus",
};
export type MatchState = "match" | "mismatch" | "unknown";
export interface Match {
  criterion: Criterion;
  state: MatchState;
  explanation: string;
}
const geographyContains: Record<string, string[]> = {
  CEE: ["Czechia", "Poland", "Slovakia"],
  Europe: ["Czechia", "Poland", "Slovakia", "Germany", "United Kingdom"],
  "NATO & allies": [
    "Czechia",
    "Poland",
    "Slovakia",
    "Germany",
    "United Kingdom",
    "United States",
    "Israel",
  ],
};
export function matches(investor: Investor, filters: Filters): Match[] {
  const result: Match[] = [];
  for (const key of ["sectors", "stages", "geography", "focus"] as const) {
    const requested = filters[key];
    if (!requested) continue;
    const claim = investor[key];
    let state: MatchState = "unknown";
    if (claim.status === "supported" && claim.value) {
      const broad =
        key === "geography"
          ? claim.value.includes("Global") ||
            claim.value.some((v) => geographyContains[v]?.includes(requested))
          : key === "sectors" && claim.value.includes("Sector agnostic");
      // CEE-origin mandates are intentionally not inferred from company location.
      const originConditional =
        key === "geography" && claim.value.includes("CEE founders worldwide");
      state =
        claim.value.includes(requested) || broad
          ? "match"
          : originConditional
            ? "unknown"
            : "mismatch";
    }
    result.push({
      criterion: key,
      state,
      explanation:
        state === "match"
          ? `${LABELS[key]} matches`
          : state === "mismatch"
            ? `${requested} is outside the documented ${LABELS[key].toLowerCase()} focus`
            : `${LABELS[key]} needs confirmation`,
    });
  }
  if (filters.amount && Number(filters.amount) > 0) {
    const t = investor.ticket;
    let state: MatchState = "unknown";
    let explanation = "Ticket not established";
    if (t.status === "supported" && t.value) {
      if (t.value.currency !== filters.currency)
        explanation = `Ticket is in ${t.value.currency}; no exchange-rate assumption`;
      else {
        state =
          Number(filters.amount) >= t.value.min &&
          Number(filters.amount) <= t.value.max
            ? "match"
            : "mismatch";
        explanation =
          state === "match"
            ? "Requested contribution fits the ticket"
            : "Requested contribution is outside the stated ticket";
      }
    }
    result.push({ criterion: "ticket", state, explanation });
  }
  return result;
}
export function isRecent(investor: Investor, asOf: string) {
  const date = investor.investment.value?.announcedAt;
  if (!date) return false;
  const cutoff = new Date(`${asOf}T00:00:00Z`);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - 36);
  return date >= cutoff.toISOString().slice(0, 10) && date <= asOf;
}
export function rankInvestors(
  investors: Investor[],
  filters: Filters,
  asOf: string,
) {
  return investors
    .filter(
      (i) =>
        i.scopeStatus !== "ineligible" &&
        i.name.toLowerCase().includes(filters.query.trim().toLowerCase()),
    )
    .map((investor) => {
      const checks = matches(investor, filters);
      const total = checks.reduce(
        (s, c) => s + RANKING_POLICY.weights[c.criterion],
        0,
      );
      const score = total
        ? Math.round(
            (checks
              .filter((c) => c.state === "match")
              .reduce((s, c) => s + RANKING_POLICY.weights[c.criterion], 0) /
              total) *
              100,
          )
        : 0;
      const coverage = total
        ? Math.round(
            (checks
              .filter((c) => c.state !== "unknown")
              .reduce((s, c) => s + RANKING_POLICY.weights[c.criterion], 0) /
              total) *
              100,
          )
        : 0;
      const potential = checks.some(
        (c) => c.state === "unknown" && filters.must.includes(c.criterion),
      );
      return { investor, checks, score, coverage, potential };
    })
    .filter(
      (r) =>
        !r.checks.some(
          (c) => filters.must.includes(c.criterion) && c.state === "mismatch",
        ),
    )
    .filter(
      (r) =>
        filters.includeUnknown || !r.checks.some((c) => c.state === "unknown"),
    )
    .filter((r) => !filters.recentOnly || isRecent(r.investor, asOf))
    .sort((a, b) => {
      if (a.potential !== b.potential)
        return Number(a.potential) - Number(b.potential);
      if (filters.sort === "name")
        return a.investor.name.localeCompare(b.investor.name);
      const dateOrder = (
        b.investor.investment.value?.announcedAt ?? ""
      ).localeCompare(a.investor.investment.value?.announcedAt ?? "");
      if (filters.sort === "recent")
        return dateOrder || a.investor.name.localeCompare(b.investor.name);
      return (
        b.score - a.score ||
        a.checks.filter((c) => c.state === "mismatch").length -
          b.checks.filter((c) => c.state === "mismatch").length ||
        dateOrder ||
        a.investor.name.localeCompare(b.investor.name)
      );
    });
}
