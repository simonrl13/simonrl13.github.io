/* Interactive smoke test of the ported client behaviour. */
import puppeteer from "puppeteer-core";

const BASE = process.argv[2] || "http://localhost:4321";
const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
const fails = [];
page.on("console", (m) => {
  if (m.type() === "error") fails.push("console.error: " + m.text());
});
page.on("pageerror", (e) => fails.push("pageerror: " + e.message));

await page.setViewport({ width: 1440, height: 900 });
await page.goto(BASE, { waitUntil: "networkidle0" });

// 1. project dialog opens + closes
await page.click('#proj-medhelp .pcard__more');
await page.waitForSelector("dialog.sheet[open]", { timeout: 2000 });
const dlgTitle = await page.$eval("dialog.sheet h2", (el) => el.textContent);
if (dlgTitle !== "MedHelp") fails.push(`dialog title: ${dlgTitle}`);
await page.keyboard.press("Escape");
await page.waitForFunction(() => !document.querySelector("dialog.sheet[open]"), {
  timeout: 2000,
});

// 2. LABNOV PT/EN toggle
const ptText = await page.$eval("#proj-labnov .pcard__lead", (el) => el.textContent);
await page.click('#proj-labnov .lang-switch button[aria-pressed="false"]');
const enText = await page.$eval("#proj-labnov .pcard__lead", (el) => el.textContent);
if (ptText === enText) fails.push("LABNOV toggle did not change copy");
if (!enText.includes("Bilingual")) fails.push(`LABNOV EN copy: ${enText.slice(0, 40)}`);

// 3. carousel next button advances scroll
const x0 = await page.$eval(".carousel__track", (el) => el.scrollLeft);
await page.click('.carousel__btn[aria-label="Next project"]');
await new Promise((r) => setTimeout(r, 600));
const x1 = await page.$eval(".carousel__track", (el) => el.scrollLeft);
if (x1 <= x0) fails.push(`carousel next did not scroll (${x0} -> ${x1})`);

// 4. mobile menu
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await new Promise((r) => setTimeout(r, 200));
await page.click(".nav__toggle");
const menuOpen = await page.$eval("#nav-list-mobile", (el) => !el.hidden);
if (!menuOpen) fails.push("mobile menu did not open");

// 5. rail node lights on scroll
await page.setViewport({ width: 1440, height: 900 });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await new Promise((r) => setTimeout(r, 400));
const litCount = await page.$$eval(".rail__node.is-lit", (n) => n.length);
if (litCount === 0) fails.push("no rail nodes lit after scroll to bottom");

await browser.close();

if (fails.length) {
  console.error("SMOKE FAILURES:\n" + fails.map((f) => " - " + f).join("\n"));
  process.exit(1);
}
console.log("smoke: all checks passed");
