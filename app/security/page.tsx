import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import SheetFrame from "@/components/SheetFrame";
import { securityPage as s } from "@/content/security";

export const metadata: Metadata = {
  title: s.title,
  description: s.description,
  alternates: { canonical: "/security/" },
};

export default function SecurityPage() {
  return (
    <>
      <SheetFrame />

      <header className="subnav">
        <Link className="nav__mark" href="/">
          S<span>·</span>L
        </Link>
        <div className="subnav__right">
          <Link className="subnav__back" href="/">
            ← Back to the drawing
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="subpage">
        <section className="section" aria-labelledby="security-title">
          <header className="sec-head">
            <div>
              <p className="sec-head__eyebrow mono">{s.eyebrow}</p>
              <h1 id="security-title">{s.title}</h1>
            </div>
            <p>{s.intro}</p>
          </header>

          <ol className="legend legend--single" aria-label="Controls">
            {s.items.map((item, i) => (
              <li className="legend__row" key={item.title}>
                <span className="legend__key mono" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="legend__def">
                  <h2>{item.title}</h2>
                  <p>{item.body}</p>
                  {"link" in item && item.link && (
                    <p>
                      <a href={item.link.href} target="_blank" rel="noopener noreferrer">
                        {item.link.label} ↗
                      </a>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <h2 className="subpage__h">Known limitations</h2>
          <ul className="subpage__list">
            {s.limitations.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <h2 className="subpage__h">Report a vulnerability</h2>
          <p className="subpage__p">{s.reportLine}</p>
          <p className="subpage__p">
            <a href={s.securityMd} target="_blank" rel="noopener noreferrer">
              Full threat model: SECURITY.md on GitHub ↗
            </a>
          </p>
        </section>
      </main>

      <footer className="foot foot--sub">
        <p>
          <span className="mono">SL&#8209;2026</span> —{" "}
          <Link href="/">back to simonlaborde.com</Link>
        </p>
      </footer>
    </>
  );
}
