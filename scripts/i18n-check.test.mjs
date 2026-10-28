/* Every translation of the site carries the same facts as the English: the
   same numbers, month + year dates and "present", string by string (the
   CV's comparator, scripts/cv-check.mjs). Run: npm test.

   Compares each locale's bundle with the English one field by field, and the
   projects as the page shows them (localizedProjects: card + dialog). */

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { facts } from "./cv-check.mjs";

// compile the real bundles with the project's TypeScript (as grounding.test.mjs does)
mkdirSync(path.join("node_modules", ".cache"), { recursive: true });
const out = mkdtempSync(path.join("node_modules", ".cache", "i18n-check-"));
execFileSync(process.execPath, [path.join("node_modules", "typescript", "bin", "tsc"), "content/i18n/index.ts", "--rootDir", ".", "--outDir", out, "--module", "commonjs", "--target", "es2022", "--resolveJsonModule", "--esModuleInterop", "--skipLibCheck"], { stdio: "inherit" });
const i18n = createRequire(import.meta.url)(path.resolve(out, "content", "i18n", "index.js"));
const { hasPage, locales } = createRequire(import.meta.url)(path.resolve(out, "content", "i18n", "routes.js"));
rmSync(out, { recursive: true, force: true });

// identifiers, not quantities: written the same way in every language
const IDS = /\b(?:Haiku \d\.\d|(?:chapter|chapitre|capítulo) \d+\.\d+|2026\.5|04\.1)\b/g;
// the same fact written differently on purpose: "<locale>:<path>"
const SAME_FACT = {
  "pt:services.offers[0].outcome": "às 23h = at 11 pm (24-hour clock)",
};
const factsOf = (text, lang) => facts(text.replace(IDS, ""), lang === "en" ? "en" : lang === "fr" ? "fr" : "pt-BR").join(" ");

/** Problems between two values of the same shape; empty when the facts match. */
export function compare(en, other, lang, where = "") {
  if (typeof en === "string") {
    if (typeof other !== "string") return [`${where}: missing`];
    const a = factsOf(en, "en");
    const b = factsOf(other, lang);
    return a === b ? [] : [`${where}: [${b}] vs en [${a}]`];
  }
  if (Array.isArray(en)) {
    if (!Array.isArray(other) || other.length !== en.length) return [`${where}: ${other?.length} items vs en ${en.length}`];
    return en.flatMap((v, i) => compare(v, other[i], lang, `${where}[${i}]`));
  }
  if (en && typeof en === "object") {
    return Object.keys(en).flatMap((k) => compare(en[k], other?.[k], lang, where ? `${where}.${k}` : k));
  }
  return [];
}

function problems(locale) {
  const en = i18n.getBundle("en");
  const b = i18n.getBundle(locale);
  const lang = b.ui.meta.htmlLang;
  // not compared: the project card copy (compared as rendered, below), the
  // list of other CVs (a choice per locale) and pages the locale lacks
  const strip = ({ projects, locale, ...rest }) => ({
    ...rest,
    ui: { ...rest.ui, origin: { ...rest.ui.origin, cvOthers: [] } },
    services: hasPage(b.locale, "services") ? rest.services : undefined,
  });
  // a dialog is checked in its own language (Portuguese keeps them English)
  const enProjects = i18n.localizedProjects(en);
  const projectProblems = i18n.localizedProjects(b).flatMap((p, i) => {
    const { detail, dialogTitle, ...card } = p;
    const { detail: enDetail, dialogTitle: enTitle, ...enCard } = enProjects[i];
    return [
      ...compare(enCard, card, lang, `projects[${i}]`),
      ...compare({ dialogTitle: enTitle, detail: enDetail }, { dialogTitle, detail }, p.detailLang, `projects[${i}]`),
    ];
  });
  return [...compare(strip(en), strip(b), lang), ...projectProblems].filter(
    (p) => !(`${locale}:${p.split(":")[0]}` in SAME_FACT),
  );
}

for (const locale of locales.filter((l) => l !== "en")) {
  test(`${locale}: same numbers and dates as the English`, () => {
    assert.deepEqual(problems(locale), []);
  });
}

test("a changed number or date in a translation is caught", () => {
  assert.deepEqual(compare({ a: "8,190 players, Jun 2022" }, { a: "8 190 joueurs, juin 2022" }, "fr"), []);
  assert.equal(compare({ a: "8,190 players" }, { a: "8 191 joueurs" }, "fr").length, 1);
  assert.equal(compare({ a: "until 1 January 2027" }, { a: "jusqu’au 1er février 2027" }, "fr").length, 1);
  assert.equal(compare({ a: "until 1 January 2027" }, { a: "até 1º de janeiro de 2027" }, "pt-BR").length, 0);
  assert.equal(compare({ a: "0.357" }, { a: "0.357" }, "fr").length, 1, "a French decimal needs a comma");
});
