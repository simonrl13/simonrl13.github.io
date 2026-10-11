/* Interactive smoke test of the ported client behaviour. */
import puppeteer from "puppeteer-core";

// Default targets `next start` — see the note in shots.mjs.
const BASE = process.argv[2] || "http://localhost:3000";
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
  // the browser logs a "Failed to load resource" diagnostic for any non-2xx
  // fetch — expected here, since the chat test below exercises /api/chat
  // without an ANTHROPIC_API_KEY (its designed fallback path, not a bug)
  if (m.type() === "error" && !/Failed to load resource/.test(m.text())) {
    fails.push("console.error: " + m.text());
  }
});
page.on("pageerror", (e) => fails.push("pageerror: " + e.message));

await page.setViewport({ width: 1440, height: 900 });
await page.goto(BASE, { waitUntil: "networkidle0" });

// 1. project dialog opens + closes
await page.click('#proj-medhelp .pcard__more');
await page.waitForSelector("dialog.sheet[open]", { timeout: 2000 });
// scope to the OPEN sheet — the chat console adds a second dialog.sheet
const dlgTitle = await page.$eval("dialog.sheet[open] h2", (el) => el.textContent);
if (dlgTitle !== "MedHelp") fails.push(`dialog title: ${dlgTitle}`);
await page.keyboard.press("Escape");
await page.waitForFunction(() => !document.querySelector("dialog.sheet[open]"), {
  timeout: 2000,
});

// 1b. no rendered dialog or card leaks an internal TODO note
for (const id of await page.$eval(".pcard", (cs) => Array.from(cs, (c) => c.id))) {
  await page.click(`#${id} .pcard__more`);
  await page.waitForSelector("dialog.sheet[open]", { timeout: 2000 });
  const txt = await page.$eval("dialog.sheet[open]", (el) => el.textContent);
  if (/TODO/i.test(txt)) fails.push(`${id} dialog shows a TODO note`);
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("dialog.sheet[open]"), { timeout: 2000 });
}
if (/TODO/i.test(await page.$eval("main", (el) => el.textContent))) fails.push("page body shows a TODO note");

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

// 6. chat console opens, suggestion chip sends, a fallback/response renders
await page.click(".chat-launcher");
await page.waitForSelector("dialog.sheet--chat[open]", { timeout: 2000 });
await page.click(".chat__suggestions button");
await page.waitForFunction(
  () => {
    const p = document.querySelector(".chat__msg--assistant p");
    return !!p && p.textContent && p.textContent.trim().length > 0;
  },
  { timeout: 15000 },
);
const chatReply = await page.$eval(".chat__msg--assistant p", (el) => el.textContent);
if (!chatReply || chatReply.trim().length === 0) {
  fails.push("chat console produced no reply text");
}
await page.keyboard.press("Escape");
await page.waitForFunction(
  () => !document.querySelector("dialog.sheet--chat[open]"),
  { timeout: 2000 },
);

// 7. /security renders, is linked from the footer, and leaks no TODO
const footerLink = await page.$eval(".foot a[href='/security/']", (a) => a.textContent).catch(() => null);
if (!footerLink) fails.push("footer has no link to /security/");
const sec = await page.goto(BASE.replace(/\/$/, "") + "/security/", { waitUntil: "networkidle0" });
if (!sec || sec.status() !== 200) fails.push(`/security/ status ${sec && sec.status()}`);
const secH1 = await page.$eval("h1", (el) => el.textContent).catch(() => "");
if (!/secured/i.test(secH1)) fails.push(`/security/ h1: ${secH1}`);
const secItems = await page.$eval(".legend__row", (r) => r.length);
if (secItems < 8) fails.push(`/security/ lists only ${secItems} controls`);
if (/TODO/i.test(await page.$eval("main", (el) => el.textContent))) fails.push("/security/ shows a TODO note");

// 8. Portuguese: /pt/ is translated, dialogs stay English with a note
const url = (path) => BASE.replace(/\/$/, "") + path;
await page.goto(url("/pt/"), { waitUntil: "networkidle0" });
const htmlLang = () => page.$eval("html", (el) => el.lang);
if ((await htmlLang()) !== "pt-BR") fails.push(`/pt/ html lang: ${await htmlLang()}`);
const hreflangs = await page.$$eval("link[rel=alternate][hreflang]", (ls) => ls.map((l) => l.hreflang).sort().join(","));
if (hreflangs !== "en,pt-BR,x-default") fails.push(`/pt/ hreflang: ${hreflangs}`);
const ptTitle = await page.$eval("#journey-title", (el) => el.textContent);
if (ptTitle !== "Trajetória") fails.push(`/pt/ journey title: ${ptTitle}`);
// note markers only: "todo" is an ordinary Portuguese word
const leaksTodo = (text) => /TODO[(:]/.test(text);
if (leaksTodo(await page.$eval("main", (el) => el.textContent))) fails.push("/pt/ shows a TODO note");
await page.click("#proj-medhelp .pcard__more");
await page.waitForSelector("dialog.sheet[open]", { timeout: 2000 });
const ptDlg = await page.$eval("dialog.sheet[open]", (el) => ({
  h2: el.querySelector("h2").textContent,
  note: el.querySelector(".sheet__note")?.textContent,
}));
if (ptDlg.h2 !== "MedHelp" || ptDlg.note !== "Estudo de caso em inglês.") fails.push(`/pt/ dialog: ${JSON.stringify(ptDlg)}`);
await page.keyboard.press("Escape");
await page.waitForFunction(() => !document.querySelector("dialog.sheet[open]"), { timeout: 2000 });
if (!(await page.$(".foot a[href='/pt/seguranca/']"))) fails.push("/pt/ footer has no link to /pt/seguranca/");

// 9. switcher: goes to the other language, remembers it, never redirects
await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), page.click(".nav .lang-switch--nav a[hreflang='en']")]);
if (new URL(page.url()).pathname !== "/" || (await htmlLang()) !== "en") fails.push(`switcher EN landed on ${page.url()}`);
const stored = await page.evaluate(() => localStorage.getItem("lang"));
if (stored !== "en") fails.push(`switcher stored lang: ${stored}`);
await page.goto(url("/pt/"), { waitUntil: "networkidle0" }); // stored "en" must not win over the URL
if (new URL(page.url()).pathname !== "/pt/" || (await htmlLang()) !== "pt-BR") fails.push(`/pt/ redirected to ${page.url()}`);

// 10. /pt/seguranca/ and localized 404s
const ptSec = await page.goto(url("/pt/seguranca/"), { waitUntil: "networkidle0" });
if (!ptSec || ptSec.status() !== 200) fails.push(`/pt/seguranca/ status ${ptSec && ptSec.status()}`);
if (!/protegido/.test(await page.$eval("h1", (el) => el.textContent))) fails.push("/pt/seguranca/ h1 not Portuguese");
if ((await page.$$eval(".legend__row", (r) => r.length)) < 8) fails.push("/pt/seguranca/ lists too few controls");
if (leaksTodo(await page.$eval("main", (el) => el.textContent))) fails.push("/pt/seguranca/ shows a TODO note");
if (!(await page.$(".lang-switch--nav a[href='/security/']"))) fails.push("/pt/seguranca/ switcher misses /security/");
for (const [path, h1] of [["/pt/nada/", "Fora do desenho"], ["/nothing-here/", "Off the drawing"]]) {
  const r = await page.goto(url(path), { waitUntil: "networkidle0" });
  const got = await page.$eval("h1", (el) => el.textContent).catch(() => "");
  if (!r || r.status() !== 404 || got !== h1) fails.push(`${path}: ${r && r.status()} "${got}"`);
}

// 11. no horizontal overflow on a phone, in either language
await page.setViewport({ width: 360, height: 780, isMobile: true, hasTouch: true });
for (const path of ["/", "/pt/", "/security/", "/pt/seguranca/"]) {
  await page.goto(url(path), { waitUntil: "networkidle0" });
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (over > 0) fails.push(`${path} overflows by ${over}px at 360px`);
}

await browser.close();

if (fails.length) {
  console.error("SMOKE FAILURES:\n" + fails.map((f) => " - " + f).join("\n"));
  process.exit(1);
}
console.log("smoke: all checks passed");
