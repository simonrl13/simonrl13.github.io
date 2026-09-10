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

export type Project = {
  id: string;
  tag: string;
  title: string;
  /** dialog title, if different from the card title */
  dialogTitle?: string;
  lead: string;
  skin: SkinClinical | SkinGame | SkinLab | SkinTerm;
  skinClass: "pcard--clinical" | "pcard--game" | "pcard--lab" | "pcard--term";
  accentTitle?: boolean; // colour the <h3> with the skin accent (NutriQuest)
  // three system layers, top (what the user touches) → bottom (foundation);
  // rendered as an exploded isometric stack
  layers: [string, string, string];
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
    id: "medhelp",
    tag: "01 · AI clinical decision support",
    title: "MedHelp",
    lead: "An NLP tool for Brazil’s public health record system (PEC): it normalizes clinical notes, adapts language per audience, and flags preventive exams from patient demographics and history.",
    skinClass: "pcard--clinical",
    layers: ["Exam-recommendation output", "NLP normalisation layer", "PEC clinical-note input"],
    skin: {
      kind: "clinical",
      vitals: [
        { dt: "Terminology accuracy", value: "92", unit: "%" },
        { dt: "Recall", value: "100", unit: "%" },
        { dt: "Model surface", value: "NLP" },
      ],
      ecgPath:
        "M0 20 H120 l6 -14 l6 28 l6 -20 l5 6 H180 l8 -22 l7 34 l6 -12 H320",
    },
    detail: {
      body: "A Python NLP tool built for Brazil’s public health record system (PEC). It reads free-text clinical notes, normalizes inconsistent terminology, rewrites explanations for the intended audience (clinician vs. patient), and recommends preventive exams from patient demographics and medical history. Grew directly out of my undergraduate thesis on generative AI in clinical decision support.",
      role: "Sole developer — research, modelling, implementation",
      outcome:
        "92% accuracy on terminology normalization and 100% recall on the target exam-recommendation set, measured on the thesis evaluation set. TODO(simon): confirm sample size / current status.",
      stack: "Python · pandas · scikit-learn · NumPy · NLP · healthcare data (PEC)",
    },
  },
  {
    id: "nutriquest",
    tag: "02 · gamified nutrition tracker",
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
      role: "Mobile developer — architecture, UI, localization",
      outcome:
        "Shipped cross-platform from a single codebase with offline-first sync",
      stack: "React Native · Expo · i18n · custom state management",
    },
  },
  {
    id: "labnov",
    tag: "03 · bilingual research platform",
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
    tag: "04 · enterprise backend, Accenture",
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
      role: "Software developer — backend optimization & reporting automation",
      outcome:
        "Measurable reduction in batch processing time with improved data accuracy (specifics under NDA)",
      stack: "Oracle BRM · C · Shell · Oracle BI Publisher · Agile / JIRA",
    },
  },
];
