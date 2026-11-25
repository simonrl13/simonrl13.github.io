/* The hero's survey construction: Origin → somewhere in Western Europe.

   ORIGIN is the title block's "Origin" (07°13′S 35°53′W, content/site.ts).
   There is no end point: the route heads for a search area over Western
   Europe (Lisbon to Berlin, drawn by scripts/gen-map.mjs). The label shows
   an approximate INITIAL GREAT-CIRCLE BEARING ("≈025°": every candidate
   city's bearing is within 18.5–31.5°) and a distance RANGE across the
   search area (Lisbon to Berlin, each to the nearest 100 km), never one
   exact figure. Checked by scripts/geo.test.mjs. */

/** 07°13′S 35°53′W — must match the title block in content/site.ts. */
export const ORIGIN = { lat: -(7 + 13 / 60), lon: -(35 + 53 / 60) };

/** Candidate cities (city-centre coordinates). The first eight frame the search area and the distance range; Stockholm is in the bearing check only. */
export const CITIES = {
  Lisbon: { lat: 38.7223, lon: -9.1393 },
  Madrid: { lat: 40.4168, lon: -3.7038 },
  Paris: { lat: 48.8566, lon: 2.3522 },
  London: { lat: 51.5074, lon: -0.1278 },
  Dublin: { lat: 53.3498, lon: -6.2603 },
  Amsterdam: { lat: 52.3676, lon: 4.9041 },
  Berlin: { lat: 52.52, lon: 13.405 },
  Zurich: { lat: 47.3769, lon: 8.5417 },
  Stockholm: { lat: 59.3293, lon: 18.0686 },
} as const;
/** The cities the search-area ellipse must enclose (Lisbon to Berlin). */
export const AREA_CITIES = (Object.keys(CITIES) as (keyof typeof CITIES)[]).filter((c) => c !== "Stockholm");

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Initial great-circle bearing from a to b, in degrees clockwise from true north (0–360). */
export function initialBearing(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const dLon = rad(b.lon - a.lon);
  const y = Math.sin(dLon) * Math.cos(rad(b.lat));
  const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** The label's approximate bearing, whole degrees ("≈025°"; tested against every city). */
export const BEARING_DEG = 25;

/** "027°" — three digits, the way bearings are written. */
export const bearingLabel = (deg: number) => `${String(deg).padStart(3, "0")}°`;

/** Mean Earth radius, km (IUGG). */
export const EARTH_RADIUS_KM = 6371.0088;

/** Great-circle distance from a to b in km (haversine, spherical Earth). */
export function greatCircleKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** Distance range ORIGIN → the search-area cities, nearest and farthest each rounded to
 * the nearest 100 km ([5800, 8100]: Lisbon 5,807 to Berlin 8,106; tested). */
const kms = AREA_CITIES.map((c) => greatCircleKm(ORIGIN, CITIES[c]));
export const KM_RANGE = [Math.round(Math.min(...kms) / 100) * 100, Math.round(Math.max(...kms) / 100) * 100] as const;

/** The point a fraction f (0–1) of the way along the great circle a → b. */
export function intermediatePoint(a: { lat: number; lon: number }, b: { lat: number; lon: number }, f: number) {
  const d = greatCircleKm(a, b) / EARTH_RADIUS_KM;
  if (d === 0) return { ...a };
  const A = Math.sin((1 - f) * d) / Math.sin(d), B = Math.sin(f * d) / Math.sin(d);
  const x = A * Math.cos(rad(a.lat)) * Math.cos(rad(a.lon)) + B * Math.cos(rad(b.lat)) * Math.cos(rad(b.lon));
  const y = A * Math.cos(rad(a.lat)) * Math.sin(rad(a.lon)) + B * Math.cos(rad(b.lat)) * Math.sin(rad(b.lon));
  const z = A * Math.sin(rad(a.lat)) + B * Math.sin(rad(b.lat));
  const deg = (r: number) => (r * 180) / Math.PI;
  return { lat: deg(Math.atan2(z, Math.hypot(x, y))), lon: deg(Math.atan2(y, x)) };
}

/** "07°13′S 35°53′W" — the title block's format (whole minutes, truncated). */
export function formatLatLon({ lat, lon }: { lat: number; lon: number }): string {
  const part = (v: number, pos: string, neg: string) => {
    const m = Math.floor(Math.abs(v) * 60 + 1e-9);
    return `${String(Math.floor(m / 60)).padStart(2, "0")}°${String(m % 60).padStart(2, "0")}′${v < 0 ? neg : pos}`;
  };
  return `${part(lat, "N", "S")} ${part(lon, "E", "W")}`;
}
