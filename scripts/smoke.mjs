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
// project videos are click-to-load: nothing may reach YouTube before play is pressed
const youtube = [];
page.on("request", (r) => {
  if (/youtube|ytimg|googlevideo/i.test(new URL(r.url()).hostname)) youtube.push(r.url());
});

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

// 1c. video facade: no YouTube request after loading the page and opening every
// dialog; pressing play injects the youtube-nocookie player, closing removes it
if (youtube.length) fails.push(`YouTube contacted before play: ${youtube[0]}`);
await page.click("#proj-scout .pcard__more");
await page.waitForSelector("dialog.sheet[open] .video__play", { timeout: 2000 });
await page.click("dialog.sheet[open] .video__play");
const player = await page.$eval("dialog.sheet[open] .video iframe", (f) => f.src).catch(() => "");
if (!player.startsWith("https://www.youtube-nocookie.com/embed/")) fails.push(`video player after play: ${player || "none"}`);
// focus is inside the cross-origin player now, which keeps Escape: use the close button
await page.click("dialog.sheet[open] .sheet__close");
await page.waitForFunction(() => !document.querySelector("dialog.sheet[open]"), { timeout: 2000 });
if (await page.$("dialog.sheet .video iframe")) fails.push("video player still mounted after closing the dialog");

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

// 11. services: /pt/empresas (PT nav) and /services (EN footer only), placeholders visible
await page.goto(url("/pt/"), { waitUntil: "networkidle0" });
if (!(await page.$(".nav__list a[href='/pt/empresas/']"))) fails.push("/pt/ nav has no Para empresas link");
if (!(await page.$(".foot a[href='/pt/empresas/']"))) fails.push("/pt/ footer has no services link");
await page.goto(url("/"), { waitUntil: "networkidle0" });
if (await page.$(".nav__list a[href='/services/']")) fails.push("EN nav should not link /services/");
if (!(await page.$(".foot a[href='/services/']"))) fails.push("EN footer has no /services/ link");
for (const [path, h1] of [["/pt/empresas/", "Projetos para empresas"], ["/services/", "Project work for businesses"]]) {
  const r = await page.goto(url(path), { waitUntil: "networkidle0" });
  if (!r || r.status() !== 200) fails.push(`${path} status ${r && r.status()}`);
  if ((await page.$eval("h1", (el) => el.textContent)) !== h1) fails.push(`${path} h1`);
  const main = await page.$eval("main", (el) => el.textContent);
  if (leaksTodo(main)) fails.push(`${path} shows a TODO note`);
  if ((await page.$$(".offer")).length !== 2) fails.push(`${path} should list 2 offers`);
  if (!(await page.$("form.cform input[type=checkbox][name=consent][required]"))) fails.push(`${path} form has no required consent box`);
}

// 12. contact API from the page's own origin: honeypot is swallowed, missing consent is refused
const post = (body) =>
  page.evaluate(async (b) => {
    const r = await fetch("/api/contact/", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) });
    return { status: r.status, text: await r.text() };
  }, body);
const valid = { name: "Smoke Test", business: "CI", email: "smoke@example.com", message: "Automated smoke test, please ignore.", consent: true, locale: "pt" };
const hp = await post({ ...valid, website: "http://spam.example" });
if (hp.status !== 200) fails.push(`honeypot post: ${hp.status}`);
const noConsent = await post({ ...valid, consent: false });
if (noConsent.status !== 400 || !/consentimento/.test(noConsent.text)) fails.push(`no-consent post: ${noConsent.status} ${noConsent.text}`);
// a real submission only against a local server — never email Simon from a prod smoke run
if (/localhost|127\.0\.0\.1/.test(BASE)) {
  await page.goto(url("/pt/empresas/"), { waitUntil: "networkidle0" });
  await page.type("input[name=name]", valid.name);
  await page.type("input[name=business]", valid.business);
  await page.type("input[name=email]", valid.email);
  await page.type("textarea[name=message]", valid.message);
  await page.click("input[name=consent]");
  await page.click(".cform button[type=submit]");
  await page.waitForFunction(() => document.querySelector(".cform__status")?.textContent.trim(), { timeout: 15000 });
  const status = await page.$eval(".cform__status", (el) => el.textContent);
  // locally: "not configured" without Resend vars, "sent" with them
  if (!/não está configurado|foi enviada/.test(status)) fails.push(`form submit status: ${status}`);
}

// 13. no horizontal overflow on a phone, in either language
await page.setViewport({ width: 360, height: 780, isMobile: true, hasTouch: true });
for (const path of ["/", "/pt/", "/security/", "/pt/seguranca/", "/services/", "/pt/empresas/"]) {
  await page.goto(url(path), { waitUntil: "networkidle0" });
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (over > 0) fails.push(`${path} overflows by ${over}px at 360px`);
}

// 14. CVs: the hero button offers the page's language, the other two sit
// beside it, and every PDF is served
for (const [path, main] of [["/", "/assets/cv.pdf"], ["/pt/", "/assets/cv-pt.pdf"]]) {
  await page.goto(url(path), { waitUntil: "networkidle0" });
  const cv = await page.evaluate(() => ({
    button: document.querySelector(".origin__actions .btn--ghost")?.getAttribute("href"),
    others: [...document.querySelectorAll(".origin__cv-others a")].map((a) => a.getAttribute("href")),
  }));
  if (cv.button !== main) fails.push(`${path} CV button links ${cv.button}, expected ${main}`);
  if (cv.others.length !== 2 || cv.others.includes(main)) fails.push(`${path} other CVs: ${cv.others.join(", ")}`);
}
for (const pdf of ["/assets/cv.pdf", "/assets/cv-fr.pdf", "/assets/cv-pt.pdf"]) {
  const r = await fetch(url(pdf));
  if (!r.ok || !/pdf/.test(r.headers.get("content-type") ?? "")) fails.push(`${pdf}: HTTP ${r.status} ${r.headers.get("content-type")}`);
}

await browser.close();

if (fails.length) {
  console.error("SMOKE FAILURES:\n" + fails.map((f) => " - " + f).join("\n"));
  process.exit(1);
}
console.log("smoke: all checks passed");
