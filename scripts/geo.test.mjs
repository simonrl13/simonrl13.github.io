/* The hero labels "BRG ≈025° → EUROPE" and "5,800–8,100 km" must hold for
   every candidate city from the title block's Origin (07°13′S 35°53′W).
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

const CITY_NAMES = ["Lisbon", "Madrid", "Paris", "London", "Dublin", "Amsterdam", "Berlin", "Zurich", "Stockholm"];

// 18.5–31.5° on the exact bearings is the same as 19–31° after rounding to whole
// degrees (how the label writes bearings), stated honestly: Dublin is 18.9°
// and Zurich 30.9°, so the band is ≈025° ± 6.5° rather than ± 6°.
test("every candidate city's exact initial bearing is within 18.5–31.5° (≈025°)", () => {
  assert.deepEqual(Object.keys(geo.CITIES).sort(), [...CITY_NAMES].sort());
  for (const name of CITY_NAMES) {
    const exact = geo.initialBearing(geo.ORIGIN, geo.CITIES[name]);
    assert.ok(exact >= 18.5 && exact <= 31.5, `${name}: ${exact.toFixed(2)}°, outside 18.5–31.5°`);
  }
  assert.equal(geo.BEARING_DEG, 25);
  assert.equal(geo.bearingLabel(geo.BEARING_DEG), "025°");
});

test("known bearings and distances (sanity: Paris 026.6° / 7,259 km, London 023°, Rome 038°)", () => {
  const paris = geo.CITIES.Paris;
  assert.ok(Math.abs(geo.initialBearing(geo.ORIGIN, paris) - 26.6) < 0.1);
  assert.ok(Math.abs(geo.greatCircleKm(geo.ORIGIN, paris) - 7259.4) < 0.5);
  assert.equal(Math.round(geo.initialBearing(geo.ORIGIN, geo.CITIES.London)), 23);
  assert.equal(Math.round(geo.initialBearing(geo.ORIGIN, { lat: 41.9028, lon: 12.4964 })), 38);
  // independent check: the spherical law of cosines agrees with haversine within 1 km
  const r = (d) => (d * Math.PI) / 180, o = geo.ORIGIN, p = paris;
  const slc = geo.EARTH_RADIUS_KM * Math.acos(Math.sin(r(o.lat)) * Math.sin(r(p.lat)) + Math.cos(r(o.lat)) * Math.cos(r(p.lat)) * Math.cos(r(p.lon - o.lon)));
  assert.ok(Math.abs(slc - geo.greatCircleKm(o, p)) < 1);
});

test("distance range is 5,800–8,100 km: Lisbon nearest, Berlin farthest of the search-area cities", () => {
  assert.deepEqual([...geo.KM_RANGE], [5800, 8100]);
  const kms = Object.fromEntries(geo.AREA_CITIES.map((n) => [n, geo.greatCircleKm(geo.ORIGIN, geo.CITIES[n])]));
  const sorted = Object.entries(kms).sort((x, y) => x[1] - y[1]);
  assert.equal(sorted[0][0], "Lisbon");
  assert.equal(sorted.at(-1)[0], "Berlin");
  // each end is its city's distance to the nearest 100 km (Lisbon 5,807, Berlin 8,106)
  assert.equal(Math.round(kms.Lisbon / 100) * 100, 5800);
  assert.equal(Math.round(kms.Berlin / 100) * 100, 8100);
  // Stockholm (8,791 km) is outside the search area and the range
  assert.ok(!geo.AREA_CITIES.includes("Stockholm") && geo.greatCircleKm(geo.ORIGIN, geo.CITIES.Stockholm) > 8150);
});

test("the search area encloses Lisbon to Berlin, not Stockholm", () => {
  assert.deepEqual(geo.AREA_CITIES, ["Lisbon", "Madrid", "Paris", "London", "Dublin", "Amsterdam", "Berlin", "Zurich"]);
});

test("ORIGIN matches the title block's Origin coordinates", () => {
  const site = readFileSync("content/site.ts", "utf8");
  assert.ok(site.includes('dd: "07°13′S 35°53′W"'), "title block Origin changed — update content/geo.ts ORIGIN");
  assert.equal(geo.ORIGIN.lat, -(7 + 13 / 60));
  assert.equal(geo.ORIGIN.lon, -(35 + 53 / 60));
});

test("great-circle ticker: starts on ORIGIN, in the title block's format; halfway point is equidistant", () => {
  const end = geo.CITIES.Paris;
  assert.equal(geo.formatLatLon(geo.intermediatePoint(geo.ORIGIN, end, 0)), "07°13′S 35°53′W");
  assert.equal(geo.formatLatLon(geo.intermediatePoint(geo.ORIGIN, end, 1)), "48°51′N 02°21′E");
  const mid = geo.intermediatePoint(geo.ORIGIN, end, 0.5);
  assert.ok(Math.abs(geo.greatCircleKm(geo.ORIGIN, mid) - geo.greatCircleKm(mid, end)) < 0.01);
});

test("the generated map carries no Paris end point and the tested labels", () => {
  for (const f of ["desktop", "mobile"]) {
    const m = JSON.parse(readFileSync(`public/map/${f}.json`, "utf8"));
    assert.equal(m.paris, undefined, `${f}.json still has a Paris point`);
    assert.ok(m.area && m.area.rx > 0 && m.area.ry > 0, `${f}.json: no search area`);
    assert.equal(m.meta.bearingDeg, 25);
    assert.deepEqual(m.meta.distanceKm, [5800, 8100]);
  }
});
