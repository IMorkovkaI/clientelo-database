export type Missing =
  "not_found" | "not_disclosed" | "not_checked" | "conflicting";
export interface Claim<T> {
  value: T | null;
  status: "supported" | Missing;
  sources: string[];
  note?: string;
  basis?: "portfolio_observation";
}
export interface Source {
  id: string;
  url: string;
  publisher: string;
  title: string;
  publishedAt: string | null;
  retrievedAt: string;
  excerpt: string;
  summary: string;
  kind: "primary" | "institutional";
}
export interface Ticket {
  min: number;
  max: number;
  currency: "EUR" | "USD" | "CZK";
  scope: string;
}
export interface Capital {
  amount: number;
  currency: string;
  metric: "Fund target" | "AUM" | "Fund size" | "Portfolio value";
  scope: string;
  asOf: string | null;
}
export interface Investment {
  company: string;
  evidencePublishedAt: string | null;
  announcedAt: string | null;
  transactionDate: string | null;
  roundSize: number | null;
  currency: string | null;
  investorAmount: number | null;
  note: string;
}
export interface Investor {
  id: string;
  name: string;
  initials: string;
  type: string;
  description: string;
  website: string;
  office: Claim<string>;
  legalDomicile: Claim<string>;
  sectors: Claim<string[]>;
  stages: Claim<string[]>;
  geography: Claim<string[]>;
  focus: Claim<string[]>;
  ticket: Claim<Ticket>;
  capital: Claim<Capital[]>;
  investment: Claim<Investment>;
  scopeStatus: "eligible" | "unresolved" | "ineligible";
  evidenceStatus: "sufficient" | "insufficient" | "conflicting";
  reviewStatus: "pending" | "agent_reviewed" | "reviewed";
  sourceReview?: {
    reviewer: string;
    reviewerType: "ai";
    reviewedAt: string;
    independent: false;
    outcome: "eligible" | "unresolved" | "ineligible";
    note: string;
  };
  lastChecked: string;
  limitations: string[];
}
export interface Dataset {
  version: string;
  asOf: string;
  publicationStatus: "research_preview" | "audited";
  sources: Source[];
  investors: Investor[];
}
export type Criterion = "sectors" | "stages" | "geography" | "ticket" | "focus";
export interface Filters {
  query: string;
  sectors: string;
  stages: string;
  geography: string;
  amount: string;
  currency: "EUR" | "USD" | "CZK";
  focus: string;
  includeUnknown: boolean;
  recentOnly: boolean;
  must: Criterion[];
  sort: "fit" | "name" | "recent";
}
export interface DraftItem {
  id: string;
  note: string;
}
export interface SavedState {
  version: 1;
  filters: Filters;
  draft: DraftItem[];
}
