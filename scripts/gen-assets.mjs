/* Rasterises the SVG sources into the PNGs the site references.
   Run: node scripts/gen-assets.mjs   (re-run whenever a source SVG changes) */
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

async function main() {
  const og = readFileSync(resolve(here, "og-source.svg"));
  await sharp(og, { density: 144 })
    .resize(1200, 630)
    .png()
    .toFile(resolve(root, "public/og.png"));

  const icon = readFileSync(resolve(root, "app/icon.svg"));
  await sharp(icon, { density: 384 })
    .resize(180, 180)
    .png()
    .toFile(resolve(root, "app/apple-icon.png"));

  console.log("assets written: public/og.png, app/apple-icon.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
