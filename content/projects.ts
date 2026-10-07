/* =========================================================
   Single source of truth for the Work carousel.
   Both the card and the detail dialog read from here, and the
   carousel dots are generated from the array length.
   ========================================================= */

type SkinClinical = {
  kind: "clinical";
  vitals: { dt: string; value: string; unit?: string }[];
  ecgPath: string;
};

type SkinGame = {
  kind: "game";
  xpMeta: string;
  xpAmount: string;
  xpPercent: number;
  board: { pos: string; name: string; pts: string; you?: boolean }[];
};

type SkinLab = {
  kind: "lab";
  leadPt: string;
  leadEn: string;
  notePt: string;
  noteEn: string;
};

type SkinTerm = {
  kind: "term";
  log: string;
};

type SkinMetrics = {
  kind: "metrics";
  // headline readings only (no live-data widget); reuses the vitals grid
  readings: { dt: string; value: string; unit?: string }[];
};

type SkinGallery = {
  kind: "gallery";
  // a framed "plate" with drawing-style dimension lines; the painter's own
  // colour lives only inside the artwork, the card chrome stays blueprint
  placeholder: string; // shown in the mat until real artwork is supplied
  caption: string;
};

export type Project = {
  id: string;
  tag: string;
  title: string;
  /** dialog title, if different from the card title */
  dialogTitle?: string;
  lead: string;
  skin: SkinClinical | SkinGame | SkinLab | SkinTerm | SkinGallery | SkinMetrics;
  skinClass:
    | "pcard--clinical"
    | "pcard--game"
    | "pcard--lab"
    | "pcard--term"
    | "pcard--gallery"
    | "pcard--data";
  /** shown as a label on the card and in the dialog, e.g. "In progress" */
  status?: string;
  accentTitle?: boolean; // colour the <h3> with the skin accent (NutriQuest)
  // system layers, top (what the user touches) → bottom (foundation);
  // rendered as an exploded isometric stack. Keep labels ≤ ~26 chars.
  layers: string[];
  links?: { label: string; href: string }[];
  detail: {
    body: string;
    role: string;
    outcome: string;
    stack: string;
  };
};

export const projects: Project[] = [
  {
    // Numbers checked against the Scout repo (README, reports/m3_sources.md,
    // docs/TEST_LOG.md, 2026-10-07): 8,190 distinct players; test MAE 0.357 vs
    // 0.410 no-change (−12.9%); 80% intervals at 82.2% coverage on 2023–24.
    // The agent (M4) and MCP server (M5) are planned, not started.
    id: "scout",
    tag: "01 · ML forecasting + LLM extraction",
    title: "Scout",
    dialogTitle: "Scout — player market-value forecasting",
    status: "In progress",
    lead: "Forecasts 12-month changes in Transfermarkt market value for ~8,200 players across 7 European leagues (2013–2024) — point-in-time, leakage-tested, with a sealed, logged test set.",
    skinClass: "pcard--data",
    layers: [
      "80% prediction intervals",
      "LightGBM · MLflow runs",
      "Point-in-time features",
      "Postgres · leakage tests",
    ],
    skin: {
      kind: "metrics",
      readings: [
        { dt: "Players", value: "~8,200" },
        { dt: "Interval coverage", value: "82", unit: "%" },
        { dt: "Error vs no-change", value: "−13", unit: "%" },
      ],
    },
    links: [{ label: "GitHub", href: "https://github.com/simonrl13/footballscout" }],
    detail: {
      body: "Forecasts how a player’s Transfermarkt market value — a crowd-sourced estimate, not a transfer fee — will change over the next 12 months, for ~8,200 players across 7 European leagues from 2013 to 2024. Every feature is built point-in-time and checked by automated leakage tests, and the 2023–24 test set is reachable only through one gated, logged path. LightGBM with split-conformal 80% prediction intervals reaches 82% empirical coverage and cuts error by ~13% against a no-change baseline on the held-out seasons. In progress: LLM extraction of injury and contract events from point-in-time Wikipedia revisions, with verbatim-quote verification. Next: a tool-using agent and an MCP server. A full case study is coming.",
      role: "Independent project — in progress",
      outcome:
        "82% coverage for 80% prediction intervals and ~13% lower error than a no-change baseline on held-out 2023–24 seasons; CI with tests, dependency audits, secret scanning and CodeQL, and a documented threat model",
      stack: "Python · pandas · LightGBM · scikit-learn · MLflow · FastAPI · PostgreSQL · Docker · pytest · Claude API",
    },
  },
  {
    id: "medhelp",
    tag: "02 · AI clinical decision support",
    title: "MedHelp",
    lead: "An NLP tool for Brazil’s public health record system (PEC): it normalizes clinical notes, adapts language per audience, and flags preventive exams from patient demographics and history.",
    skinClass: "pcard--clinical",
    layers: ["Exam-recommendation output", "NLP normalisation layer", "PEC clinical-note input"],
    skin: {
      kind: "clinical",
      vitals: [
        { dt: "Clinical terminology accuracy", value: "92", unit: "%" },
        { dt: "Model surface", value: "NLP" },
      ],
      ecgPath:
        "M0 20 H120 l6 -14 l6 28 l6 -20 l5 6 H180 l8 -22 l7 34 l6 -12 H320",
    },
    detail: {
      body: "A Python NLP tool built for Brazil’s public health record system (PEC). It reads free-text clinical notes, normalizes inconsistent terminology, rewrites explanations for the intended audience (clinician vs. patient), and recommends preventive exams from patient demographics and medical history. Grew directly out of my undergraduate thesis on generative AI in clinical decision support.",
      role: "Undergraduate thesis project",
      outcome:
        "92% accuracy on clinical terminology normalization",
      stack: "Python · pandas · scikit-learn · NumPy · NLP · healthcare data (PEC)",
    },
  },
  {
    id: "rogerio",
    tag: "03 · artist website & shop",
    title: "Rogério Freire",
    dialogTitle: "Rogério Freire — artist website",
    lead: "Website for Rogério Freire, a pop-art painter: a gallery of his original paintings, a catalog of products made from his work, and purchase by WhatsApp or email.",
    skinClass: "pcard--gallery",
    layers: [
      "Originals gallery",
      "Derived-products catalog",
      "WhatsApp / email purchase",
      "Next.js+Tailwind on Vercel",
    ],
    skin: {
      kind: "gallery",
      // TODO(simon): swap for real artwork when the images arrive.
      placeholder: "PLACEHOLDER — artwork pending",
      caption: "PLATE 01 — original painting · details to follow",
    },
    // TODO(simon): add the live site URL.
    links: [],
    detail: {
      body: "A website for Rogério Freire, a pop-art painter. It presents his original paintings in a gallery alongside a catalog of products derived from his work — mugs, pillows, notebooks and t-shirts — with enquiries and purchases handled directly over WhatsApp and email.",
      role: "Client project for an independent artist",
      outcome:
        "One place to show the originals and sell the derived products, with purchase kept to a direct conversation over WhatsApp or email",
      stack: "Next.js · Tailwind CSS · Vercel · WhatsApp / email purchase flow",
    },
  },
  {
    id: "nutriquest",
    tag: "04 · gamified nutrition tracker",
    title: "NutriQuest",
    accentTitle: true,
    lead: "A cross-platform mobile app that turns nutrition tracking into a game — daily quests, streaks, and a competitive leaderboard, fully localized for Brazilian users.",
    skinClass: "pcard--game",
    layers: ["Mobile UI · quests, streaks, XP", "Offline-first local store", "Background sync engine"],
    skin: {
      kind: "game",
      xpMeta: "Level 7 · Nutritionist-in-training",
      xpAmount: "1,840 / 2,400 XP",
      xpPercent: 76,
      board: [
        { pos: "1", name: "ana.map", pts: "3,120" },
        { pos: "2", name: "you", pts: "1,840", you: true },
        { pos: "3", name: "tiago.rn", pts: "1,610" },
      ],
    },
    detail: {
      body: "A cross-platform mobile app that reframes nutrition tracking as a game. Real-time nutritional dashboards, daily and weekly quests, streaks, a competitive leaderboard, food search with macro calculation, photo upload, and full profile management — all localized in Brazilian Portuguese. Built offline-first with custom state management so it stays usable without a connection.",
      // personal project — not freelance/client work; keep it that way
      role: "Personal project — architecture, UI, localization",
      outcome:
        "Shipped cross-platform from a single codebase with offline-first sync",
      stack: "React Native · Expo · i18n · custom state management",
    },
  },
  {
    id: "labnov",
    tag: "05 · bilingual research platform",
    title: "LABNOV",
    dialogTitle: "LABNOV Research Lab",
    lead: "Bilingual site for UFCG’s LABNOV research lab, with automatic publication sync from Brazil’s Plataforma Lattes and content editing through Sanity CMS for non-technical staff.",
    skinClass: "pcard--lab",
    layers: ["Bilingual Next.js site", "Sanity CMS content model", "Automated Lattes sync"],
    skin: {
      kind: "lab",
      leadPt:
        "Site bilíngue para o laboratório de pesquisa LABNOV, com sincronização automática de publicações a partir da Plataforma Lattes e edição de conteúdo via Sanity CMS para a equipe não-técnica.",
      leadEn:
        "Bilingual site for the LABNOV research lab, with automatic publication sync from Brazil’s Plataforma Lattes and content editing through Sanity CMS for non-technical staff.",
      notePt: "O toggle acima é o mesmo componente do site real.",
      noteEn: "The toggle above is the same component that ships on the real site.",
    },
    // TODO(simon): add the live LABNOV URL.
    links: [],
    detail: {
      body: "A fully bilingual (PT / EN) website for UFCG’s LABNOV research laboratory. Publications sync automatically from Brazil’s Plataforma Lattes through a custom integration — including a manual-assisted workaround for reCAPTCHA protection — while non-technical staff edit everything else through Sanity CMS. Sections for projects, people, and publications, tuned for academic SEO.",
      role: "Full-stack developer — integration, CMS modelling, i18n",
      outcome:
        "Near-zero-maintenance publication list; staff update content without developer involvement",
      stack: "Next.js · Sanity CMS · Lattes integration · bilingual routing",
    },
  },
  {
    id: "financial",
    tag: "06 · enterprise backend, Accenture",
    title: "Enterprise Billing Optimization",
    dialogTitle: "Enterprise Billing Optimization — Accenture",
    lead: "Backend performance and reporting-automation work on an enterprise billing platform — profiling and tuning batch processes and replacing manual reporting steps with scripted pipelines.",
    skinClass: "pcard--term",
    layers: ["BI Publisher reporting", "Batch rating & billing (C)", "Oracle BRM platform"],
    skin: {
      kind: "term",
      log: "$ ./run_billing_cycle\n[ok]   batch loaded\n[ok]   rating pipeline tuned\n[ok]   report job automated\n[ ]    client + figures under NDA\n",
    },
    detail: {
      body: "Backend performance and reporting-automation work on an enterprise billing platform. Profiled and tuned batch rating and billing processes on Oracle BRM with C, and replaced manual reporting steps with shell-scripted pipelines feeding Oracle BI Publisher, delivered inside an Agile team. The client, transaction volumes, and performance figures are covered by an NDA.",
      role: "Custom Software Engineer — backend optimization & reporting automation",
      outcome:
        "Measurable reduction in batch processing time (specifics under NDA)",
      stack: "Oracle BRM · C · Shell · Oracle BI Publisher · Agile / JIRA",
    },
  },
];
