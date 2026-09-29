import puppeteer from "puppeteer-core";
/* Renders the CV: npm run cv  (scripts/cv-source.html -> public/assets/cv.pdf).
   Page size and margins come from the @page rule in the HTML. */
import path from "node:path";

const src = process.argv[2];
const out = process.argv[3];

const b = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox"],
});
const p = await b.newPage();
const fileUrl = "file:///" + path.resolve(src).split(path.sep).join("/");
await p.goto(fileUrl, { waitUntil: "networkidle0" });
await p.pdf({
  path: out,
  format: "A4",
  printBackground: true,
  margin: { top: "0", bottom: "0", left: "0", right: "0" },
});
await b.close();
console.log("wrote", out);
