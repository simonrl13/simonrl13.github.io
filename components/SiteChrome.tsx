"use client";

import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const RAIL_NODES = [
  { target: "origin", ref: "01", label: "Origin", at: "11%" },
  { target: "journey", ref: "02", label: "Journey", at: "24%" },
  { target: "arsenal", ref: "03", label: "Arsenal", at: "38%" },
  { target: "work", ref: "04", label: "Work", at: "52%" },
  { target: "pipeline", ref: "04.1", label: "Detail", at: "65%" },
  { target: "languages", ref: "05", label: "Languages", at: "79%" },
  { target: "contact", ref: "06", label: "Contact", at: "92%" },
];

const NAV_LINKS = [
  { href: "#journey", label: "Journey" },
  { href: "#arsenal", label: "Arsenal" },
  { href: "#work", label: "Work" },
  { href: "#languages", label: "Languages" },
  { href: "#contact", label: "Contact" },
];

export default function SiteChrome() {
  const traceRef = useRef<HTMLSpanElement>(null);
  const toplineRef = useRef<HTMLSpanElement>(null);
  const railNodeRefs = useRef<(HTMLLIElement | null)[]>([]);
  const navLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sections = [
      ...document.querySelectorAll<HTMLElement>("main section[id]"),
    ];

    let ticking = false;

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress =
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      if (traceRef.current) {
        traceRef.current.style.transform = `translateX(-50%) scaleY(${progress.toFixed(
          4,
        )})`;
      }
      if (toplineRef.current) {
        toplineRef.current.style.width = (progress * 100).toFixed(2) + "%";
      }

      const mid = window.innerHeight * 0.5;
      let activeId = sections.length ? sections[0].id : null;
      sections.forEach((sec) => {
        if (sec.getBoundingClientRect().top < mid) activeId = sec.id;
      });

      railNodeRefs.current.forEach((node, i) => {
        if (!node) return;
        const sec = document.getElementById(RAIL_NODES[i].target);
        if (!sec) return;
        node.classList.toggle(
          "is-lit",
          sec.getBoundingClientRect().top < window.innerHeight * 0.66,
        );
      });

      navLinkRefs.current.forEach((a) => {
        if (!a) return;
        a.classList.toggle(
          "is-active",
          a.getAttribute("href") === "#" + activeId,
        );
      });
    };

    const handler = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    };

    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    onScroll();

    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a className="skip-link" href="#origin">
        Skip to content
      </a>

      {/* LEFT SCHEMATIC RAIL */}
      <aside className="rail" aria-hidden="true">
        <span className="rail__base" />
        <span className="rail__trace" ref={traceRef} />
        <ol className="rail__nodes">
          {RAIL_NODES.map((node, i) => (
            <li
              key={node.target}
              className="rail__node"
              data-target={node.target}
              style={{ ["--at" as string]: node.at }}
              ref={(el) => {
                railNodeRefs.current[i] = el;
              }}
            >
              <span className="rail__ref">{node.ref}</span>
              <span className="rail__label">{node.label}</span>
            </li>
          ))}
        </ol>
      </aside>

      {/* mobile: rail collapses to a top progress line */}
      <div className="topline" aria-hidden="true">
        <span className="topline__fill" ref={toplineRef} />
      </div>

      {/* NAV */}
      <nav className="nav" aria-label="Section index">
        <a className="nav__mark" href="#origin">
          S<span>·</span>L
        </a>
        <div className="nav__right">
          <ul className="nav__list">
            {NAV_LINKS.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  ref={(el) => {
                    navLinkRefs.current[i] = el;
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <button
            className="nav__toggle"
            aria-expanded={menuOpen}
            aria-controls="nav-list-mobile"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>
      <ul className="nav__mobile" id="nav-list-mobile" hidden={!menuOpen}>
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
