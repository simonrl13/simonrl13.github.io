/* Verification screenshots via the installed Chrome.
   Usage: node scripts/shots.mjs [baseUrl] [outDir] */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:4321";
const OUT = process.argv[3] || "scripts/.shots";
const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

mkdirSync(OUT, { recursive: true });

const views = [
  { name: "desktop", width: 1440, height: 900, dsf: 1, mobile: false },
  { name: "tablet", width: 820, height: 1180, dsf: 1, mobile: true },
  { name: "mobile", width: 390, height: 844, dsf: 2, mobile: true },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars", "--no-sandbox"],
});

for (const v of views) {
  const page = await browser.newPage();
  await page.setViewport({
    width: v.width,
    height: v.height,
    deviceScaleFactor: v.dsf,
    isMobile: v.mobile,
    hasTouch: v.mobile,
  });
  await page.goto(BASE, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: `${OUT}/${v.name}-full.png`, fullPage: true });
  await page.screenshot({ path: `${OUT}/${v.name}-fold.png` });
  const overflow = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    overflowing: document.documentElement.scrollWidth > window.innerWidth + 1,
  }));
  console.log(v.name, JSON.stringify(overflow));
  await page.close();
}

await browser.close();
