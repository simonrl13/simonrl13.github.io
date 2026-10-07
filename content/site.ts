/* =========================================================
   Single source of truth for profile-level facts and copy.
   TODO(simon) notes live in code comments only — never in rendered
   strings (the smoke test fails if one reaches the page).
   ========================================================= */

export const site = {
  name: "Simon Laborde",
  role: "Systems & full-stack engineering",
  url: "https://www.simonlaborde.com",
  // simonlaborde.com is the canonical public domain.
  canonical: "https://www.simonlaborde.com",

  title: "Simon Laborde — Backend & AI/LLM Engineer",
  description:
    "Simon Laborde — backend and full-stack engineer with an AI/LLM focus, built on a foundation in enterprise backend systems. Portfolio, experience, and contact.",

  // Hero copy
  roleLine:
    "Backend & full-stack engineer with an <strong>AI / LLM</strong> focus, built on a foundation in enterprise backend systems and full-stack development.",
  thesis:
    "I bridge the gap between complex systems and the people who depend on them — currently building LLM-backed tools.",

  // The live "now" line in the hero.
  status: {
    label: "Open to AI & software engineering roles",
    detail: "Remote or on-site in the EU — full-time, contract or freelance",
  },

  // Right to work — hero and Contact. Matches the CV header line.
  workRights:
    "French citizen with full right to work in the EU — no visa sponsorship needed. Based in Brazil; open to remote work and relocation.",

  contactIntro:
    "Open to AI and software engineering roles — remote or on-site in the EU — plus freelance and contract work.",

  // Chat launcher label — the short form shows on phones, where the full
  // label won't fit beside the content.
  chatLauncher: { full: "ASK ABOUT MY WORK", short: "ASK" },

  chatSuggestions: [
    "What's his experience with LLMs and agents?",
    "Tell me about the Lattes pipeline.",
    "Has he shipped anything to production?",
    "Can he work in the EU?",
  ],

  // Shown under the chat input. Keep the privacy line true to the code:
  // app/api/chat never logs messages; the per-IP rate-limit key expires
  // with its 10-minute window (app/api/chat/rate-limit.ts).
  chatNotice: {
    accuracy:
      "Answers are AI-generated from this site’s content — verify anything important with Simon directly.",
    privacy:
      "Privacy: your questions are sent to Anthropic’s Claude API to generate answers. This site doesn’t save conversations; your IP address is held for up to 10 minutes for rate limiting.",
  },

  // Browser/status-bar colour per theme — must match --ink in globals.css.
  themeColor: { dark: "#0F1A2B", light: "#ECE4D3" },

  // Blueprint title block
  titleBlock: [
    { dt: "Drawn by", dd: "S. Laborde", mono: false },
    { dt: "Origin", dd: "07°13′S 35°53′W", mono: true },
    { dt: "Bearing", dd: "Brazil → Europe", mono: false },
    { dt: "Revision", dd: "2026.5", mono: true },
    { dt: "Sheet", dd: "1 / 1", mono: true },
    { dt: "Scale", dd: "1:1", mono: true },
  ],

  languages: [
    { code: "PT", name: "Portuguese", level: "native", bars: 5 },
    { code: "EN", name: "English", level: "C2", bars: 5 },
    { code: "FR", name: "French", level: "C1", bars: 4 },
    { code: "ES", name: "Spanish", level: "B1", bars: 2 },
  ],

  links: {
    email: "simonrl865@gmail.com",
    github: "https://github.com/simonrl13",
    githubHandle: "github.com/simonrl13",
    linkedin: "https://www.linkedin.com/in/simonrodrigueslaborde",
    linkedinHandle: "in/simonrodrigueslaborde",
    cv: "/assets/cv.pdf", // rendered from scripts/cv-source.html (npm run cv)
    cvName: "Simon_Laborde_CV.pdf",
  },

  // Exam-based certifications vs. course completions — kept apart on
  // purpose, same split and wording as the CV.
  certifications: [
    "AI-900: Microsoft Azure AI Fundamentals — Microsoft",
    "Scrum Fundamentals Certified (SFC)",
    "EF SET English Certificate (C2, 77/100)",
  ],
  training: [
    "Anthropic Academy — AI Fluency: Framework & Foundations (Mar 2026)",
    "Anthropic Academy — Claude Code in Action (Mar 2026)",
    "Anthropic Academy — Building with the Claude API (Jul 2026)",
    "Anthropic Academy — Introduction to Model Context Protocol (Aug 2026)",
    "Anthropic Academy — Model Context Protocol: Advanced Topics (Aug 2026)",
    "Accenture Academy — Oracle BRM",
  ],
} as const;

export type JourneyItem = {
  when: string;
  title: string;
  org: string;
  body: string; // may contain <em>…</em>
};

export const journey: JourneyItem[] = [
  {
    when: "2024 — present",
    title: "Freelance Software Development",
    org: "Independent — remote",
    body: "Built LABNOV's bilingual site for a UFCG materials-research lab — a Sanity CMS content model for its non-technical staff and an automated publication pipeline off Brazil's Plataforma Lattes — and a website for pop-art painter Rogério Freire. Additional client work under NDA.",
  },
  {
    when: "2020 — 2025",
    title: "B.Sc. Information Systems",
    org: "UNIFACISA — Campina Grande",
    body: "Thesis — <em>&ldquo;Applications of Generative AI in Clinical Decision Support&rdquo;</em> — defended with distinction, and the seed of the MedHelp project.",
  },
  {
    when: "2022 — 2023",
    title: "Custom Software Engineer",
    org: "Accenture",
    body: "Optimized billing and backend processes on Oracle BRM with C and shell scripting; automated financial reporting through Oracle BI Publisher inside an Agile delivery team.",
  },
  {
    when: "2018 — 2020",
    title: "Game development foundation",
    org: "UNIFACISA",
    body: "Interactive systems design, C# gameplay logic, and physics-engine work — where the instinct for how systems move and break first took hold.",
  },
];

export type ArsenalRow = {
  icon: "code" | "ai" | "data" | "frontend" | "infra" | "test";
  title: string;
  items: string;
};

export const arsenal: ArsenalRow[] = [
  {
    icon: "code",
    title: "Languages & runtimes",
    items: "Python · Java · C · C# · TypeScript · JavaScript · PL/SQL",
  },
  {
    icon: "ai",
    title: "AI / LLM",
    items:
      "LLM integration & prompt systems · Model Context Protocol (MCP) · agent & subagent design · Claude / Anthropic APIs · NLP · scikit-learn · LightGBM · MLflow · pandas · NumPy",
  },
  {
    icon: "data",
    title: "Backend & data",
    items: "RESTful APIs · PostgreSQL · MySQL · Oracle BRM · Oracle BI Publisher",
  },
  {
    icon: "frontend",
    title: "Frontend & mobile",
    items: "Next.js · React · React Native · Expo · Tailwind · semantic HTML/CSS",
  },
  {
    icon: "infra",
    title: "Infrastructure & tooling",
    items: "Docker · AWS EC2 · Vercel · Git · JIRA · Sanity CMS · Figma",
  },
  {
    icon: "test",
    title: "Testing",
    items: "pytest",
  },
];
