/* The hero label "BRG 027° → PARIS" must be the true initial great-circle
   bearing from the title block's Origin (07°13′S 35°53′W) to Paris.
   Run: npm test. */

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

mkdirSync(path.join("node_modules", ".cache"), { recursive: true });
const out = mkdtempSync(path.join("node_modules", ".cache", "geo-test-"));
execFileSync(process.execPath, [path.join("node_modules", "typescript", "bin", "tsc"), "content/geo.ts", "--outDir", out, "--module", "commonjs", "--target", "es2022", "--skipLibCheck"], { stdio: "inherit" });
const geo = createRequire(import.meta.url)(path.resolve(out, "geo.js"));
rmSync(out, { recursive: true, force: true });

test("initial great-circle bearing Origin → Paris rounds to 027°", () => {
  const exact = geo.initialBearing(geo.ORIGIN, geo.PARIS);
  assert.ok(exact > 26.5 && exact < 26.7, `expected ≈ 26.6°, got ${exact}`);
  assert.equal(geo.BEARING_TO_PARIS, 27);
  assert.equal(geo.bearingLabel(geo.BEARING_TO_PARIS), "027°");
});

test("great-circle distance Origin → Paris rounds to 7,259 km", () => {
  const exact = geo.greatCircleKm(geo.ORIGIN, geo.PARIS);
  // 7,259.38 km with Paris at 48.8566°N 2.3522°E and the IUGG mean radius
  assert.ok(exact > 7259 && exact < 7259.5, `expected ≈ 7,259.4 km, got ${exact}`);
  assert.equal(geo.KM_TO_PARIS, 7259);
  // independent check: d3-free spherical law of cosines agrees within 1 km
  const r = (d) => (d * Math.PI) / 180, o = geo.ORIGIN, p = geo.PARIS;
  const slc = geo.EARTH_RADIUS_KM * Math.acos(Math.sin(r(o.lat)) * Math.sin(r(p.lat)) + Math.cos(r(o.lat)) * Math.cos(r(p.lat)) * Math.cos(r(p.lon - o.lon)));
  assert.ok(Math.abs(slc - exact) < 1, `law of cosines ${slc} vs haversine ${exact}`);
});

test("known bearings from the same origin (sanity: London 023°, Rome 038°)", () => {
  assert.equal(Math.round(geo.initialBearing(geo.ORIGIN, { lat: 51.5074, lon: -0.1278 })), 23);
  assert.equal(Math.round(geo.initialBearing(geo.ORIGIN, { lat: 41.9028, lon: 12.4964 })), 38);
});

test("ORIGIN matches the title block's Origin coordinates", () => {
  const site = readFileSync("content/site.ts", "utf8");
  assert.ok(site.includes('dd: "07°13′S 35°53′W"'), "title block Origin changed — update content/geo.ts ORIGIN");
  assert.equal(geo.ORIGIN.lat, -(7 + 13 / 60));
  assert.equal(geo.ORIGIN.lon, -(35 + 53 / 60));
});
