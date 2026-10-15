/* Generates public/map/desktop.json and public/map/mobile.json — the hero's
   drafted map, as ready-made SVG paths. Run: npm run gen:map (only when the geography or framing changes;
   the output is committed, so builds and visitors never need these packages).

   Map data: Natural Earth (naturalearthdata.com), 1:110m land — public
   domain — via the world-atlas package (TopoJSON). d3-geo projects it;
   topojson-client decodes it. All three are devDependencies: nothing here
   ships to the browser except the generated path strings.

   ORIGIN, PARIS, the bearing and the distance come from content/geo.ts
   (tested in scripts/geo.test.mjs), so the drawing and the labels agree. */

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { geoGraticule, geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);

// --- the tested geography from content/geo.ts ---
mkdirSync(path.join("node_modules", ".cache"), { recursive: true });
const tmp = mkdtempSync(path.join("node_modules", ".cache", "gen-map-"));
execFileSync(process.execPath, [path.join("node_modules", "typescript", "bin", "tsc"), "content/geo.ts", "--outDir", tmp, "--module", "commonjs", "--target", "es2022", "--skipLibCheck"], { stdio: "inherit" });
const geo = require(path.resolve(tmp, "geo.js"));
rmSync(tmp, { recursive: true, force: true });

const land = feature(
  JSON.parse(readFileSync(require.resolve("world-atlas/land-110m.json"), "utf8")),
  "land",
);

// framing. desktop: a route map (the Brazilian bulge to France) that fits the
// hero's empty top-right area; mobile: the wider South America–Atlantic–Europe view
const EXTENT_DESKTOP = { type: "MultiPoint", coordinates: [[-50, -14], [14, -14], [14, 56], [-50, 56]] };
const EXTENT_MOBILE = { type: "MultiPoint", coordinates: [[-62, -24], [24, -24], [24, 60], [-62, 60]] };

const round = (n) => Math.round(n * 10) / 10;

/** Path string -> rings of [x, y] (geoPath emits only M / L / Z). */
function rings(d) {
  const out = [];
  for (const part of d.split("M").slice(1)) {
    const closed = part.trim().endsWith("Z");
    const pts = part.replace(/Z/g, "").split("L").map((p) => p.split(",").map(Number));
    out.push({ pts, closed });
  }
  return out;
}

/** Douglas–Peucker in projected units. */
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  let max = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const dist = Math.abs(dy * x - dx * y + b[0] * a[1] - b[1] * a[0]) / len;
    if (dist > max) { max = dist; idx = i; }
  }
  if (max <= tol) return [a, b];
  return [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)];
}

/** Rings often start and end on the same point, which gives Douglas–Peucker a
 * zero-length baseline (everything collapses): split at the point farthest
 * from the start and simplify the two halves. */
function simplifyRing(pts, tol) {
  if (pts.length < 4) return pts;
  let far = 1, best = -1;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1]);
    if (d > best) { best = d; far = i; }
  }
  return [...simplify(pts.slice(0, far + 1), tol).slice(0, -1), ...simplify(pts.slice(far), tol)];
}

const ringLength = (pts) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
const toD = (rs) => rs.map((r) => "M" + r.pts.map((p) => `${round(p[0])},${round(p[1])}`).join("L") + (r.closed ? "Z" : "")).join("");

/** Evenly spaced samples along a list of polylines (pen lifts between them). */
function sample(polys, n) {
  const segs = [];
  for (const pts of polys) for (let i = 1; i < pts.length; i++) segs.push([pts[i - 1], pts[i]]);
  const total = segs.reduce((s, [a, b]) => s + Math.hypot(b[0] - a[0], b[1] - a[1]), 0);
  const out = [];
  let si = 0, acc = 0;
  for (let k = 0; k <= n; k++) {
    const target = (total * k) / n;
    while (si < segs.length - 1 && acc + Math.hypot(segs[si][1][0] - segs[si][0][0], segs[si][1][1] - segs[si][0][1]) < target) {
      acc += Math.hypot(segs[si][1][0] - segs[si][0][0], segs[si][1][1] - segs[si][0][1]);
      si++;
    }
    const [a, b] = segs[si];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const t = Math.min(1, Math.max(0, (target - acc) / len));
    out.push([round(a[0] + (b[0] - a[0]) * t), round(a[1] + (b[1] - a[1]) * t)]);
  }
  return out;
}

function build({ w, h, pad, tol, minRing, graticuleStep, extent }) {
  const projection = geoMercator().fitExtent([[pad, pad], [w - pad, h - pad]], extent).clipExtent([[0, 0], [w, h]]);
  const pathOf = geoPath(projection);

  // coastlines: biggest rings first, small islands dropped, simplified
  const coastRings = rings(pathOf(land))
    .map((r) => ({ ...r, pts: simplifyRing(r.pts, tol) }))
    .filter((r) => ringLength(r.pts) >= minRing)
    .sort((a, b) => ringLength(b.pts) - ringLength(a.pts));

  // graticule, one path per line so they can be ruled in turn
  const graticule = geoGraticule().step(graticuleStep).extent([[-90, -60], [40, 75]]).lines()
    .map((l) => pathOf(l))
    .filter(Boolean)
    .map((d) => toD(rings(d)));

  // the great-circle route (d3 resamples LineStrings along great circles)
  const origin = projection([geo.ORIGIN.lon, geo.ORIGIN.lat]).map(round);
  const paris = projection([geo.PARIS.lon, geo.PARIS.lat]).map(round);
  const routeRings = rings(pathOf({ type: "LineString", coordinates: [[geo.ORIGIN.lon, geo.ORIGIN.lat], [geo.PARIS.lon, geo.PARIS.lat]] }));
  const routePts = routeRings.flatMap((r) => r.pts);

  return { w, h, projection, coastRings, graticule, origin, paris, routeRings, routePts };
}

// ---------- desktop: full drawing with instruments ----------
const D = build({ w: 1000, h: 800, pad: 30, tol: 0.8, minRing: 24, graticuleStep: [10, 10], extent: EXTENT_DESKTOP });

// compass: pivots on the origin; its pencil leg sweeps two arcs centred on the
// route's initial heading on screen
const [o0, o1] = [D.routePts[0], D.routePts[Math.min(4, D.routePts.length - 1)]];
const heading = (Math.atan2(o1[1] - o0[1], o1[0] - o0[0]) * 180) / Math.PI; // screen degrees, 0 = +x
const arc = (r, a0, a1) => {
  const p = (a) => [D.origin[0] + r * Math.cos((a * Math.PI) / 180), D.origin[1] + r * Math.sin((a * Math.PI) / 180)];
  const [s, e] = [p(a0), p(a1)];
  return `M${round(s[0])},${round(s[1])}A${r},${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${round(e[0])},${round(e[1])}`;
};
const COMPASS_R = 120;
const compass = {
  r: COMPASS_R,
  // rotation (deg) of the compass group about the origin: sweep start → end
  sweep: [round(heading - 70), round(heading + 50)],
  arcs: [arc(COMPASS_R, heading - 70, heading + 50), arc(COMPASS_R * 0.55, heading - 40, heading + 30)],
};

// pencil: follows the coastlines in drawing order (pen lifts between rings)
const pencil = sample(D.coastRings.map((r) => r.pts), 72);

// dividers: step out the route in 6 equal chords
const STEPS = 6;
const stepPts = sample([D.routePts], STEPS);
const chords = stepPts.slice(1).map((p, i) => {
  const a = stepPts[i];
  return { x: round((a[0] + p[0]) / 2), y: round((a[1] + p[1]) / 2), angle: round((Math.atan2(p[1] - a[1], p[0] - a[0]) * 180) / Math.PI), len: Math.hypot(p[0] - a[0], p[1] - a[1]) };
});
const dividers = { span: round(chords.reduce((s, c) => s + c.len, 0) / chords.length), steps: chords.map(({ x, y, angle }) => [x, y, angle]) };

// label anchors
const mid = D.routePts[Math.floor(D.routePts.length / 2)];
const desktop = {
  w: D.w, h: D.h,
  graticule: D.graticule,
  coast: toD(D.coastRings),
  route: toD(D.routeRings),
  origin: D.origin,
  paris: D.paris,
  compass,
  pencil,
  dividers,
  distanceAt: [round(mid[0] + 50), round(mid[1] + 6)],
};

// ---------- mobile: simplified map + route, no instruments ----------
const M = build({ w: 600, h: 400, pad: 14, tol: 1.6, minRing: 40, graticuleStep: [20, 20], extent: EXTENT_MOBILE });
const mobile = { w: M.w, h: M.h, graticule: M.graticule, coast: toD(M.coastRings), route: toD(M.routeRings), origin: M.origin, paris: M.paris };

// Output: static JSON in public/map/, fetched by components/MapDraft.tsx only
// for the current screen size, after the page has loaded — so the map never
// weighs on the HTML (or Next's hydration payload). "meta" records where the
// data comes from (Natural Earth, public domain) and the tested geography.
const meta = {
  source: "Natural Earth 1:110m land (naturalearthdata.com), public domain, via world-atlas; projected with d3-geo (Mercator) by scripts/gen-map.mjs",
  bearingDeg: geo.BEARING_TO_PARIS,
  distanceKm: geo.KM_TO_PARIS,
};
mkdirSync("public/map", { recursive: true });
writeFileSync("public/map/desktop.json", JSON.stringify({ meta, ...desktop }));
writeFileSync("public/map/mobile.json", JSON.stringify({ meta, ...mobile }));

// shipped-size report: the JSON files as served (one per screen size)
const { gzipSync } = await import("node:zlib");
const size = (o) => {
  const s = JSON.stringify({ meta, ...o });
  return `${(Buffer.byteLength(s) / 1024).toFixed(1)} KB raw, ${(gzipSync(s).length / 1024).toFixed(1)} KB gzip`;
};
console.log(`desktop: ${size(desktop)}  (coast rings ${D.coastRings.length}, graticule ${D.graticule.length}, pencil ${pencil.length} pts)`);
console.log(`mobile:  ${size(mobile)}  (coast rings ${M.coastRings.length}, graticule ${M.graticule.length})`);
console.log(`bearing ${geo.BEARING_TO_PARIS}°, distance ${geo.KM_TO_PARIS} km, screen heading ${round(heading)}°`);
