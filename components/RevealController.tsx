"use client";

import { useEffect } from "react";

/* Lights up instruments (meters, ECG, XP bar), counts up vitals, and draws
   the section-head connectors as they scroll into view. When the visitor
   prefers reduced motion, connectors still resolve but nothing animates and
   no counters run — every value is already in its final state in the markup. */

function countUp(el: HTMLElement) {
  const numEl = el.querySelector<HTMLElement>(".vitals__n");
  if (!numEl) return;
  const target = Number(numEl.dataset.count);
  if (Number.isNaN(target)) return;
  const dur = 900;
  const start = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    numEl.textContent = Math.round(target * eased).toString();
    if (p < 1) requestAnimationFrame(tick);
    else numEl.textContent = String(target);
  };
  numEl.textContent = "0";
  requestAnimationFrame(tick);
}

export default function RevealController() {
  useEffect(() => {
    const allowMotion = !window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (allowMotion) document.body.classList.add("anim-ready");

    const targets = document.querySelectorAll<HTMLElement>(
      "[data-reveal], .sec-head",
    );

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("is-revealed");
          if (allowMotion && el.hasAttribute("data-count")) countUp(el);
          io.unobserve(el);
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return null;
}
