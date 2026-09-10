/* =========================================================
   Single source of truth for profile-level facts and copy.
   Items marked TODO(simon) need confirmation before launch.
   ========================================================= */

export const site = {
  name: "Simon Laborde",
  role: "Systems & full-stack engineering",
  url: "https://simonrl13.github.io",
  // Swap to the Vercel/custom domain once cutover happens (Stage 4).
  canonical: "https://simonrl13.github.io",

  title: "Simon Laborde — Backend & AI/LLM Engineer",
  description:
    "Simon Laborde — backend and full-stack engineer with an AI/LLM focus and a game-development foundation. Portfolio, experience, and contact.",

  // Hero copy
  roleLine:
    "Backend & full-stack engineer with an <strong>AI / LLM</strong> focus, built on a foundation in game development and physics engines.",
  thesis:
    "I bridge the gap between complex systems and the people who depend on them — currently building LLM-backed tools, taking freelance and contract work across Europe, and applying to master&rsquo;s programs.",

  // TODO(simon): confirm exact wording + date. Shown as the live "now" line.
  status: {
    label: "Available for contract & freelance",
    detail: "Applying for Fall 2026 master&rsquo;s — MoSIG, Sorbonne, PSL, TUM, RWTH",
  },

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
    linkedin: "https://www.linkedin.com/in/simon-laborde-2131861bb/",
    linkedinHandle: "in/simon-laborde",
    cv: "/assets/cv.pdf", // TODO(simon): add the real PDF to public/assets/
    cvName: "Simon_Laborde_CV.pdf",
  },

  // TODO(simon): confirm names, and which are completed vs in progress.
  credentials: [
    "Anthropic — Model Context Protocol (MCP)",
    "Anthropic — Claude Platform",
    "Anthropic — Agent Skills",
    "Anthropic — Subagents",
  ],
} as const;

export type JourneyItem = {
  when: string;
  title: string;
  org: string;
  body: string; // may contain <em>…</em>
};

// TODO(simon): reconcile the academic timeline — add current UFCG / LABNOV
// affiliation if you are enrolled/researching there now.
export const journey: JourneyItem[] = [
  {
    when: "2024 — present",
    title: "Researcher — LABNOV, UFCG",
    org: "Universidade Federal de Campina Grande",
    body: "Engineering the LABNOV materials-research lab's digital platform: a bilingual site, a Sanity CMS content model for non-technical staff, and an automated publication pipeline off Brazil's Plataforma Lattes. TODO(simon): confirm role title, dates, and whether this is tied to a graduate program.",
  },
  {
    when: "2020 — 2025",
    title: "B.Sc. Information Systems",
    org: "UNIFACISA — Campina Grande",
    body: "Graduated with highest honors. Thesis — <em>&ldquo;Applications of Generative AI in Clinical Decision Support&rdquo;</em> — defended with distinction, and the seed of the MedHelp project.",
  },
  {
    when: "2022 — 2023",
    title: "Software Developer",
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
      "LLM integration & prompt systems · Model Context Protocol (MCP) · agent & subagent design · Claude / Anthropic APIs · NLP · scikit-learn · pandas · NumPy",
  },
  {
    icon: "data",
    title: "Backend & data",
    items: "RESTful APIs · PostgreSQL · MySQL · Oracle BRM · Oracle BI Publisher",
  },
  {
    icon: "frontend",
    title: "Frontend & mobile",
    items: "Next.js · React · React Native · Vue · Expo · Tailwind · semantic HTML/CSS",
  },
  {
    icon: "infra",
    title: "Infrastructure & tooling",
    items: "Docker · AWS EC2 · Vercel · Git · JIRA · Sanity CMS · Figma",
  },
  {
    icon: "test",
    title: "Testing & load",
    items: "pytest · JMeter",
  },
];
