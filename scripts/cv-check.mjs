/* Facts that must match across the CV's languages: every number, every
   month + year date and "present". scripts/render-cv.mjs compares each
   EN / FR / PT-BR trio of scripts/cv-source.html with these before it renders.
   Each language writes the same fact its own way:
     EN 8,190 · 0.357 · Jun 2022 · present
     FR 8 190 · 0,357 · juin 2022 · aujourd’hui   (narrow no-break spaces)
     PT 8.190 · 0,357 · jun. 2022 · atual */

export const LANGS = ["en", "fr", "pt-BR"];

const NUMBER = {
  en: /\d+(?:,\d{3})*(?:\.\d+)?/g,
  fr: /\d+(?:[   ]\d{3})*(?:,\d+)?/g,
  "pt-BR": /\d+(?:\.\d{3})*(?:,\d+)?/g,
};
const toNumber = {
  en: (s) => s.replaceAll(",", ""),
  fr: (s) => s.replace(/[   ]/g, "").replace(",", "."),
  "pt-BR": (s) => s.replaceAll(".", "").replace(",", "."),
};
// a month only counts right before a year, so "Market-Value" or "mai" in a
// sentence never reads as a date
const MONTH = {
  en: /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?(?=\s+\d{4})/gi,
  fr: /\b(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)(?=\s+\d{4})/gi,
  "pt-BR": /\b(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\.?(?=\s+\d{4})/gi,
};
const MONTH_INDEX = {
  en: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
  fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  "pt-BR": ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
};
const PRESENT = { en: /\bpresent\b/gi, fr: /aujourd[’']hui/gi, "pt-BR": /\batual\b/gi };

/** The sorted facts in one language's text: numbers, months (M1–M12), "present". */
export function facts(text, lang) {
  const out = [];
  for (const [n] of text.matchAll(NUMBER[lang])) out.push(String(Number(toNumber[lang](n))));
  for (const m of text.matchAll(MONTH[lang])) {
    const word = m[1].toLowerCase();
    out.push(`M${MONTH_INDEX[lang].findIndex((x) => (lang === "en" ? word.startsWith(x) : word === x)) + 1}`);
  }
  for (const _ of text.matchAll(PRESENT[lang])) out.push("PRESENT");
  return out.sort();
}

/** Problems in a list of trios ({ en, fr, "pt-BR" } texts); empty when all match. */
export function compareTrios(trios) {
  const problems = [];
  for (const t of trios) {
    const missing = LANGS.filter((l) => typeof t[l] !== "string");
    if (missing.length) {
      problems.push(`incomplete trio (no ${missing.join(", ")}): "${(t.en ?? t.fr ?? t["pt-BR"] ?? "").slice(0, 60)}"`);
      continue;
    }
    const en = facts(t.en, "en").join(" ");
    for (const l of ["fr", "pt-BR"]) {
      const other = facts(t[l], l).join(" ");
      if (other !== en) problems.push(`${l} differs from en: [${other}] vs [${en}] in "${t.en.slice(0, 60)}"`);
    }
  }
  return problems;
}
