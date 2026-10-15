import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  Filter,
  Globe2,
  Info,
  Layers3,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
  GitCompareArrows,
  ExternalLink,
  CircleHelp,
} from "lucide-react";
import raw from "../data/investors.json";
import candidates from "../data/candidates.json";
import type {
  Claim,
  Criterion,
  Dataset,
  Filters,
  Investor,
  SavedState,
} from "./types";
import {
  DEFAULT_FILTERS,
  LABELS,
  RANKING_POLICY,
  rankInvestors,
  matches,
  isRecent,
} from "./ranking";
import { moveDraft, parseSaved, STORAGE_KEY } from "./storage";
import {
  capitalText,
  claimText,
  dateLabel,
  listText,
  missingLabels,
  money,
  ticketText,
} from "./format";
import { evidenceIds, exportDraft } from "./export";

const dataset = raw as Dataset;
const options = {
  sectors: [
    "Artificial intelligence",
    "Technology",
    "Deep tech",
    "Security",
    "Defense",
    "Aerospace",
    "E-commerce",
    "Web3",
    "Mental health",
    "Gastrotech",
  ],
  stages: ["Pre-seed", "Seed", "Series A", "Growth"],
  geography: [
    "Czechia",
    "Poland",
    "Slovakia",
    "Germany",
    "United Kingdom",
    "United States",
    "Israel",
  ],
  focus: ["B2B", "B2C", "Software", "Hardware", "Marketplaces", "Dual-use"],
};
const byId = (id: string) => dataset.investors.find((i) => i.id === id)!;
const baseUrl = import.meta.env.BASE_URL;
type View = "investors" | "draft" | "compare" | "methodology";
function readInitial(): SavedState {
  try {
    return parseSaved(
      localStorage.getItem(STORAGE_KEY),
      dataset.investors.map((i) => i.id),
    );
  } catch {
    return parseSaved(null, []);
  }
}
function initialView(): View {
  return location.hash === "#final-draft"
    ? "draft"
    : location.hash === "#methodology"
      ? "methodology"
      : "investors";
}

function Evidence({
  ids,
  label = "View evidence",
}: {
  ids: string[];
  label?: string;
}) {
  if (!ids.length) return null;
  return (
    <details className="evidence">
      <summary>
        <FileText size={13} />
        {label}
        <span>{ids.length}</span>
      </summary>
      <div className="evidence-body">
        {ids.map((id) => {
          const s = dataset.sources.find((s) => s.id === id);
          return s ? (
            <article key={id}>
              <div className="eyebrow">
                {s.kind === "primary" ? "Primary source" : "Discovery source"} ·{" "}
                {s.publisher}
              </div>
              <h4>{s.title}</h4>
              <blockquote>“{s.excerpt}”</blockquote>
              <p>{s.summary}</p>
              <dl className="source-dates">
                <div>
                  <dt>Published</dt>
                  <dd>{dateLabel(s.publishedAt)}</dd>
                </div>
                <div>
                  <dt>Retrieved</dt>
                  <dd>{dateLabel(s.retrievedAt)}</dd>
                </div>
              </dl>
              <a href={s.url} target="_blank" rel="noreferrer">
                Open original source <ExternalLink size={12} />
              </a>
            </article>
          ) : null;
        })}
      </div>
    </details>
  );
}
function ClaimValue<T>({
  claim,
  format = String,
}: {
  claim: Claim<T>;
  format?: (v: T) => string;
}) {
  const missing = claim.status !== "supported";
  return (
    <div className="claim-value">
      <span className={missing ? "missing" : ""}>
        {claimText(claim, format)}
      </span>
      {missing && claim.note && <small>{claim.note}</small>}
      <Evidence ids={claim.sources} />
    </div>
  );
}
function Avatar({
  investor,
  large = false,
}: {
  investor: Investor;
  large?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`avatar avatar-${investor.id}${large ? " large" : ""}`}
    >
      {investor.initials}
    </span>
  );
}
function FitSummary({
  investor,
  filters,
}: {
  investor: Investor;
  filters: Filters;
}) {
  const checks = matches(investor, filters);
  if (!checks.length)
    return (
      <span className="muted">
        Set your criteria to see fit and evidence gaps.
      </span>
    );
  return (
    <div className="fit-summary">
      {checks.map((c) => (
        <span
          key={c.criterion}
          className={`fit-${c.state}`}
          title={c.explanation}
        >
          {c.state === "match" ? (
            <Check size={13} />
          ) : c.state === "unknown" ? (
            <CircleHelp size={13} />
          ) : (
            <X size={13} />
          )}{" "}
          {LABELS[c.criterion]}
          {c.state === "unknown"
            ? " unknown"
            : c.state === "mismatch"
              ? " mismatch"
              : ""}
        </span>
      ))}
    </div>
  );
}

export default function App() {
  const [saved, setSaved] = useState(readInitial);
  const filters = saved.filters;
  const draft = saved.draft;
  const [view, setView] = useState<View>(initialView);
  const [detail, setDetail] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [toast, setToast] = useState<{
    text: string;
    undo?: () => void;
  } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const searchScroll = useRef(0);
  const mainTitle = useRef<HTMLHeadingElement>(null);
  const ranked = useMemo(
    () => rankInvestors(dataset.investors, filters, dataset.asOf),
    [filters],
  );
  const selectedInvestors = selected
    .filter((id) => draft.some((d) => d.id === id))
    .map(byId);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [saved]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 9000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const d = dialog.current;
    if (detail && !d?.open) d?.showModal();
    else if (!detail && d?.open) d?.close();
  }, [detail]);
  useEffect(() => {
    if (!detail) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [detail]);
  useEffect(() => {
    const handle = () => {
      setView(initialView());
      setDetail(null);
    };
    window.addEventListener("hashchange", handle);
    return () => window.removeEventListener("hashchange", handle);
  }, []);
  function navigate(next: View) {
    if (view === "investors") searchScroll.current = window.scrollY;
    setView(next);
    setDetail(null);
    setMobileFilters(false);
    history.replaceState(
      null,
      "",
      next === "draft"
        ? "#final-draft"
        : next === "methodology"
          ? "#methodology"
          : next === "compare"
            ? "#compare"
            : "#investors",
    );
    requestAnimationFrame(() => {
      window.scrollTo(0, next === "investors" ? searchScroll.current : 0);
      mainTitle.current?.focus({ preventScroll: true });
    });
  }
  function setFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setSaved((s) => ({ ...s, filters: { ...s.filters, [key]: value } }));
  }
  function reset() {
    setSaved((s) => ({ ...s, filters: { ...DEFAULT_FILTERS } }));
  }
  function add(id: string) {
    if (draft.some((d) => d.id === id)) return;
    setSaved((s) => ({ ...s, draft: [...s.draft, { id, note: "" }] }));
    setToast({
      text: `${byId(id).name} added to Final draft`,
      undo: () =>
        setSaved((s) => ({ ...s, draft: s.draft.filter((d) => d.id !== id) })),
    });
  }
  function remove(id: string) {
    const index = draft.findIndex((d) => d.id === id);
    const item = draft[index];
    if (!item) return;
    setSaved((s) => ({ ...s, draft: s.draft.filter((d) => d.id !== id) }));
    setSelected((s) => s.filter((x) => x !== id));
    setToast({
      text: `${byId(id).name} removed`,
      undo: () =>
        setSaved((s) => {
          if (s.draft.some((d) => d.id === id)) return s;
          const next = [...s.draft];
          next.splice(Math.min(index, next.length), 0, item);
          return { ...s, draft: next };
        }),
    });
  }
  function select(id: string) {
    setSelected((s) =>
      s.includes(id)
        ? s.filter((x) => x !== id)
        : s.length < 3
          ? [...s, id]
          : s,
    );
  }
  async function download(format: "csv" | "xlsx") {
    setExporting(true);
    try {
      await exportDraft(format, draft, dataset);
      setToast({ text: `Final draft exported as ${format.toUpperCase()}` });
    } catch {
      setToast({ text: "Export failed. Please try again." });
    } finally {
      setExporting(false);
    }
  }
  function AddButton({
    id,
    compact = false,
  }: {
    id: string;
    compact?: boolean;
  }) {
    const added = draft.some((d) => d.id === id);
    return (
      <button
        className={`button ${added ? "added" : compact ? "secondary" : "primary"}`}
        onClick={() => add(id)}
        disabled={added}
        aria-label={
          added
            ? `${byId(id).name} is in Final draft`
            : `Add ${byId(id).name} to Final draft`
        }
      >
        {added ? <Check size={16} /> : <Plus size={16} />}{" "}
        {added ? "Added" : compact ? "Add to draft" : "Add to Final draft"}
      </button>
    );
  }
  const activeKeys = (
    ["sectors", "stages", "geography", "focus"] as const
  ).filter((k) => filters[k]);
  function FilterContent() {
    return (
      <>
        <div className="filter-heading">
          <h2>
            <SlidersHorizontal size={16} />
            Your criteria
          </h2>
          <button className="text-button" onClick={reset}>
            Reset
          </button>
        </div>
        <p className="small muted">Tell us what your company needs.</p>
        {(["sectors", "stages", "geography", "focus"] as const).map((key) => (
          <div className="filter-field" key={key}>
            <label htmlFor={`filter-${key}`}>
              {key === "stages"
                ? "Company stage"
                : key === "geography"
                  ? "Company location"
                  : LABELS[key]}
            </label>
            <select
              id={`filter-${key}`}
              value={filters[key]}
              onChange={(e) => setFilter(key, e.target.value)}
            >
              <option value="">Any {LABELS[key].toLowerCase()}</option>
              {options[key].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            {filters[key] && (
              <label className="check-label small">
                <input
                  type="checkbox"
                  checked={filters.must.includes(key)}
                  onChange={(e) =>
                    setFilter(
                      "must",
                      e.target.checked
                        ? [...filters.must, key]
                        : filters.must.filter((k) => k !== key),
                    )
                  }
                />
                Must match {LABELS[key].toLowerCase()}
              </label>
            )}
          </div>
        ))}
        <div className="filter-field">
          <label htmlFor="amount">Investment amount</label>
          <div className="amount-input">
            <select
              aria-label="Investment currency"
              value={filters.currency}
              onChange={(e) =>
                setFilter("currency", e.target.value as Filters["currency"])
              }
            >
              <option>EUR</option>
              <option>USD</option>
              <option>CZK</option>
            </select>
            <input
              id="amount"
              type="number"
              min="1"
              step="any"
              placeholder="e.g. 500000"
              value={filters.amount}
              onChange={(e) => setFilter("amount", e.target.value)}
            />
          </div>
          <small>Contribution from one investor.</small>
          {filters.amount && (
            <label className="check-label small">
              <input
                type="checkbox"
                checked={filters.must.includes("ticket")}
                onChange={(e) =>
                  setFilter(
                    "must",
                    e.target.checked
                      ? [...filters.must, "ticket"]
                      : filters.must.filter((k) => k !== "ticket"),
                  )
                }
              />
              Must match ticket
            </label>
          )}
        </div>
        <div className="filter-divider" />
        <label className="check-label">
          <input
            type="checkbox"
            checked={filters.includeUnknown}
            onChange={(e) => setFilter("includeUnknown", e.target.checked)}
          />
          Include unknown values
        </label>
        <p className="small muted inset">
          Keep potential matches with missing information.
        </p>
        <label className="check-label">
          <input
            type="checkbox"
            checked={filters.recentOnly}
            onChange={(e) => setFilter("recentOnly", e.target.checked)}
          />
          Recent investment evidence
        </label>
        <p className="small muted inset">
          An announcement within 36 months of this dataset.
        </p>
        <div className="filter-help">
          <Info size={16} />
          <p>Missing information is never treated as a confirmed match.</p>
        </div>
      </>
    );
  }
  const comparisonRows: {
    label: string;
    render: (i: Investor) => ReactNode;
    value: (i: Investor) => string;
  }[] = [
    {
      label: "Fit with your search",
      render: (i) => <FitSummary investor={i} filters={filters} />,
      value: (i) => JSON.stringify(matches(i, filters).map((c) => c.state)),
    },
    ...(["sectors", "stages", "geography", "focus"] as const).map((key) => ({
      label: LABELS[key],
      render: (i: Investor) => <ClaimValue claim={i[key]} format={listText} />,
      value: (i: Investor) => claimText(i[key], listText),
    })),
    {
      label: "Typical ticket",
      render: (i) => <ClaimValue claim={i.ticket} format={ticketText} />,
      value: (i) => claimText(i.ticket, ticketText),
    },
    {
      label: "Documented investment",
      render: (i) => (
        <ClaimValue
          claim={i.investment}
          format={(v) => `${v.company} · announced ${dateLabel(v.announcedAt)}`}
        />
      ),
      value: (i) =>
        claimText(i.investment, (v) => `${v.company} ${v.announcedAt}`),
    },
    {
      label: "Evidence status",
      render: (i) => (
        <>
          {i.evidenceStatus === "sufficient"
            ? "Initial evidence gate met"
            : "Evidence incomplete"}
          <small>Independent human audit pending</small>
        </>
      ),
      value: (i) => i.evidenceStatus,
    },
    {
      label: "Funds and capital",
      render: (i) => (
        <details>
          <summary>View capital</summary>
          <ClaimValue claim={i.capital} format={capitalText} />
        </details>
      ),
      value: (i) => claimText(i.capital, capitalText),
    },
  ];
  const current = detail ? byId(detail) : null;
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="app-header">
        <button
          className="brand"
          onClick={() => navigate("investors")}
          aria-label="Investor Atlas home"
        >
          <span className="brand-mark">
            <Layers3 size={21} />
          </span>
          <span>
            investor<span className="brand-light">atlas</span>
          </span>
        </button>
        <nav aria-label="Main navigation">
          <button
            className={view === "investors" ? "active" : ""}
            aria-current={view === "investors" ? "page" : undefined}
            onClick={() => navigate("investors")}
          >
            <Search size={16} />
            <span>Investors</span>
          </button>
          <button
            className={view === "draft" || view === "compare" ? "active" : ""}
            aria-current={
              view === "draft" || view === "compare" ? "page" : undefined
            }
            onClick={() => navigate("draft")}
          >
            <Bookmark size={16} />
            <span>Final draft</span>
            <span className="nav-count">{draft.length}</span>
          </button>
          <button
            className={view === "methodology" ? "active" : ""}
            onClick={() => navigate("methodology")}
          >
            <FileText size={16} />
            <span>Methodology</span>
          </button>
        </nav>
        <span className="pilot-pill">
          <span />
          Czech pilot
        </span>
      </header>
      <div className="preview-bar">
        <Info size={14} />
        <span>Research preview · Public sources, human audit pending.</span>
        <button onClick={() => navigate("methodology")}>
          About the data <ArrowUpRight size={13} />
        </button>
      </div>
      {storageError && (
        <div className="storage-warning" role="alert">
          Browser storage is unavailable. Your draft works for this session;
          export it before leaving.
        </div>
      )}
      <main id="main" className={`main-content view-${view}`}>
        {view === "investors" && (
          <>
            <div className="page-intro">
              <div>
                <div className="eyebrow">THE CZECH VENTURE LANDSCAPE</div>
                <h1 ref={mainTitle} tabIndex={-1}>
                  Find your next investor.
                </h1>
                <p>
                  Explore the fit. Check the evidence. Make your own shortlist.
                </p>
              </div>
              <div className="release-caption">
                <Globe2 size={16} />
                <span>
                  Public-source research
                  <br />
                  <strong>{dateLabel(dataset.asOf)}</strong>
                </span>
              </div>
            </div>
            <div className="workspace">
              <aside
                className={`filters ${mobileFilters ? "mobile-open" : ""}`}
                aria-label="Investor filters"
              >
                <button
                  className="mobile-close icon-button"
                  onClick={() => setMobileFilters(false)}
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
                {FilterContent()}
                <button
                  className="button primary mobile-apply"
                  onClick={() => setMobileFilters(false)}
                >
                  Show {ranked.length} investors
                </button>
              </aside>
              <section className="results" aria-label="Investor results">
                <div className="searchbar">
                  <Search size={18} />
                  <input
                    aria-label="Search investors"
                    value={filters.query}
                    onChange={(e) => setFilter("query", e.target.value)}
                    placeholder="Search investors by name…"
                  />
                  {filters.query && (
                    <button
                      className="icon-button"
                      aria-label="Clear search"
                      onClick={() => setFilter("query", "")}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="results-toolbar">
                  <h2 aria-live="polite">
                    {ranked.length} <span>research profiles</span>
                  </h2>
                  <button
                    className="button secondary mobile-filter-button"
                    onClick={() => setMobileFilters(true)}
                  >
                    <Filter size={15} />
                    Filters
                  </button>
                  <label className="sort-control">
                    Sort by{" "}
                    <select
                      aria-label="Sort investors"
                      value={filters.sort}
                      onChange={(e) =>
                        setFilter("sort", e.target.value as Filters["sort"])
                      }
                    >
                      <option value="fit">Suitability (provisional)</option>
                      <option value="name">Name A–Z</option>
                      <option value="recent">Recent evidence</option>
                    </select>
                  </label>
                </div>
                {(activeKeys.length > 0 || filters.amount) && (
                  <div className="filter-chips">
                    {activeKeys.map((k) => (
                      <button key={k} onClick={() => setFilter(k, "")}>
                        {filters[k]} <X size={12} />
                        <span className="sr-only">
                          Remove {LABELS[k]} filter
                        </span>
                      </button>
                    ))}
                    {filters.amount && (
                      <button onClick={() => setFilter("amount", "")}>
                        {filters.currency}{" "}
                        {Number(filters.amount).toLocaleString()}
                        <X size={12} />
                        <span className="sr-only">Remove amount filter</span>
                      </button>
                    )}
                  </div>
                )}
                <div className="ranking-note">
                  <SlidersHorizontal size={13} />
                  Ranking rules are provisional. Your Final draft is always your
                  choice.
                </div>
                <div className="investor-list">
                  {ranked.map((r, index) => (
                    <article
                      className="investor-row"
                      key={r.investor.id}
                      data-testid={`investor-${r.investor.id}`}
                    >
                      <span className="rank">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Avatar investor={r.investor} />
                      <div className="investor-main">
                        <div className="investor-title">
                          <button onClick={() => setDetail(r.investor.id)}>
                            {r.investor.name}
                          </button>
                          {r.potential && (
                            <span className="badge amber">
                              Essential info missing
                            </span>
                          )}
                        </div>
                        <p className="investor-description">
                          {r.investor.description}
                        </p>
                        <div className="row-facts">
                          <span>
                            <Layers3 size={13} />
                            {claimText(r.investor.stages, listText)}
                          </span>
                          <span>
                            <MapPin size={13} />
                            {claimText(r.investor.geography, listText)}
                          </span>
                        </div>
                        <FitSummary investor={r.investor} filters={filters} />
                        <button
                          className="details-link"
                          onClick={() => setDetail(r.investor.id)}
                        >
                          View profile & evidence <ArrowRight size={13} />
                        </button>
                      </div>
                      <div className="investor-action">
                        <span className="eyebrow">TYPICAL TICKET</span>
                        <strong
                          className={r.investor.ticket.value ? "" : "missing"}
                        >
                          {claimText(r.investor.ticket, ticketText)}
                        </strong>
                        <AddButton id={r.investor.id} compact />
                        <span className="audit-label">
                          {r.investor.evidenceStatus === "sufficient"
                            ? "Source-backed · audit pending"
                            : "Evidence incomplete"}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
                {!ranked.length && (
                  <div className="empty-state">
                    <Search size={30} />
                    <h3>No investors match these filters</h3>
                    <p>Try a broader criterion or include unknown values.</p>
                    <button className="button secondary" onClick={reset}>
                      Clear filters
                    </button>
                  </div>
                )}
                <div className="list-footer">
                  <span>
                    {ranked.length} of {dataset.investors.length} researched
                    profiles · {candidates.length} candidates logged
                  </span>
                  <button
                    className="text-button"
                    onClick={() => navigate("methodology")}
                  >
                    How this dataset was built <ArrowUpRight size={13} />
                  </button>
                </div>
              </section>
            </div>
          </>
        )}
        {view === "draft" && (
          <>
            <div className="page-intro">
              <div>
                <div className="eyebrow">YOUR INVESTOR SHORTLIST</div>
                <h1 ref={mainTitle} tabIndex={-1}>
                  Final draft<span className="title-count">{draft.length}</span>
                </h1>
                <p>
                  Your choices, in your order. Add context before the next
                  conversation.
                </p>
              </div>
              <div className="export-actions">
                <button
                  disabled={!draft.length || exporting}
                  className="button secondary"
                  onClick={() => download("csv")}
                >
                  <Download size={16} />
                  CSV
                </button>
                <button
                  disabled={!draft.length || exporting}
                  className="button primary"
                  onClick={() => download("xlsx")}
                >
                  <Download size={16} />
                  {exporting ? "Exporting…" : "Export Excel"}
                </button>
              </div>
            </div>
            <div className="draft-toolbar">
              <button
                className="text-button"
                onClick={() => navigate("investors")}
              >
                <ArrowLeft size={15} />
                Back to results
              </button>
              <span className="small muted">
                {storageError ? "Session only" : "Saved in this browser"}
              </span>
              <button
                className="button secondary"
                disabled={selectedInvestors.length < 2}
                onClick={() => navigate("compare")}
              >
                <GitCompareArrows size={16} />
                Compare selected ({selectedInvestors.length}/3)
              </button>
            </div>
            {draft.length ? (
              <div className="draft-table-wrap">
                <table className="draft-table">
                  <thead>
                    <tr>
                      <th scope="col">
                        <span className="sr-only">Select for comparison</span>
                      </th>
                      <th scope="col">ORDER</th>
                      <th scope="col">INVESTOR</th>
                      <th scope="col">TYPICAL TICKET</th>
                      <th scope="col">YOUR NOTE</th>
                      <th scope="col">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.map((d, index) => {
                      const i = byId(d.id);
                      return (
                        <tr
                          key={d.id}
                          className={
                            selected.includes(d.id) ? "selected-row" : ""
                          }
                        >
                          <td data-label="Compare">
                            <input
                              aria-label={`Compare ${i.name}`}
                              type="checkbox"
                              checked={selected.includes(d.id)}
                              disabled={
                                selected.length >= 3 && !selected.includes(d.id)
                              }
                              onChange={() => select(d.id)}
                            />
                          </td>
                          <td data-label="Order">
                            <div className="order-controls">
                              <span>{index + 1}</span>
                              <div>
                                <button
                                  className="icon-button"
                                  aria-label={`Move ${i.name} up`}
                                  disabled={index === 0}
                                  onClick={() =>
                                    setSaved((s) => ({
                                      ...s,
                                      draft: moveDraft(s.draft, index, -1),
                                    }))
                                  }
                                >
                                  <ArrowUp size={14} />
                                </button>
                                <button
                                  className="icon-button"
                                  aria-label={`Move ${i.name} down`}
                                  disabled={index === draft.length - 1}
                                  onClick={() =>
                                    setSaved((s) => ({
                                      ...s,
                                      draft: moveDraft(s.draft, index, 1),
                                    }))
                                  }
                                >
                                  <ArrowDown size={14} />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="draft-identity">
                              <Avatar investor={i} />
                              <div>
                                <button
                                  className="name-button"
                                  onClick={() => setDetail(i.id)}
                                >
                                  {i.name}
                                </button>
                                <small>{claimText(i.sectors, listText)}</small>
                              </div>
                            </div>
                          </td>
                          <td data-label="Typical ticket">
                            {claimText(i.ticket, ticketText)}
                          </td>
                          <td data-label="Your note">
                            <textarea
                              rows={2}
                              maxLength={2000}
                              aria-label={`Note for ${i.name}`}
                              placeholder="Why this investor?"
                              value={d.note}
                              onChange={(e) =>
                                setSaved((s) => ({
                                  ...s,
                                  draft: s.draft.map((x) =>
                                    x.id === d.id
                                      ? { ...x, note: e.target.value }
                                      : x,
                                  ),
                                }))
                              }
                            />
                          </td>
                          <td>
                            <button
                              className="icon-button remove"
                              aria-label={`Remove ${i.name} from Final draft`}
                              onClick={() => remove(i.id)}
                            >
                              <Trash2 size={17} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state draft-empty">
                <Bookmark size={34} />
                <h2>Your shortlist starts here.</h2>
                <p>Add investors from the results to build your Final draft.</p>
                <button
                  className="button primary"
                  onClick={() => navigate("investors")}
                >
                  Explore investors <ArrowRight size={16} />
                </button>
              </div>
            )}
            <p className="draft-footnote">
              <Info size={14} />
              Exports include your notes, order, evidence links, and the
              research status of each profile.
            </p>
          </>
        )}
        {view === "compare" && (
          <>
            <button
              className="text-button back-link"
              onClick={() => navigate("draft")}
            >
              <ArrowLeft size={15} />
              Back to Final draft
            </button>
            <div className="page-intro">
              <div>
                <div className="eyebrow">A CLOSER LOOK</div>
                <h1 ref={mainTitle} tabIndex={-1}>
                  Compare your choices.
                </h1>
                <p>See the differences. Keep what matters to you.</p>
              </div>
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={onlyDifferences}
                  onChange={(e) => setOnlyDifferences(e.target.checked)}
                />
                Show differences only
              </label>
            </div>
            {selectedInvestors.length >= 2 ? (
              <div className="comparison-scroll">
                <table className="comparison">
                  <thead>
                    <tr>
                      <th scope="col">INVESTMENT PROFILE</th>
                      {selectedInvestors.map((i) => (
                        <th key={i.id} scope="col">
                          <Avatar investor={i} />
                          <h2>{i.name}</h2>
                          <span className="small muted">
                            Final draft position{" "}
                            {draft.findIndex((d) => d.id === i.id) + 1}
                          </span>
                          <button
                            className="details-link"
                            onClick={() => setDetail(i.id)}
                          >
                            View details <ArrowUpRight size={13} />
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows
                      .filter(
                        (row) =>
                          !onlyDifferences ||
                          new Set(selectedInvestors.map(row.value)).size > 1,
                      )
                      .map((row) => (
                        <tr key={row.label}>
                          <th scope="row">{row.label}</th>
                          {selectedInvestors.map((i) => (
                            <td key={i.id}>{row.render(i)}</td>
                          ))}
                        </tr>
                      ))}
                    <tr>
                      <th scope="row">Your note</th>
                      {selectedInvestors.map((i) => (
                        <td key={i.id}>
                          <textarea
                            aria-label={`Comparison note for ${i.name}`}
                            maxLength={2000}
                            rows={3}
                            placeholder="Add context…"
                            value={draft.find((d) => d.id === i.id)?.note ?? ""}
                            onChange={(e) =>
                              setSaved((s) => ({
                                ...s,
                                draft: s.draft.map((d) =>
                                  d.id === i.id
                                    ? { ...d, note: e.target.value }
                                    : d,
                                ),
                              }))
                            }
                          />
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row">Refine your draft</th>
                      {selectedInvestors.map((i) => (
                        <td key={i.id}>
                          <button
                            className="text-button danger"
                            onClick={() => remove(i.id)}
                          >
                            <Trash2 size={14} />
                            Remove from draft
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <GitCompareArrows size={28} />
                <h2>Select at least two investors</h2>
                <p>
                  Choose two or three investors in Final draft to compare them.
                </p>
                <button
                  className="button primary"
                  onClick={() => navigate("draft")}
                >
                  Return to Final draft
                </button>
              </div>
            )}
          </>
        )}
        {view === "methodology" && (
          <>
            <div className="page-intro">
              <div>
                <div className="eyebrow">TRANSPARENCY BY DESIGN</div>
                <h1 ref={mainTitle} tabIndex={-1}>
                  Behind every profile.
                </h1>
                <p>
                  What is known, what is missing, and what still needs a person.
                </p>
              </div>
              <span className="badge amber">Independent audit pending</span>
            </div>
            <div className="method-layout">
              <section>
                <h2>The Czech pilot</h2>
                <p>
                  VC investment organizations managed from Czechia, counted once
                  per organization. Funds are recorded underneath their manager.
                  Czech investments, founder nationality, or a registered
                  address alone do not establish a Czech management base.
                </p>
                <h3>Four inclusion conditions</h3>
                <ol>
                  <li>A clear organizational identity.</li>
                  <li>
                    Evidence of the main investment management office in
                    Czechia.
                  </li>
                  <li>
                    A VC strategy investing in startups, including convertible
                    investments.
                  </li>
                  <li>
                    A named investment supported by a dated public source.
                  </li>
                </ol>
                <p>
                  Unresolved candidates remain in research preview. They are
                  never exported as human-verified investors. Discovery-only
                  entries are available in the candidate file, not presented as
                  researched investor profiles.
                </p>
                <h3>Current release: {dataset.version}</h3>
                <table className="quality-table">
                  <tbody>
                    <tr>
                      <th>Candidates logged</th>
                      <td>{candidates.length}</td>
                    </tr>
                    <tr>
                      <th>Researched profiles</th>
                      <td>{dataset.investors.length}</td>
                    </tr>
                    <tr>
                      <th>Initial evidence gate met</th>
                      <td>
                        {
                          dataset.investors.filter(
                            (i) =>
                              i.evidenceStatus === "sufficient" &&
                              i.scopeStatus === "eligible",
                          ).length
                        }
                      </td>
                    </tr>
                    <tr>
                      <th>Human-audited records</th>
                      <td>0</td>
                    </tr>
                    <tr>
                      <th>Precision / recall</th>
                      <td>Not measured</td>
                    </tr>
                    <tr>
                      <th>Typical ticket available</th>
                      <td>
                        {
                          dataset.investors.filter(
                            (i) => i.ticket.status === "supported",
                          ).length
                        }{" "}
                        / {dataset.investors.length} profiles
                      </td>
                    </tr>
                    <tr>
                      <th>Dated investment evidence</th>
                      <td>
                        {
                          dataset.investors.filter(
                            (i) => i.investment.value?.announcedAt,
                          ).length
                        }{" "}
                        / {dataset.investors.length} profiles
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h3>How suitability works for now</h3>
                <p>
                  The ranking is a provisional implementation of the chat
                  proposal, not a validated recommendation. Sector, stage and
                  geography each carry 25 points; ticket 15; focus 10.
                  Unselected criteria are omitted. Unknown data earns no match
                  points. A must-match mismatch is excluded; essential unknowns
                  appear after other results when enabled. No currency
                  conversion is assumed. Founder-origin restrictions require
                  confirmation.
                </p>
                <p>
                  Policy: {RANKING_POLICY.version}. A score is fit with entered
                  criteria, not the chance of receiving funding. With no
                  criteria, results use captured investment dates then names.
                </p>
                <h3>Reading missing information</h3>
                <dl className="missing-definitions">
                  <dt>Not found</dt>
                  <dd>The inspected sources did not establish it.</dd>
                  <dt>Not disclosed</dt>
                  <dd>A source explicitly says it is undisclosed.</dd>
                  <dt>Not checked</dt>
                  <dd>The field has not been researched.</dd>
                  <dt>Conflicting sources</dt>
                  <dd>Incompatible claims remain unresolved.</dd>
                </dl>
                <h3>Financial and date boundaries</h3>
                <p>
                  Typical tickets, fund sizes, fundraising targets, AUM,
                  portfolio value and funding rounds are different metrics. A
                  whole round is never assigned to an individual investor.
                  Announcement dates are separate from transaction dates.
                  “Recent” means evidence captured within 36 months of{" "}
                  {dateLabel(dataset.asOf)}, not proof of available capital.
                </p>
                <h3>Remaining human work</h3>
                <ol>
                  <li>
                    Independently audit candidate identity, Czech management, VC
                    eligibility and investment proof.
                  </li>
                  <li>
                    Review field values against the linked original sources;
                    resolve conflicts and missing evidence.
                  </li>
                  <li>
                    Freeze a representative evaluation sample and complete the
                    blind audit template before viewing system decisions.
                  </li>
                  <li>
                    Calculate quality from real human judgments; do not use
                    software tests as a data accuracy measurement.
                  </li>
                  <li>
                    Approve the final suitability policy and complete a sourced
                    global coverage and cost estimate.
                  </li>
                </ol>
                <p>
                  The 36 candidates are a purposive development set plus a
                  directory discovery frame. They are not a random sample and do
                  not establish market coverage or global accuracy.
                </p>
              </section>
              <aside className="download-panel">
                <FileText size={23} />
                <h2>Research package</h2>
                <p>
                  Public evidence and an honest starting point for the
                  independent audit.
                </p>
                <a
                  className="download-link"
                  href={`${baseUrl}data/investors.json`}
                  download
                >
                  Research profiles · JSON <Download size={15} />
                </a>
                <a
                  className="download-link"
                  href={`${baseUrl}data/research-preview.xlsx`}
                  download
                >
                  Research preview · Excel <Download size={15} />
                </a>
                <a
                  className="download-link"
                  href={`${baseUrl}data/all_candidates.csv`}
                  download
                >
                  All candidates · CSV <Download size={15} />
                </a>
                <a
                  className="download-link"
                  href={`${baseUrl}data/manual_review_template.csv`}
                  download
                >
                  Blind audit template · CSV <Download size={15} />
                </a>
                <a
                  className="download-link"
                  href={`${baseUrl}data/evidence_sources.csv`}
                  download
                >
                  Source register · CSV <Download size={15} />
                </a>
                <div className="filter-divider" />
                <p className="small">
                  These downloads contain research data, not a completed
                  human-verified release.
                </p>
                <a
                  className="text-link"
                  href="https://github.com/IMorkovkaI/clientelo-database"
                  target="_blank"
                  rel="noreferrer"
                >
                  Project & documentation <ArrowUpRight size={14} />
                </a>
              </aside>
            </div>
          </>
        )}
      </main>
      <footer className="site-footer">
        <span>
          Investor Atlas <span className="footer-dot">·</span> Czech pilot
        </span>
        <span>Evidence before assumptions.</span>
        <button className="text-button" onClick={() => navigate("methodology")}>
          Data & methodology <ArrowUpRight size={12} />
        </button>
      </footer>
      <dialog
        ref={dialog}
        className="detail-dialog"
        aria-labelledby="detail-title"
        onCancel={() => setDetail(null)}
        onClose={() => setDetail(null)}
        onClick={(e) => {
          if (e.target === dialog.current) setDetail(null);
        }}
      >
        {current && (
          <div className="detail-inner">
            <div className="detail-header">
              <div className="detail-heading">
                <Avatar investor={current} large />
                <button
                  className="icon-button"
                  onClick={() => setDetail(null)}
                  aria-label="Close investor details"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="eyebrow">INVESTOR PROFILE</div>
              <h2 id="detail-title">{current.name}</h2>
              <p>{current.description}</p>
              <a
                href={current.website}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Official website <ArrowUpRight size={14} />
              </a>
              <div className="detail-actions">
                <AddButton id={current.id} />
                <span className="badge amber">Human audit pending</span>
              </div>
            </div>
            <div className="detail-body">
              {matches(current, filters).length > 0 && (
                <section>
                  <h3>Fit with your search</h3>
                  <FitSummary investor={current} filters={filters} />
                  <p className="small muted">
                    Provisional fit only. Inspect the scope and supporting
                    evidence below.
                  </p>
                </section>
              )}
              <section>
                <h3>Investment profile</h3>
                <dl className="profile-fields">
                  {(["sectors", "stages", "geography", "focus"] as const).map(
                    (k) => (
                      <div key={k}>
                        <dt>{LABELS[k]}</dt>
                        <dd>
                          <ClaimValue claim={current[k]} format={listText} />
                        </dd>
                      </div>
                    ),
                  )}
                  <div>
                    <dt>Typical ticket</dt>
                    <dd>
                      <ClaimValue claim={current.ticket} format={ticketText} />
                      {current.ticket.value && (
                        <small>{current.ticket.value.scope}</small>
                      )}
                    </dd>
                  </div>
                </dl>
              </section>
              <section>
                <h3>Documented investment</h3>
                {current.investment.value ? (
                  <>
                    <h4>{current.investment.value.company}</h4>
                    <p className="small">
                      Announced:{" "}
                      {dateLabel(current.investment.value.announcedAt)}
                      <br />
                      Transaction date:{" "}
                      {dateLabel(current.investment.value.transactionDate)}
                    </p>
                    <p>{current.investment.value.note}</p>
                    {current.investment.value.roundSize && (
                      <p className="small">
                        <strong>Whole funding round:</strong>{" "}
                        {money(
                          current.investment.value.roundSize,
                          current.investment.value.currency!,
                        )}
                        . Individual contribution:{" "}
                        {current.investment.value.investorAmount === null
                          ? "not found"
                          : current.investment.value.investorAmount}
                        .
                      </p>
                    )}
                    <Evidence ids={current.investment.sources} />
                  </>
                ) : (
                  <ClaimValue claim={current.investment} />
                )}
              </section>
              <section>
                <h3>Funds and capital</h3>
                <ClaimValue claim={current.capital} format={capitalText} />
              </section>
              <section>
                <h3>Organization & scope</h3>
                <dl className="profile-fields">
                  <div>
                    <dt>Management office</dt>
                    <dd>
                      <ClaimValue claim={current.office} />
                    </dd>
                  </div>
                  <div>
                    <dt>Legal domicile</dt>
                    <dd>
                      <ClaimValue claim={current.legalDomicile} />
                    </dd>
                  </div>
                </dl>
                <p className="small">
                  Scope: {current.scopeStatus}. Evidence:{" "}
                  {current.evidenceStatus}. Human review: {current.reviewStatus}
                  .
                </p>
              </section>
              <section>
                <h3>What still needs checking</h3>
                <ul>
                  {current.limitations.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
                <p className="small muted">
                  Sources checked by AI-assisted research on{" "}
                  {dateLabel(current.lastChecked)}. Not an independent human
                  review.
                </p>
                <Evidence ids={evidenceIds(current)} label="All sources" />
              </section>
            </div>
          </div>
        )}
      </dialog>
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          <span>{toast.text}</span>
          {toast.undo && (
            <button
              onClick={() => {
                toast.undo?.();
                setToast(null);
              }}
            >
              Undo
            </button>
          )}
          <button
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setToast(null)}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </>
  );
}
