"use client";

import { useEffect, useRef, useState } from "react";

/* The hero's first-load moment: the sheet is drafted like a real map.
   (s, from when the map data arrives) graticule 0–.6 · compass pivots on the
   Origin and sweeps arcs .3–1.05 · the pencil inks the coastlines .95–2.0 ·
   dividers step out the route 2.0–2.6 and stamp the distance · the great
   circle inks 2.45–2.95 and lands on the bearing label · instruments lift
   away · the drawing settles (3.25).

   Weight: the page only carries two empty, fixed-size containers. After the
   page has loaded (browser idle), the data for the current screen size is
   fetched from public/map/ (scripts/gen-map.mjs, Natural Earth, public
   domain) and drawn with React elements — so the map adds nothing to the
   HTML or the hydration payload, and nothing can shift layout.

   Static (no drafting): later loads this tab session (data-drawn), reduced
   motion, or a skip — the first scroll, wheel, tap, click or key press.
   Small screens: the figure sits below the fold, so it drafts (≈1.6 s) when
   it scrolls into view instead — scrolling there is no skip.
   Decorative throughout (aria-hidden): the title block states Origin and
   Bearing as text. */

type Pt = readonly [number, number];
type Desktop = {
  w: number; h: number; graticule: string[]; coast: string; route: string; origin: Pt; paris: Pt;
  compass: { r: number; sweep: [number, number]; arcs: string[] };
  pencil: Pt[];
  dividers: { span: number; steps: [number, number, number][] };
  distanceAt: Pt;
};
type Mobile = { w: number; h: number; graticule: string[]; coast: string; route: string; origin: Pt; paris: Pt };

const pct = (i: number, n: number) => `${((i / n) * 100).toFixed(2)}%`;

function keyframesFor(d: Desktop) {
  const pencil = d.pencil.map(([x, y], i) => `${pct(i, d.pencil.length - 1)}{transform:translate(${x}px,${y}px)}`).join("");
  const steps = d.dividers.steps
    .map(([x, y, a], i) => `${pct(i, d.dividers.steps.length - 1)}{transform:translate(${x}px,${y}px) rotate(${a}deg);animation-timing-function:cubic-bezier(.65,0,.35,1)}`)
    .join("");
  const [s0, s1] = d.compass.sweep;
  return (
    `@keyframes mdPencilPath{${pencil}}@keyframes mdDividerSteps{${steps}}` +
    `@keyframes mdCompassSweep{from{transform:rotate(${s0}deg)}to{transform:rotate(${s1}deg)}}` +
    `.mapdraft .md-compass-arm{transform-origin:${d.origin[0]}px ${d.origin[1]}px;transform:rotate(${s1}deg)}`
  );
}

function Labels({ x, y, km, bearing, anchor, kmAt }: { x: number; y: number; km: string; bearing: string; anchor: "start" | "end"; kmAt: Pt }) {
  return (
    <>
      <text className="md-label md-label--brg" x={x} y={y} textAnchor={anchor}>{bearing}</text>
      <text className="md-label md-label--km" x={kmAt[0]} y={kmAt[1]}>{km}</text>
    </>
  );
}

function DesktopMap({ d, km, bearing }: { d: Desktop; km: string; bearing: string }) {
  const { r } = d.compass;
  const half = d.dividers.span / 2;
  return (
    <svg viewBox={`0 0 ${d.w} ${d.h}`} preserveAspectRatio="xMaxYMin meet">
      <style>{keyframesFor(d)}</style>
      <g className="md-grat">{d.graticule.map((g, i) => <path key={i} d={g} pathLength={1} style={{ ["--i" as string]: i }} />)}</g>
      <g className="md-arcs">{d.compass.arcs.map((a, i) => <path key={i} d={a} pathLength={1} />)}</g>
      <path className="md-coast" d={d.coast} pathLength={1} />
      <path className="md-route" d={d.route} pathLength={1} />
      <circle className="md-pt" cx={d.origin[0]} cy={d.origin[1]} r={4} />
      <circle className="md-pt md-pt--paris" cx={d.paris[0]} cy={d.paris[1]} r={4} />
      <Labels x={d.paris[0] - 14} y={d.paris[1] - 16} anchor="end" km={km} bearing={bearing} kmAt={d.distanceAt} />

      <g className="md-tool md-tool--compass">
        <g className="md-compass-arm">
          <g transform={`translate(${d.origin[0]} ${d.origin[1]})`}>
            <path className="md-inst" d={`M0,0 L${r / 2},-74 L${r},0`} />
            <path className="md-inst md-inst--thin" d={`M${r / 2},-74 L${r / 2},-96`} />
            <circle className="md-inst md-inst--hinge" cx={r / 2} cy={-74} r={5} />
          </g>
        </g>
      </g>
      <g className="md-tool md-tool--pencil">
        <g className="md-pencil">
          <path className="md-inst md-inst--fill" d="M0,0 L9,-15 L52,-62 L60,-55 L17,-8 Z" />
          <path className="md-inst md-inst--thin" d="M9,-15 L17,-8 M44,-53 L52,-46" />
        </g>
      </g>
      <g className="md-tool md-tool--dividers">
        <g className="md-dividers">
          <path className="md-inst" d={`M${-half},0 L0,-60 L${half},0`} />
          <circle className="md-inst md-inst--hinge" cx={0} cy={-60} r={4} />
        </g>
      </g>
    </svg>
  );
}

function MobileMap({ m, km, bearing }: { m: Mobile; km: string; bearing: string }) {
  return (
    <svg viewBox={`0 0 ${m.w} ${m.h}`} preserveAspectRatio="xMidYMid meet">
      <g className="md-grat">{m.graticule.map((g, i) => <path key={i} d={g} pathLength={1} style={{ ["--i" as string]: i }} />)}</g>
      <path className="md-coast" d={m.coast} pathLength={1} />
      <path className="md-route" d={m.route} pathLength={1} />
      <circle className="md-pt" cx={m.origin[0]} cy={m.origin[1]} r={3} />
      <circle className="md-pt md-pt--paris" cx={m.paris[0]} cy={m.paris[1]} r={3} />
      <Labels
        x={m.paris[0] - 8} y={m.paris[1] - 10} anchor="end" km={km} bearing={bearing}
        kmAt={[(m.origin[0] + m.paris[0]) / 2 + 10, (m.origin[1] + m.paris[1]) / 2 + 4]}
      />
    </svg>
  );
}

const WIDE = "(min-width: 1100px)";

export default function MapDraft({ km, bearing }: { km: string; bearing: string }) {
  const [desktop, setDesktop] = useState<Desktop | null>(null);
  const [mobile, setMobile] = useState<Mobile | null>(null);
  const [still, setStill] = useState(false);
  const [inView, setInView] = useState(false);
  const fig = useRef<HTMLElement>(null);

  // load the data for this screen size once the page is idle
  useEffect(() => {
    const isStill = document.documentElement.hasAttribute("data-drawn") || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = matchMedia(WIDE).matches;
    let cancelled = false;
    const load = () =>
      fetch(`/map/${wide ? "desktop" : "mobile"}.json`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (cancelled || !data) return;
          setStill(isStill); // drawn at rest, no drafting
          if (wide) setDesktop(data);
          else setMobile(data);
        })
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

  // small screens: start drafting once the figure is in view
  useEffect(() => {
    if (!mobile || still || !fig.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(fig.current);
    return () => io.disconnect();
  }, [mobile, still]);

  // skippable (wide screens): the first scroll / wheel / tap / click / key press settles it
  useEffect(() => {
    if (still || !desktop) return;
    const events = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;
    const stop = () => events.forEach((e) => window.removeEventListener(e, skip));
    const skip = () => {
      for (const a of document.querySelector(".mapdraft")?.getAnimations({ subtree: true }) ?? []) a.finish();
      stop();
    };
    events.forEach((e) => window.addEventListener(e, skip, { passive: true, once: true }));
    const done = window.setTimeout(stop, 4000);
    return () => {
      stop();
      window.clearTimeout(done);
    };
  }, [still, desktop]);

  const cls = still ? " md-still" : "";
  return (
    <>
      <div className={`mapdraft${cls}`} aria-hidden="true">
        {desktop && <DesktopMap d={desktop} km={km} bearing={bearing} />}
      </div>
      <figure ref={fig} className={`mapfig${cls}${inView ? " md-inview" : ""}`} aria-hidden="true">
        {mobile && <MobileMap m={mobile} km={km} bearing={bearing} />}
      </figure>
    </>
  );
}
