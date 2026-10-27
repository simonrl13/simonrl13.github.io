/* Renders the CV in English, French and Brazilian Portuguese from
   scripts/cv-source.html (the single source of truth; each translated element
   is an en / fr / pt-BR trio, and a render keeps one language).

   npm run cv              → public/assets/cv.pdf, cv-fr.pdf, cv-pt.pdf — phone
                             removed (served by the site)
   npm run cv:full         → cv-private/Simon_Laborde_CV_full{,_FR,_PT}.pdf — phone
                             filled in from CV_PHONE (e.g. in .env.local); the
                             folder is gitignored and never published
   npm run cv -- --check   → renders and checks without writing (CI)

   Before anything is written: every trio must carry the same numbers and dates
   (scripts/cv-check.mjs) and every PDF must be exactly 2 pages.
   Page size and margins come from the @page rule in the HTML. */
import puppeteer from "puppeteer-core";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { LANGS, compareTrios } from "./cv-check.mjs";

const full = process.argv.includes("--full");
const check = process.argv.includes("--check");
const SOURCE = "scripts/cv-source.html";
const OUT = {
  en: full ? "cv-private/Simon_Laborde_CV_full.pdf" : "public/assets/cv.pdf",
  fr: full ? "cv-private/Simon_Laborde_CV_full_FR.pdf" : "public/assets/cv-fr.pdf",
  "pt-BR": full ? "cv-private/Simon_Laborde_CV_full_PT.pdf" : "public/assets/cv-pt.pdf",
};
const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const escape = (s) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const fail = async (browser, msg) => {
  await browser.close();
  console.error(msg);
  process.exit(1);
};

// the trio check reads the source as written, with the {{PHONE}} placeholder:
// it must never see (or print) the real phone number
const source = readFileSync(SOURCE, "utf8");
let html = source;
if (full) {
  const phone = process.env.CV_PHONE?.trim();
  if (!phone) {
    console.error("CV_PHONE is not set — add it to .env.local (gitignored) and run `npm run cv:full`.");
    process.exit(1);
  }
  html = html.replaceAll("{{PHONE}}", escape(phone));
  mkdirSync("cv-private", { recursive: true });
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();

// 1. the trios: same numbers and dates in every language
await page.setContent(source, { waitUntil: "networkidle0" });
const trios = await page.evaluate((LANGS) => {
  const out = [];
  for (const el of document.body.querySelectorAll("[lang]")) {
    if (el.lang !== LANGS[0]) {
      // a fr / pt-BR element must sit right after the one before it in its trio
      const prev = el.previousElementSibling;
      if (!prev || LANGS.indexOf(prev.lang) !== LANGS.indexOf(el.lang) - 1) out.push({ [el.lang]: el.textContent });
      continue;
    }
    const trio = { en: el.textContent };
    let next = el.nextElementSibling;
    for (const l of LANGS.slice(1)) {
      if (next?.lang !== l) break;
      trio[l] = next.textContent;
      next = next.nextElementSibling;
    }
    out.push(trio);
  }
  return out;
}, LANGS);
const problems = compareTrios(trios);
if (problems.length) await fail(browser, `CV languages disagree:\n- ${problems.join("\n- ")}`);
console.log(`${trios.length} trios: same numbers and dates in ${LANGS.join(", ")}`);

// 2. one PDF per language, exactly 2 pages, no phone in the public ones
for (const lang of LANGS) {
  const page = await browser.newPage(); // a fresh page per language
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.evaluate((lang, full) => {
    for (const el of document.body.querySelectorAll("[lang]")) if (el.lang !== lang) el.remove();
    if (!full) for (const el of document.querySelectorAll(".private-phone")) el.remove();
    document.documentElement.lang = lang;
  }, lang, full);

  if (!full) {
    // belt and braces, checked on what actually renders: the public CV must
    // not carry a phone number or the placeholder (year ranges are fine)
    const text = await page.evaluate(() => document.body.innerText);
    // only whole 19xx/20xx year ranges — a looser \d{4}-\d{4} would also eat
    // the "1234-5678" tail of a phone number and hide it from the check
    const withoutYears = text.replace(/\b(?:19|20)\d{2}\s*[–-]\s*(?:(?:19|20)\d{2}|present|aujourd[’']hui|atual)\b/gi, "");
    if (text.includes("{{PHONE}}") || /\+?\d[\d\s().-]{8,}\d/.test(withoutYears)) {
      await fail(browser, `Refusing to render: the public ${lang} CV still contains a phone placeholder or number.`);
    }
  }

  const pdf = Buffer.from(await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "0", bottom: "0", left: "0", right: "0" },
  }));
  const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
  if (pages !== 2) await fail(browser, `The ${lang} CV is ${pages} pages; it must be exactly 2. Shorten the wording (never drop a fact).`);
  if (check) console.log(`${lang}: 2 pages (not written: --check)`);
  else {
    writeFileSync(OUT[lang], pdf);
    console.log(`wrote ${OUT[lang]} (2 pages)`);
  }
}
await browser.close();
