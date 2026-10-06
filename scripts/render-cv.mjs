/* Renders the CV from scripts/cv-source.html (the single source of truth).

   npm run cv        → public/assets/cv.pdf — phone segment removed (served
                       by the site)
   npm run cv:full   → cv-private/Simon_Laborde_CV_full.pdf — phone filled in
                       from the CV_PHONE env var (e.g. in .env.local); the
                       folder is gitignored and never published

   Page size and margins come from the @page rule in the HTML. */
import puppeteer from "puppeteer-core";
import { mkdirSync, readFileSync } from "node:fs";

const full = process.argv.includes("--full");
const SOURCE = "scripts/cv-source.html";
const OUT = full ? "cv-private/Simon_Laborde_CV_full.pdf" : "public/assets/cv.pdf";
const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const escape = (s) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

let html = readFileSync(SOURCE, "utf8");

if (full) {
  const phone = process.env.CV_PHONE?.trim();
  if (!phone) {
    console.error("CV_PHONE is not set — add it to .env.local (gitignored) and run `npm run cv:full`.");
    process.exit(1);
  }
  html = html.replace("{{PHONE}}", escape(phone));
  mkdirSync("cv-private", { recursive: true });
} else {
  html = html.replace(/<span class="private-phone">[\s\S]*?<\/span>/, "");
  // belt and braces: the public CV must not carry a phone number
  const body = html.replace(/<style>[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, "");
  if (body.includes("{{PHONE}}") || /\+?\d[\d\s().-]{8,}\d/.test(body.replace(/\d{4}\s*[–-]\s*(\d{4}|present)/gi, ""))) {
    console.error("Refusing to render: the public CV still contains a phone placeholder or number.");
    process.exit(1);
  }
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle0" });
await page.pdf({
  path: OUT,
  format: "A4",
  printBackground: true,
  margin: { top: "0", bottom: "0", left: "0", right: "0" },
});
await browser.close();
console.log("wrote", OUT);
