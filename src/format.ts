import type { Claim, Ticket, Capital } from "./types";
export const missingLabels = {
  not_found: "Not found",
  not_disclosed: "Not disclosed",
  not_checked: "Not checked",
  conflicting: "Conflicting sources",
};
export function money(value: number, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}
export function dateLabel(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${value}T00:00:00Z`))
    : "Not stated";
}
export function claimText<T>(
  claim: Claim<T>,
  format: (v: T) => string = String,
) {
  return claim.status === "supported" && claim.value !== null
    ? format(claim.value) +
        (claim.basis === "portfolio_observation" ? " (portfolio examples)" : "")
    : (missingLabels[claim.status as keyof typeof missingLabels] ??
        "Not found");
}
export const listText = (v: string[]) => v.join(" · ");
export const ticketText = (v: Ticket) =>
  `${money(v.min, v.currency)}–${money(v.max, v.currency)} ${v.currency}`;
export const capitalText = (v: Capital[]) =>
  v
    .map(
      (c) =>
        `${c.metric}: ${money(c.amount, c.currency)} ${c.currency} · ${c.scope} · as of ${dateLabel(c.asOf)}`,
    )
    .join("; ");
