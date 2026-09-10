/* Case-study data for the Lattes → Sanity publication pipeline
   (the "diagram it, don't describe it" story from the LABNOV work). */

export type FlowNode = {
  idx: string;
  title: string;
  body: string;
  kind?: "source" | "gate" | "process" | "store" | "output";
};

export const pipeline = {
  title: "The Lattes sync pipeline",
  eyebrow: "Detail 04.1 — LABNOV",
  lead: "A close-up on one part of the LABNOV build: keeping a research lab's publication list current, automatically, past an obstacle that rules out full automation.",

  nodes: [
    {
      idx: "01",
      title: "Plataforma Lattes",
      body: "Brazil's academic-CV registry. No public API; the export is CAPTCHA-gated.",
      kind: "source",
    },
    {
      idx: "02",
      title: "reCAPTCHA checkpoint",
      body: "Can't be automated. The pipeline pauses for one human click, then runs unattended.",
      kind: "gate",
    },
    {
      idx: "03",
      title: "Parser",
      body: "Pulls publications from the export; normalises authors, venues and years.",
      kind: "process",
    },
    {
      idx: "04",
      title: "Diff",
      body: "Compares against the CMS — new papers in, nothing duplicated or dropped.",
      kind: "process",
    },
    {
      idx: "05",
      title: "Sanity CMS",
      body: "Only the changes are written, into the schema staff already edit by hand.",
      kind: "store",
    },
    {
      idx: "06",
      title: "LABNOV site",
      body: "New publications show within a sync cycle. Nobody maintains the list.",
      kind: "output",
    },
  ] satisfies FlowNode[],

  meta: [
    {
      dt: "Problem",
      dd: "A public publication list that drifts out of date the moment someone forgets to update it.",
    },
    {
      dt: "Approach",
      dd: "Automate everything except the one step that can't be — and make that step a single click, not a chore.",
    },
    {
      dt: "Result",
      dd: "A near-zero-maintenance list that stays honest to the source of record.",
    },
  ],
} as const;
