// Curated public-source extraction, 2026-10-15. This is not a human audit.
// Keep excerpts short; summaries are paraphrases. Unknown does not mean zero.
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
const date = "2026-10-15";
const source = (
  id,
  url,
  publisher,
  title,
  excerpt,
  summary,
  publishedAt = null,
  kind = "primary",
) => ({
  id,
  url,
  publisher,
  title,
  excerpt,
  summary,
  publishedAt,
  retrievedAt: date,
  kind,
});
const sources = [
  source(
    "credo-strategy",
    "https://www.credoventures.com/",
    "Credo Ventures",
    "Investment approach and offices",
    "Leading Pre-Seed rounds.",
    "States $1M–$5M checks, a CEE-founder and diaspora mandate, and Prague and Kraków offices. Describes backing founders without a fixed thesis.",
  ),
  source(
    "credo-deal",
    "https://elevenlabs.io/blog/series-b",
    "ElevenLabs",
    "Series B funding announcement",
    "joined by Sequoia Capital, SV Angel, Smash Capital, BroadLight Capital and Credo Ventures",
    "Names Credo as a participant in the $80M round. Does not disclose Credo’s individual contribution.",
    "2024-01-22",
  ),
  source(
    "purple-strategy",
    "https://www.purple-ventures.com/",
    "Purple Ventures",
    "Investment strategy and portfolio",
    "€250k to €400k",
    "States initial tickets of €250k–€400k and pre-seed/seed focus on CEE+ technology businesses with initial revenue. Lists Flowlance as a 2024 investment. Exact announcement date and main management location need further evidence.",
  ),
  source(
    "presto-strategy",
    "https://www.prestoventures.com/",
    "Presto Ventures",
    "Investment approach, portfolio and contact",
    "Tickets ranging from €500k to €5M.",
    "States seed to Series A, security/defense/aerospace, software and hardware, NATO and allied markets, and a Prague office. Lists Behavio as a portfolio company. A separately dated transaction source is still needed.",
  ),
  source(
    "look-strategy",
    "https://lookai.vc/",
    "Look AI Ventures",
    "Investment criteria and contact",
    "pre-Series A venture capital fund based in Prague",
    "States a global AI strategy with European emphasis, pre-Series A companies and an operational team in Prague. Ticket range not found in the inspected source.",
  ),
  source(
    "look-deal",
    "https://lookai.vc/look-ai-ventures-sodex-innovations-4m-ai-construction-site-surveying/",
    "Look AI Ventures",
    "Sodex Innovations funding announcement",
    "Look AI Ventures has joined Sodex Innovations' €4M funding round",
    "Documents participation in a €4M company round. Individual contribution not disclosed. This is an announcement date, not a confirmed closing date.",
    "2026-07-23",
  ),
  source(
    "jt-strategy",
    "https://www.jtventures.cz/pristup",
    "J&T Ventures",
    "Investment criteria",
    "€300K – €3M",
    "States pre-seed to Series A, CEE/SEE/Baltics, equity and convertible instruments, a Prague office, and preferred technology sectors. €6M maximum company allocation is distinct from the initial ticket.",
  ),
  source(
    "jt-focus",
    "https://www.jtventures.cz/",
    "J&T Ventures",
    "Investment focus",
    "Sector Agnostic",
    "States sector agnostic, B2B, B2C and marketplace interests, with Prague office details.",
  ),
  source(
    "jt-deal",
    "https://www.jtventures.cz/blog",
    "J&T Ventures",
    "grid.online funding report",
    "investici 1,5 milionu eur od fondů Reflex Capital, J&T Ventures a Grid Invest",
    "Dated blog entry names grid.online and the three investors in a €1.5M round. The investor-specific amount is not given.",
    "2025-04-20",
  ),
  source(
    "tensor-office",
    "https://tensor.ventures/",
    "Tensor Ventures",
    "Team and contact",
    "Contact in CZ",
    "Lists Luxembourg fund entities and a Czech contact office. This establishes Czech presence, but main investment management location still requires confirmation.",
  ),
  source(
    "tensor-deal",
    "https://blog.tensor.ventures/p/tensor-wrapped-2024-the-annual-recap",
    "Tensor Ventures",
    "2024 annual recap",
    "Our first investment from Fund 2 was in",
    "Names Dynanic (Brnologic) as Fund 2’s first investment. Describes deep-tech investing and a €50M target for Fund 2, not a final close. Exact transaction date is unspecified.",
    "2024-12-23",
  ),
  source(
    "kaya-strategy",
    "https://www.kaya.vc/",
    "KAYA VC",
    "Fund strategy and offices",
    "$1–3M",
    "States pre-seed/seed tickets of $1M–$3M and CEE founders as its focus; lists four international offices. Shows $500M AUM and an $85M current fund without an explicit as-of date.",
  ),
  source(
    "kaya-office",
    "https://newsletter.kaya.vc/about/",
    "KAYA VC",
    "About KAYA VC",
    "based in Prague",
    "Describes KAYA as a Prague-based VC investing in early-stage companies across CEE.",
  ),
  source(
    "miton-strategy",
    "https://www.miton.cz/?entry_point=landing_page",
    "Miton",
    "Investment areas and portfolio",
    "AI, augmented workforce",
    "States AI, crypto/web3, e-commerce, gastrotech and mental-health investment areas. Lists Rossum in its portfolio and reports €450M portfolio value, which is not AUM. Stage, ticket and dated transaction evidence remain incomplete.",
  ),
  source(
    "cvca-discovery",
    "https://cvca.cz/en/membership/",
    "CVCA",
    "Membership directory",
    "Full members",
    "Discovery source only. Membership includes VC, PE and service providers. Neither membership nor a Czech address alone proves eligibility. Financial fields are not imported from this directory.",
    null,
    "institutional",
  ),
];
const known = (value, ...ids) => ({ value, status: "supported", sources: ids });
const missing = (
  note = "Not found in the inspected sources.",
  status = "not_found",
) => ({ value: null, status, sources: [], note });
const base = (id, name, initials, website, description) => ({
  id,
  name,
  initials,
  website,
  description,
  type: "VC candidate",
  office: missing(),
  legalDomicile: missing(
    "Not checked against a legal register.",
    "not_checked",
  ),
  sectors: missing(),
  stages: missing(),
  geography: missing(),
  focus: missing(),
  ticket: missing(),
  capital: missing(),
  investment: missing(
    "A dated investment announcement has not yet been established.",
  ),
  scopeStatus: "unresolved",
  evidenceStatus: "insufficient",
  reviewStatus: "pending",
  lastChecked: date,
  limitations: ["Independent human audit has not been performed."],
});
const deal = (company, announcedAt, roundSize, currency, note, sourceId) =>
  known(
    {
      company,
      announcedAt,
      transactionDate: null,
      roundSize,
      currency,
      investorAmount: null,
      note,
    },
    sourceId,
  );
const investors = [
  {
    ...base(
      "credo",
      "Credo Ventures",
      "CV",
      "https://www.credoventures.com/",
      "First checks for ambitious CEE founders and their global diaspora.",
    ),
    office: known("Prague; also an office in Kraków", "credo-strategy"),
    sectors: known(["Sector agnostic"], "credo-strategy"),
    stages: known(["Pre-seed"], "credo-strategy"),
    geography: known(["CEE founders worldwide"], "credo-strategy"),
    ticket: known(
      {
        min: 1000000,
        max: 5000000,
        currency: "USD",
        scope: "Stated check range",
      },
      "credo-strategy",
    ),
    investment: deal(
      "ElevenLabs",
      "2024-01-22",
      80000000,
      "USD",
      "Series B participation; whole round amount, not Credo’s contribution.",
      "credo-deal",
    ),
    limitations: [
      "Main management location needs explicit confirmation across its offices.",
      "Founder origin is a condition; company location alone cannot establish geographic fit.",
      "The cited deal is the latest captured here, not necessarily the latest actual investment.",
    ],
  },
  {
    ...base(
      "purple",
      "Purple Ventures",
      "PV",
      "https://www.purple-ventures.com/",
      "Early technology companies with initial revenue and global ambitions.",
    ),
    sectors: known(["Technology"], "purple-strategy"),
    stages: known(["Pre-seed", "Seed"], "purple-strategy"),
    geography: known(["CEE"], "purple-strategy"),
    ticket: known(
      {
        min: 250000,
        max: 400000,
        currency: "EUR",
        scope: "Initial ticket; follow-ons separate",
      },
      "purple-strategy",
    ),
    investment: deal(
      "Flowlance",
      null,
      null,
      null,
      "Official portfolio says invested in 2024; no exact dated announcement captured.",
      "purple-strategy",
    ),
    limitations: [
      "CEE+ is conservatively normalized to CEE; additional countries need confirmation.",
      "Main management office and a dated investment announcement remain unresolved.",
    ],
  },
  {
    ...base(
      "presto",
      "Presto Ventures",
      "PR",
      "https://www.prestoventures.com/",
      "Advanced technologies in security, defense, and aerospace.",
    ),
    office: known("Prague", "presto-strategy"),
    sectors: known(["Security", "Defense", "Aerospace"], "presto-strategy"),
    stages: known(["Seed", "Series A"], "presto-strategy"),
    geography: known(["NATO & allies"], "presto-strategy"),
    focus: known(["Software", "Hardware", "Dual-use"], "presto-strategy"),
    ticket: known(
      {
        min: 500000,
        max: 5000000,
        currency: "EUR",
        scope: "Stated ticket range",
      },
      "presto-strategy",
    ),
    investment: deal(
      "Behavio",
      null,
      null,
      null,
      "Named in the official portfolio; a dated transaction source remains to be captured.",
      "presto-strategy",
    ),
    limitations: [
      "The new fund headline is not used as confirmed closed capital.",
      "NATO & allies matching uses a documented small country mapping; other countries need review.",
    ],
  },
  {
    ...base(
      "look",
      "Look AI Ventures",
      "LA",
      "https://lookai.vc/",
      "AI-first companies with technical depth, before Series A.",
    ),
    office: known("Prague", "look-strategy"),
    sectors: known(["Artificial intelligence"], "look-strategy"),
    stages: known(["Pre-seed", "Seed"], "look-strategy"),
    geography: known(["Global"], "look-strategy"),
    investment: deal(
      "Sodex Innovations",
      "2026-07-23",
      4000000,
      "EUR",
      "Company funding round; individual investor contribution is not disclosed.",
      "look-deal",
    ),
    scopeStatus: "eligible",
    evidenceStatus: "sufficient",
    limitations: [
      "Pre-Series A is normalized to pre-seed and seed; financial contribution is unknown.",
      "Independent human audit has not been performed.",
    ],
  },
  {
    ...base(
      "jt",
      "J&T Ventures",
      "JT",
      "https://www.jtventures.cz/",
      "Early-stage companies across Central and Southeastern Europe.",
    ),
    office: known("Prague", "jt-strategy"),
    sectors: known(["Sector agnostic"], "jt-focus"),
    stages: known(["Pre-seed", "Seed", "Series A"], "jt-strategy"),
    geography: known(["CEE", "SEE", "Baltics"], "jt-strategy"),
    focus: known(["B2B", "B2C", "Marketplaces"], "jt-focus"),
    ticket: known(
      {
        min: 300000,
        max: 3000000,
        currency: "EUR",
        scope: "Stated investment size; company lifetime allocation differs",
      },
      "jt-strategy",
    ),
    investment: deal(
      "grid.online",
      "2025-04-20",
      1500000,
      "EUR",
      "Dated investor blog lists participation. Amount is for the whole round.",
      "jt-deal",
    ),
    scopeStatus: "eligible",
    evidenceStatus: "sufficient",
  },
  {
    ...base(
      "tensor",
      "Tensor Ventures",
      "TV",
      "https://tensor.ventures/",
      "Deep-tech investing across scientific and industrial technologies.",
    ),
    office: known(
      "Prague contact office; main management location unresolved",
      "tensor-office",
    ),
    legalDomicile: known("Luxembourg fund entities", "tensor-office"),
    sectors: known(["Deep tech"], "tensor-deal"),
    capital: known(
      [
        {
          amount: 50000000,
          currency: "EUR",
          metric: "Fund target",
          scope: "Fund 2",
          asOf: "2024-12-23",
        },
      ],
      "tensor-deal",
    ),
    investment: deal(
      "Dynanic (Brnologic)",
      "2024-12-23",
      null,
      null,
      "Annual recap documents the investment; publication date is not the deal date.",
      "tensor-deal",
    ),
    limitations: [
      "Czech presence alone does not prove the main management office.",
      "€50M is a fundraising target, not confirmed commitments.",
    ],
  },
  {
    ...base(
      "kaya",
      "KAYA VC",
      "KA",
      "https://www.kaya.vc/",
      "Early backing for ambitious founders from Central and Eastern Europe.",
    ),
    office: known(
      "Prague; international offices also listed",
      "kaya-office",
      "kaya-strategy",
    ),
    stages: known(["Pre-seed", "Seed"], "kaya-strategy"),
    geography: known(["CEE founders worldwide"], "kaya-strategy"),
    ticket: known(
      {
        min: 1000000,
        max: 3000000,
        currency: "USD",
        scope: "Stated ticket range",
      },
      "kaya-strategy",
    ),
    capital: known(
      [
        {
          amount: 500000000,
          currency: "USD",
          metric: "AUM",
          scope: "Manager-reported total",
          asOf: null,
        },
        {
          amount: 85000000,
          currency: "USD",
          metric: "Fund size",
          scope: "Current fund, as described on homepage",
          asOf: null,
        },
      ],
      "kaya-strategy",
    ),
    limitations: [
      "Capital figures have no explicit as-of date.",
      "A dated investment announcement remains to be captured.",
      "Founder origin is distinct from company geography.",
    ],
  },
  {
    ...base(
      "miton",
      "Miton",
      "MI",
      "https://www.miton.cz/",
      "An investment group focused on selected technology and consumer areas.",
    ),
    type: "Investment group candidate",
    sectors: known(
      [
        "Artificial intelligence",
        "Web3",
        "E-commerce",
        "Mental health",
        "Gastrotech",
      ],
      "miton-strategy",
    ),
    capital: known(
      [
        {
          amount: 450000000,
          currency: "EUR",
          metric: "Portfolio value",
          scope: "Current portfolio as described on homepage",
          asOf: null,
        },
      ],
      "miton-strategy",
    ),
    investment: deal(
      "Rossum",
      null,
      null,
      null,
      "Named in the official portfolio; dated investment proof not captured.",
      "miton-strategy",
    ),
    limitations: [
      "VC eligibility and main management location require review.",
      "Portfolio value is not capital available for new investments.",
    ],
  },
];
const dataset = {
  version: "2026-10-15-preview.1",
  asOf: date,
  publicationStatus: "research_preview",
  sources,
  investors,
};
mkdirSync("public/data", { recursive: true });
mkdirSync("data", { recursive: true });
writeFileSync("data/investors.json", JSON.stringify(dataset, null, 2) + "\n");
writeFileSync(
  "public/data/investors.json",
  JSON.stringify(dataset, null, 2) + "\n",
);
// A fixed discovery frame, not a random evaluation sample or complete market census.
const directoryNames = [
  "Abris Capital",
  "ARX Equity Partners",
  "CVI",
  "DEPO Ventures",
  "Enterprise Investors",
  "Espira Investments",
  "EVERITA Capital",
  "Genesis Capital Equity",
  "i&i Biotech Investments",
  "Innova Capital",
  "Integral Capital Group",
  "Inven Capital",
  "Jet Investment",
  "MAM Private Equity Fund",
  "Mid Europa Partners",
  "Nation1",
  "Orbit Capital",
  "Sandberg Capital",
  "SkyLimit Investments",
  "Stratum Partners",
  "Thein",
  "Tilia Impact Ventures",
  "V4C Investment Advisers",
  "Versute Investments",
  "Accolade",
  "AKAT Czech Capital Market Association",
  "Aon Central and Eastern Europe",
  "ASB Czech Republic",
];
const candidates = investors.map((i) => ({
  id: i.id,
  name: i.name,
  discoverySource: i.website,
  systemDecision:
    i.scopeStatus === "eligible" && i.evidenceStatus === "sufficient"
      ? "accepted"
      : "unresolved",
  reason:
    i.scopeStatus === "eligible"
      ? "Initial evidence gate met; independent audit pending."
      : i.limitations.join(" "),
  research: "profile",
  samplingGroup: "purposive_development",
}));
directoryNames.forEach((name, n) =>
  candidates.push({
    id: `directory-${n + 1}`,
    name,
    discoverySource: "https://cvca.cz/en/membership/",
    systemDecision: [
      "AKAT Czech Capital Market Association",
      "Aon Central and Eastern Europe",
      "ASB Czech Republic",
    ].includes(name)
      ? "out_of_scope"
      : "unresolved",
    reason: [
      "AKAT Czech Capital Market Association",
      "Aon Central and Eastern Europe",
      "ASB Czech Republic",
    ].includes(name)
      ? "Directory describes association or professional services; not a qualifying VC organization."
      : "Discovery only; verify current identity, Czech management, VC strategy and dated direct investment.",
    research: "discovery_only",
    samplingGroup: "directory_frame",
  }),
);
writeFileSync(
  "public/data/candidates.json",
  JSON.stringify(candidates, null, 2) + "\n",
);
writeFileSync(
  "data/candidates.json",
  JSON.stringify(candidates, null, 2) + "\n",
);
writeFileSync(
  "public/data/source-excerpts.json",
  JSON.stringify(
    sources.map((s) => ({
      ...s,
      excerptSha256: createHash("sha256").update(s.excerpt).digest("hex"),
      hashScope: "short excerpt only, not complete webpage",
    })),
    null,
    2,
  ) + "\n",
);
console.log(
  `Prepared ${investors.length} research profiles, ${candidates.length} candidates, ${sources.length} source records. Human audit pending.`,
);
