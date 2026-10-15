/* The hero's survey construction: Origin → Paris.

   ORIGIN is the title block's "Origin" (07°13′S 35°53′W, content/site.ts).
   The label shows the INITIAL GREAT-CIRCLE BEARING from ORIGIN to Paris —
   the compass direction you'd set off on along the shortest path over the
   globe (not a constant rhumb-line heading). Checked by
   scripts/geo.test.mjs: 026.6°, rounded to 027°. */

/** 07°13′S 35°53′W — must match the title block in content/site.ts. */
export const ORIGIN = { lat: -(7 + 13 / 60), lon: -(35 + 53 / 60) };
/** Paris, Notre-Dame point zéro area (48.8566°N, 2.3522°E). */
export const PARIS = { lat: 48.8566, lon: 2.3522 };

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Initial great-circle bearing from a to b, in degrees clockwise from true north (0–360). */
export function initialBearing(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const dLon = rad(b.lon - a.lon);
  const y = Math.sin(dLon) * Math.cos(rad(b.lat));
  const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Initial great-circle bearing ORIGIN → Paris, whole degrees (027). */
export const BEARING_TO_PARIS = Math.round(initialBearing(ORIGIN, PARIS));

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

/** Great-circle distance ORIGIN → Paris, whole km (7,259; tested). */
export const KM_TO_PARIS = Math.round(greatCircleKm(ORIGIN, PARIS));

