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
  caption: string;
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
  /** `note` is shown under the link row in the dialog */
  links?: { label: string; href: string; note?: string }[];
  /** YouTube video in the dialog, behind a click-to-load poster
      (public/assets/video/): nothing loads from YouTube before the click */
  video?: { id: string; poster: string; seconds: number };
  detail: {
    body: string;
    role: string;
    outcome: string;
    stack: string;
  };
};

export const projects: Project[] = [
  {
    // Numbers verbatim from the Scout repo (README, reports/evals_heldout.md,
    // docs/TEST_LOG.md; checked 2026-10-14): 8,190 players; test MAE 0.357 vs
    // 0.410 no-change and 0.359 linear (does NOT beat linear); 80% intervals at
    // 82.2% coverage on 2023–24. Agent (M4) and MCP server (M5a) are built:
    // 19/20 held-out, 2/2 injection resisted. Two pre-registered feature passes
    // were negative. M3 (public-text features) still open. Live demo on Cloud Run
    // (europe-west1, Neon Postgres) until 2027-01-01; before then the links,
    // status, chat facts, Scout probe and CV switch to the video (CLAUDE.md).
    // The retrieval result (4/36 → 24/36) waits for footballscout#41.
    id: "scout",
    tag: "01 · ML forecasting + Claude agent",
    title: "Scout",
    dialogTitle: "Scout — player market-value forecasting",
    status: "Live demo, until 1 January 2027",
    lead: "Forecasts 12-month changes in Transfermarkt market value for 8,190 players across 7 European leagues (2013–2024), with a Claude agent and an MCP server on top — point-in-time, leakage-tested, with a sealed, logged test set.",
    skinClass: "pcard--data",
    layers: [
      "Claude agent · MCP server",
      "80% prediction intervals",
      "LightGBM · MLflow runs",
      "Point-in-time features",
      "Postgres · leakage tests",
    ],
    skin: {
      kind: "metrics",
      readings: [
        { dt: "Players", value: "8,190" },
        { dt: "Interval coverage", value: "82.2", unit: "%" },
        { dt: "Agent, held-out evals", value: "19/20" },
      ],
    },
    links: [
      {
        label: "Try the live demo",
        href: "https://scout-246528398633.europe-west1.run.app",
        note: "The first question after a quiet period takes about 20 s while the demo wakes up. Live until 1 January 2027.",
      },
      { label: "Source on GitHub", href: "https://github.com/simonrl13/footballscout" },
    ],
    video: { id: "nnWtgHnnf54", poster: "/assets/video/scout.webp", seconds: 25 },
    detail: {
      body: "Scout forecasts how footballers’ Transfermarkt market values will change over 12 months, with a Claude agent that answers questions about the forecasts. Every number in an agent answer must match the data its tools returned; an answer that doesn’t is retried, then blocked. Wikipedia claims cite the exact page revision. Trained on 8,190 players across seven European leagues (2013–2024). LightGBM beat the no-change baseline by ~13% MAE (0.357 vs 0.410) and tied a linear model; 82.2% coverage on 80% intervals; 19/20 on a held-out agent eval. Two pre-registered experiments are reported as negative results. The agent runs on Claude Haiku 5.5, about 8x cheaper per question than Haiku 4.5 with the same dev-set result. Milestone M3 (public-text features) is still open.",
      role: "Independent project — live demo",
      outcome:
        "On the 2023–24 test seasons: MAE 0.357 vs 0.410 for a no-change baseline (no gain over a linear baseline) and 82.2% coverage for 80% prediction intervals; agent at 19/20 held-out evals with 2/2 injection attempts resisted; CI with tests, dependency audits, secret scanning and CodeQL, and a documented threat model",
      stack: "Python · LightGBM · FastAPI · Postgres · Claude API · RAG · Cloud Run",
    },
  },
  {
    id: "medhelp",
    tag: "02 · AI clinical decision support",
    title: "MedHelp",
    lead: "An NLP tool designed for Brazil’s public health system (SUS), built and evaluated on synthetic data, not real patient records: it normalizes clinical notes and flags preventive exams from patient demographics and history.",
    skinClass: "pcard--clinical",
    layers: ["Exam-recommendation output", "NLP normalisation layer", "Clinical-note input (synthetic)"],
    skin: {
      kind: "clinical",
      vitals: [
        { dt: "Terminology normalization (23/25 terms, synthetic data)", value: "92", unit: "%" },
        { dt: "Model surface", value: "NLP" },
      ],
      ecgPath:
        "M0 20 H120 l6 -14 l6 28 l6 -20 l5 6 H180 l8 -22 l7 34 l6 -12 H320",
    },
    detail: {
      body: "A Python NLP tool designed for Brazil’s public health system (SUS), built and evaluated on synthetic data, not real patient records. It reads free-text clinical notes, normalizes inconsistent terminology, and recommends preventive exams from patient demographics and medical history. Grew directly out of my undergraduate thesis on natural language processing (NLP) for clinical decision support.",
      role: "Undergraduate thesis project",
      outcome:
        "92% (23 of 25 terms) on clinical terminology normalization, evaluated on synthetic data in the thesis (chapter 4.3)",
      // the repo (C:\Projetos\Medhelper): a rule-based FastAPI service; pandas and
      // matplotlib appear only in its evaluation scripts
      stack: "Python · FastAPI · Pydantic · Uvicorn · rule-based guideline engine (MS/INCA, medical societies) · synthetic patient data",
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
    status: "In development (redesign in progress)",
    lead: "A mobile app that turns meal logging into a game — streaks, XP levels and weekly challenges, in Brazilian Portuguese.",
    skinClass: "pcard--game",
    layers: ["Mobile UI · streaks, XP, challenges", "Food search · TACO table", "On-device storage"],
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
      caption: "UI preview · sample data",
    },
    detail: {
      // only what the current code does: no sync, no backend, the leaderboard
      // runs on sample data and photo logging is planned
      body: "A mobile app that turns meal logging into a game, in Brazilian Portuguese, now being redesigned. In the current code, meals are logged by searching a food-composition table (Brazil’s TACO, plus two milk entries from USDA FoodData Central) with calories and macros per portion, and a daily goal, streaks, XP levels, weekly challenges and achievements are derived from what is logged. Data is stored on the device; there is no backend or account yet.",
      // personal project — not freelance/client work; keep it that way
      role: "Personal project — architecture and UI",
      outcome: "In development (redesign in progress)",
      stack: "React Native · Expo · Expo Router · TypeScript · Reanimated · on-device storage (AsyncStorage)",
    },
    video: { id: "-yoaS_WkRfY", poster: "/assets/video/nutriquest.webp", seconds: 21 },
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
        "Worked on batch-processing optimization",
      stack: "Oracle BRM · C · Shell · Oracle BI Publisher · Agile / JIRA",
    },
  },
];
