"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ORIGIN, PARIS, formatLatLon, intermediatePoint } from "@/content/geo";

/* The hero's first-load moment: the sheet is drafted like a real map of the
   world being made (behind the hero on wide screens): the graticule is
   ruled · a compass pivots on the Origin and sweeps its arcs · the pencil
   inks the coastlines outward from Campina Grande — slow on detailed coasts,
   quick on long straight runs, lifting between strokes · dividers step out
   the route and stamp the distance · the great circle inks and lands on the
   bearing label · the instruments lift away and the drawing settles faint.
   Phones (≈4 s): the same drawing, pencil only, when the figure scrolls in.

   Wide screens (variant C, ≈11.7 s — prototype): A's pencil pacing and
   pen-lifts at a slower tempo, filmed by a camera that follows the pencil
   and lingers where it lingers — close on the Origin and the compass, a
   slow drift up the Brazilian coast, a long pull back across the Atlantic,
   then Europe; the whole map is in view before the dividers. Bold ink that
   fades to the background only at the end, hand-drawn texture (line-weight
   variation, overshooting construction lines, pencil grain) and a climax
   (coordinates tick along the route, the bearing label stamps).

   Weight: the page only carries two empty, fixed-size containers. After the
   page has loaded (browser idle), the data for the current screen size is
   fetched from public/map/ (scripts/gen-map.mjs, Natural Earth, public
   domain) and drawn with React elements; the motion is a Web Animations
   timeline built from the vertices. Nothing can shift layout.

   Static (the finished drawing, no drafting): later loads this tab session
   (data-drawn), reduced motion, or a skip — any click, tap, key press or
   scroll (on phones: scrolling the figure out of view) finishes it at once.
   Decorative throughout (aria-hidden): the title block states Origin and
   Bearing as text. */

type Pt = readonly [number, number];
type MapData = {
  w: number; h: number; graticule: string[]; coast: string[]; route: string; origin: Pt; paris: Pt;
  // wide screens only
  compass?: { r: number; sweep: [number, number]; arcs: string[] };
  dividers?: { span: number; steps: [number, number, number][] };
  distanceAt?: Pt;
};

const EASE = "cubic-bezier(.22, 1, .36, 1)"; // --ease
const IN_OUT = "cubic-bezier(.65, 0, .35, 1)";
const WIDE = "(min-width: 1100px)";

/** Generated paths use only M / L / Z: rings of points, closed back to the start. */
const points = (d: string): Pt[] => {
  const pts = d.replace(/Z/g, "").split(/[ML]/).filter(Boolean).map((p) => p.split(",").map(Number) as unknown as Pt);
  return d.trim().endsWith("Z") ? [...pts, pts[0]] : pts;
};
const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const tr = (p: Pt) => `translate(${p[0].toFixed(1)}px, ${p[1].toFixed(1)}px)`;

/** A deterministic, slight weight change per stroke (wide screens). */
const weight = (i: number) => 1.1 + ((i * 37) % 9) / 10;

function Drawing({ d, wide, km, bearing }: { d: MapData; wide: boolean; km: string; bearing: string }) {
  const b = wide; // the full treatment (camera, bold ink, texture, climax) is wide-only
  const [ox, oy] = d.origin, [px, py] = d.paris;
  const r = d.compass?.r ?? 0;
  const half = (d.dividers?.span ?? 0) / 2;
  const s = wide ? 1 : 0.55; // label / instrument scale on the phone viewBox
  const over = 24 * s; // construction lines overshoot their points
  const ux = (px - ox) / dist(d.origin, d.paris), uy = (py - oy) / dist(d.origin, d.paris);
  const kmAt = d.distanceAt ?? [(ox + px) / 2 + 10, (oy + py) / 2 + 4];
  return (
    <svg viewBox={`0 0 ${d.w} ${d.h}`} preserveAspectRatio={wide ? "xMaxYMin meet" : "xMidYMid meet"} className={b ? "md-b" : undefined}>
      {b && (
        <defs>
          {/* the camera's frame: zoomed line work never spills outside the map */}
          <clipPath id="md-frame"><rect width={d.w} height={d.h} /></clipPath>
          <pattern id="md-grain" width="5" height="5" patternUnits="userSpaceOnUse">
            <rect className="md-grain-ink" width="5" height="5" />
            <rect className="md-grain-gap" x="1" y="0" width="1" height="1" />
            <rect className="md-grain-gap" x="3.4" y="1.8" width="1.1" height="0.9" />
            <rect className="md-grain-gap" x="0.2" y="3.6" width="0.9" height="1" />
            <rect className="md-grain-gap" x="2.6" y="4.1" width="1" height="0.8" />
          </pattern>
        </defs>
      )}
      <g clipPath={b ? "url(#md-frame)" : undefined}>
      <g className="md-cam">
        <g className="md-grat">{d.graticule.map((g, i) => <path key={i} d={g} pathLength={1} />)}</g>
        {d.compass && <g className="md-arcs">{d.compass.arcs.map((a, i) => <path key={i} d={a} pathLength={1} />)}</g>}
        {b && (
          <g className="md-con">
            <path className="md-con--o" d={`M${ox - 60 * s},${oy}L${ox + 60 * s},${oy}M${ox},${oy - 60 * s}L${ox},${oy + 60 * s}`} pathLength={1} />
            <path className="md-con--chord" d={`M${ox - ux * over},${oy - uy * over}L${px + ux * over},${py + uy * over}`} pathLength={1} />
            <path className="md-con--p" d={`M${px - 44 * s},${py}L${px + 44 * s},${py}M${px},${py - 44 * s}L${px},${py + 44 * s}`} pathLength={1} />
          </g>
        )}
        <g className="md-coast">
          {d.coast.map((c, i) => <path key={i} d={c} pathLength={1} style={b ? ({ "--w": weight(i) } as CSSProperties) : undefined} />)}
        </g>
        <path className="md-route" d={d.route} pathLength={1} />
        <circle className="md-pt md-pt--origin" cx={ox} cy={oy} r={4 * s + 1} />
        <circle className="md-splash" cx={px} cy={py} r={6 * s} />
        <circle className="md-pt md-pt--paris" cx={px} cy={py} r={4 * s + 1} />
        <text className="md-label md-label--brg" x={px - 14 * s} y={py - 16 * s} textAnchor="end">{bearing}</text>
        {b && <text className="md-label md-label--coords" x={px - 14 * s} y={py - 50 * s} textAnchor="end">{formatLatLon(PARIS)}</text>}
        <text className="md-label md-label--km" x={kmAt[0]} y={kmAt[1]}>{km}</text>

        {d.compass && (
          <g className="md-tool md-tool--compass">
            <g className="md-compass-arm" style={{ transformOrigin: `${ox}px ${oy}px`, transform: `rotate(${d.compass.sweep[1]}deg)` }}>
              <g transform={`translate(${ox} ${oy})`}>
                <path className="md-inst" d={`M0,0 L${r / 2},-74 L${r},0`} />
                <path className="md-inst md-inst--thin" d={`M${r / 2},-74 L${r / 2},-96`} />
                <circle className="md-inst md-inst--hinge" cx={r / 2} cy={-74} r={5} />
              </g>
            </g>
          </g>
        )}
        <g className="md-tool md-tool--pencil">
          <g className="md-pencil">
            <g className="md-pencil-lift">
              <g transform={wide ? undefined : "scale(.6)"}>
                <path className="md-inst md-inst--fill" d="M0,0 L9,-15 L52,-62 L60,-55 L17,-8 Z" />
                <path className="md-inst md-inst--thin" d="M9,-15 L17,-8 M44,-53 L52,-46" />
              </g>
            </g>
          </g>
        </g>
        {d.dividers && (
          <g className="md-tool md-tool--dividers">
            <g className="md-dividers">
              <path className="md-inst" d={`M${-half},0 L0,-60 L${half},0`} />
              <circle className="md-inst md-inst--hinge" cx={0} cy={-60} r={4} />
            </g>
          </g>
        )}
      </g>
      </g>
    </svg>
  );
}

/** Builds the drafting timeline (seconds) as Web Animations, all fill "both":
 * before its start each piece is blank, after its end it's the resting style. */
function draft(svg: SVGSVGElement, d: MapData, wide: boolean) {
  const b = wide;
  const anims: Animation[] = [];
  const $ = (sel: string) => svg.querySelector<SVGElement>(sel);
  const $$ = (sel: string) => [...svg.querySelectorAll<SVGElement>(sel)];
  const go = (el: Element | null, kf: Keyframe[], at: number, dur: number, easing = EASE) => {
    if (el) anims.push(el.animate(kf, { delay: at * 1000, duration: dur * 1000, easing, fill: "both" }));
  };
  const ink = (el: Element | null, at: number, dur: number, easing = EASE) => go(el, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], at, dur, easing);
  const pop = (el: Element | null, at: number) => go(el, [{ opacity: 0, transform: "scale(.6)" }, { opacity: 1, transform: "none" }], at, 0.3);
  const tool = (el: Element | null, from: number, to: number) =>
    go(el, [
      { opacity: 0, transform: "translateY(-6px)" },
      { opacity: 1, transform: "none", offset: Math.min(0.3, 0.25 / (to - from)) },
      { opacity: 1, transform: "none", offset: 1 - Math.min(0.3, 0.3 / (to - from)) },
      { opacity: 0, transform: "translateY(-14px)" },
    ], from, to - from);

  // the schedule (s): wide (C) ≈ 11.7 — A's pacing at 3.6/6.0 of the speed,
  // so the close-up never races; phone (A) ≈ 4. compass: in, out, sweep, sweep length, inner arc
  const T = wide
    ? { grat: 0, gratDur: 0.4, gratStep: 0.035, origin: 0.4, compass: [0.55, 2.6, 0.9, 1.1, 2.0], coast: 2.5, coastDur: 6.0, dividers: 9.0, route: 9.9, routeDur: 0.8, settle: 11.2 }
    : { grat: 0, gratDur: 0.25, gratStep: 0.025, origin: 0.3, compass: [0, 0, 0, 0, 0], coast: 0.6, coastDur: 2.2, dividers: 2.8, route: 2.95, routeDur: 0.6, settle: 3.7 };

  // 1. graticule, ruled line by line
  $$(".md-grat path").forEach((p, i) => ink(p, T.grat + i * T.gratStep, T.gratDur));
  pop($(".md-pt--origin"), T.origin);
  if (b) ink($(".md-con--o"), T.origin + 0.05, 0.3);

  // 2. compass: pivots on the Origin, sweeps the outer arc, inks the inner one
  if (d.compass) {
    const [s0, s1] = d.compass.sweep;
    const [cIn, cOut, sweep, sweepDur, inn] = T.compass;
    tool($(".md-tool--compass"), cIn, cOut);
    go($(".md-compass-arm"), [{ transform: `rotate(${s0}deg)` }, { transform: `rotate(${s1}deg)` }], sweep, sweepDur, IN_OUT);
    const [outer, inner] = $$(".md-arcs path");
    ink(outer, sweep, sweepDur, IN_OUT);
    ink(inner, inn, 0.4);
  }

  // 3. the pencil inks the coastlines. Each segment costs its length plus a
  // dwell per vertex (detailed coasts are slow, long straight runs quick);
  // between rings the pencil lifts and travels. Scaled to fit coastDur.
  const DWELL = wide ? 7 : 5, LIFT = wide ? 34 : 24, AIR = 0.45;
  const rings = d.coast.map(points);
  type Step = { p: Pt; cost: number; lift?: boolean };
  const steps: Step[] = [];
  let total = 0;
  rings.forEach((pts, ri) => {
    if (ri > 0) { total += LIFT + dist(pts[0], rings[ri - 1].at(-1)!) * AIR; steps.push({ p: pts[0], cost: total, lift: true }); }
    else steps.push({ p: pts[0], cost: 0 });
    for (let i = 1; i < pts.length; i++) { total += dist(pts[i - 1], pts[i]) + DWELL; steps.push({ p: pts[i], cost: total }); }
  });
  const timeOf = (cost: number) => T.coast + (cost / total) * T.coastDur;
  // ink: one animation per ring, keyed to its own vertices
  const coastPaths = $$(".md-coast path");
  let k = 0;
  rings.forEach((pts, ri) => {
    const seg = steps.slice(k, k + pts.length);
    k += pts.length;
    const lens = pts.map((_, i) => (i ? dist(pts[i - 1], pts[i]) : 0));
    const len = lens.reduce((a, x) => a + x, 0) || 1;
    const c0 = seg[0].cost, c1 = seg.at(-1)!.cost, span = c1 - c0 || 1;
    let acc = 0;
    const kf = seg.map((st, i) => ((acc += lens[i]), { offset: (st.cost - c0) / span, strokeDashoffset: 1 - acc / len }));
    go(coastPaths[ri], kf, timeOf(c0), timeOf(c1) - timeOf(c0), "linear");
  });
  // pencil: follows the same steps; lifts (raised, a touch larger) between rings
  const coastEnd = T.coast + T.coastDur;
  go($(".md-pencil"), steps.map((st) => ({ offset: st.cost / total, transform: tr(st.p) })), T.coast, T.coastDur, "linear");
  const lift: Keyframe[] = [{ offset: 0, transform: "none" }];
  steps.forEach((st, i) => {
    if (!st.lift) return;
    const a = steps[i - 1].cost / total, z = st.cost / total, m = (z - a) * 0.3;
    lift.push({ offset: a, transform: "none" }, { offset: a + m, transform: "translate(5px, -10px) scale(1.06)" }, { offset: z - m, transform: "translate(5px, -10px) scale(1.06)" }, { offset: z, transform: "none" });
  });
  lift.push({ offset: 1, transform: "none" });
  go($(".md-pencil-lift"), lift, T.coast, T.coastDur, "linear");
  tool($(".md-tool--pencil"), T.coast - 0.2, coastEnd + 0.3);

  // 4. dividers step out the route and stamp the distance
  if (d.dividers) {
    const st = d.dividers.steps;
    tool($(".md-tool--dividers"), T.dividers, T.dividers + 1.3);
    go($(".md-dividers"), st.map(([x, y, a], i) => ({ offset: i / (st.length - 1), transform: `translate(${x}px, ${y}px) rotate(${a}deg)`, easing: IN_OUT })), T.dividers + 0.1, 0.7, "linear");
  }
  go($(".md-label--km"), [{ opacity: 0, transform: "scale(1.08)" }, { opacity: 1, transform: "none" }], d.dividers ? T.dividers + 0.8 : T.route + 0.3, 0.16);
  if (b) { ink($(".md-con--chord"), T.dividers + 0.1, 0.35); ink($(".md-con--p"), T.dividers + 0.3, 0.3); }

  // 5. the great circle inks in and lands on the bearing label
  const route = $(".md-route");
  ink(route, T.route, T.routeDur, b ? IN_OUT : EASE);
  pop($(".md-pt--paris"), T.route + T.routeDur - 0.05);
  const land = T.route + T.routeDur;
  if (!b) {
    go($(".md-label--brg"), [{ opacity: 0, translate: "0 3px" }, { opacity: 1, translate: "0 0" }], land, 0.25);
  } else {
    // climax: the label stamps down, a ring of ink, the sheet takes the hit
    go($(".md-label--brg"), [{ opacity: 0, transform: "scale(1.4)" }, { opacity: 1, transform: "scale(.96)", offset: 0.65 }, { opacity: 1, transform: "none" }], land, 0.24, "cubic-bezier(.5, 0, .75, 0)");
    go($(".md-splash"), [{ opacity: 0, transform: "scale(1)" }, { opacity: 0.9, transform: "scale(1)", offset: 0.01 }, { opacity: 0, transform: "scale(5)" }], land + 0.15, 0.5, EASE);
    go(svg, [{ translate: "0 0" }, { translate: "0 2px", offset: 0.3 }, { translate: "0 0" }], land + 0.15, 0.2, EASE);
    go($(".md-label--coords"), [{ opacity: 0 }, { opacity: 1 }], T.route, 0.2);
    // bold while drawing (foreground ink, full strength); the faint brass
    // background only at the end
    go($(".md-coast"), [{ opacity: 1 }, { opacity: 0.75 }], T.settle, 0.5);
    go($(".md-grain-ink"), [{ fill: "var(--paper)" }, { fill: "var(--brass)" }], T.settle, 0.5);
  }

  // 6. settle: the drawing fades back behind the hero (wide)
  if (wide) go(svg, [{ opacity: 1 }, { opacity: 0.7 }], T.settle, 0.5);

  // the camera (wide): follows the pencil and lingers where it lingers. Its
  // zoom is keyed to the drawing's stages (by cost, so the drawing sets the
  // pace): close on the Origin and compass, drifting up the Brazilian coast
  // (ring 0), a long pull back across the Atlantic into Africa (ring 1),
  // Europe (to ring 4), then the whole map before the dividers. Centre and
  // zoom trail their targets through a two-stage low-pass, so the camera
  // settles where the pencil dwells and glides over its lifts. Transform on
  // the SVG group only, clipped to the map.
  if (b) {
    const W = d.w, H = d.h, FPS = 30, end = T.dividers, N = Math.round(end * FPS);
    const times = steps.map((st) => timeOf(st.cost));
    const posAt = (t: number): Pt => {
      if (t < T.coast) return d.origin;
      const i = times.findIndex((x) => x >= t);
      if (i <= 0) return i < 0 ? steps.at(-1)!.p : steps[0].p;
      const f = (t - times[i - 1]) / (times[i] - times[i - 1] || 1), [a, z] = [steps[i - 1].p, steps[i].p];
      return [a[0] + (z[0] - a[0]) * f, a[1] + (z[1] - a[1]) * f];
    };
    // zoom by stage: [cost fraction, scale]
    let n0 = 0;
    const ringEnd = rings.map((pts) => steps[(n0 += pts.length) - 1].cost / total);
    const stops: [number, number][] = [[0, 2.9], [ringEnd[0], 2.4], [ringEnd[1], 1.6], [ringEnd[Math.min(4, rings.length - 1)], 1.35], [1, 1]];
    const zoomAt = (t: number) => {
      if (t < T.coast) return 3;
      const p = Math.min(1, (t - T.coast) / T.coastDur);
      const i = stops.findIndex(([q]) => q >= p);
      if (i <= 0) return stops[0][1];
      const [[p0, z0], [p1, z1]] = [stops[i - 1], stops[i]];
      return z0 + (z1 - z0) * ((p - p0) / (p1 - p0 || 1));
    };
    const lag = (tau: number) => 1 - Math.exp(-1 / FPS / tau);
    const [aC, aS] = [lag(0.35), lag(0.6)];
    let [x1, y1] = d.origin, [x2, y2] = d.origin, s1 = 3, s2 = 3;
    const kf: Keyframe[] = [];
    for (let n = 0; n <= N; n++) {
      const t = n / FPS;
      const [x, y] = posAt(t), sc = zoomAt(t);
      x1 += (x - x1) * aC; y1 += (y - y1) * aC; x2 += (x1 - x2) * aC; y2 += (y1 - y2) * aC;
      s1 += (sc - s1) * aS; s2 += (s1 - s2) * aS;
      // last stretch: ease into the whole map, exactly identity at the end
      const e = Math.min(1, Math.max(0, (t - (end - 0.8)) / 0.8)), w = e * e * (3 - 2 * e);
      const S = s2 + (1 - s2) * w;
      const tx = Math.min(0, Math.max(W - S * W, W / 2 - S * x2)) * (1 - w);
      const ty = Math.min(0, Math.max(H - S * H, H / 2 - S * y2)) * (1 - w);
      kf.push({ offset: n / N, transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${S.toFixed(3)})` });
    }
    go($(".md-cam"), kf, 0, end, "linear");
  }

  // coordinates tick along the great circle while the route inks
  let raf = 0;
  const coords = b ? svg.querySelector(".md-label--coords") : null;
  const routeAnim = anims.find((a) => (a.effect as KeyframeEffect).target === route);
  if (coords && routeAnim) {
    let last = "";
    const tick = () => {
      const f = routeAnim.playState === "finished" ? 1 : (routeAnim.effect!.getComputedTiming().progress ?? 0);
      const text = formatLatLon(intermediatePoint(ORIGIN, PARIS, f));
      if (text !== last) coords.textContent = last = text;
      if (f < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  return { anims, stop: () => cancelAnimationFrame(raf) };
}

export default function MapDraft({ km, bearing }: { km: string; bearing: string }) {
  const [data, setData] = useState<{ d: MapData; wide: boolean; still: boolean } | null>(null);
  const host = useRef<HTMLDivElement>(null);
  const fig = useRef<HTMLElement>(null);

  // load the data for this screen size once the page is idle
  useEffect(() => {
    const still = document.documentElement.hasAttribute("data-drawn") || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = matchMedia(WIDE).matches;
    let cancelled = false;
    const load = () =>
      fetch(`/map/${wide ? "desktop" : "mobile"}.json`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => { if (!cancelled && d) setData({ d, wide, still }); })
        .catch(() => {}); // decorative: no map is fine
    const start = () => {
      if ("requestIdleCallback" in window) requestIdleCallback(load, { timeout: 1200 });
      else setTimeout(load, 200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
    };
  }, []);

  // build the timeline before the drawing's first paint, so it starts blank
  useLayoutEffect(() => {
    const svg = data && (data.wide ? host.current : fig.current)?.querySelector("svg");
    if (!data || !svg) return;
    // stroke unit: viewBox units per CSS px (meet: the tighter axis). ponytail: set once, not on resize
    svg.style.setProperty("--u", Math.max(data.d.w / svg.clientWidth, data.d.h / svg.clientHeight).toFixed(3));
    if (data.still) return;
    const root = document.documentElement;
    const { anims, stop } = draft(svg, data.d, data.wide);
    const finish = () => {
      if (root.classList.contains("md-wait")) root.classList.add("md-skip");
      anims.forEach((a) => a.playState !== "finished" && a.finish());
    };

    // the title block's stamps (signature, then AS-BUILT) wait for the drawing
    // (unless they already landed); a skip shows them stamped at once
    if ((document.timeline.currentTime as number) < 2800) root.classList.add("md-wait");
    let live = true;
    Promise.all(anims.map((a) => a.finished)).then(
      () => { if (live && root.classList.contains("md-wait")) { root.classList.remove("md-wait"); root.classList.add("md-landed"); } },
      () => {},
    );

    // skip: wide — any click, tap, key, wheel or scroll; phone — a tap, click
    // or key, or scrolling the figure out of view (it starts when scrolled in)
    const events = data.wide ? (["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const) : (["pointerdown", "keydown"] as const);
    const arm = () => events.forEach((e) => window.addEventListener(e, finish, { passive: true, once: true }));
    let io: IntersectionObserver | undefined;
    if (data.wide) arm();
    else {
      anims.forEach((a) => a.pause());
      let started = false;
      io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !started) { started = true; anims.forEach((a) => a.play()); arm(); }
        else if (!e.isIntersecting && started) { finish(); io?.disconnect(); }
      }, { threshold: 0.5 });
      io.observe(fig.current!);
    }
    return () => {
      live = false;
      stop();
      io?.disconnect();
      events.forEach((e) => window.removeEventListener(e, finish));
      anims.forEach((a) => a.cancel());
      root.classList.remove("md-wait");
    };
  }, [data]);

  return (
    <>
      <div ref={host} className="mapdraft" aria-hidden="true">
        {data?.wide && <Drawing d={data.d} wide km={km} bearing={bearing} />}
      </div>
      <figure ref={fig} className="mapfig" aria-hidden="true">
        {data && !data.wide && <Drawing d={data.d} wide={false} km={km} bearing={bearing} />}
      </figure>
    </>
  );
}
