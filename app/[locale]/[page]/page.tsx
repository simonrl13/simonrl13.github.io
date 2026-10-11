import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import LangSwitch from "@/components/LangSwitch";
import SheetFrame from "@/components/SheetFrame";
import { alternatesFor, getBundle, languageAlternates, type Bundle } from "@/content/i18n";
import { locales, pageForSlug, pageSlugs, pathFor, type PageKey } from "@/content/i18n/routes";

/* Sub-pages, by localized slug (/security/, /pt/seguranca/). Every page in
   routes.ts has a slug in every locale; anything else 404s. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    Object.values(pageSlugs).map((slugs) => ({ locale, page: (slugs as Record<string, string>)[locale] })),
  );
}

type Props = { params: Promise<{ locale: string; page: string }> };

async function resolve(params: Props["params"]) {
  const { locale, page: slug } = await params;
  const page = pageForSlug(locale, slug);
  if (!page) notFound();
  return { locale, page, b: getBundle(locale) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, page, b } = await resolve(params);
  const copy = b[page];
  return {
    title: copy.title,
    description: copy.description,
    alternates: languageAlternates(locale, page),
  };
}

export default async function SubPage({ params }: Props) {
  const { locale, page, b } = await resolve(params);
  const home = pathFor(locale);

  return (
    <>
      <SheetFrame />

      <header className="subnav">
        <a className="nav__mark" href={home}>
          S<span>·</span>L
        </a>
        <div className="subnav__right">
          <a className="subnav__back" href={home}>
            {b.ui.subpage.back}
          </a>
          <LangSwitch current={locale} alternates={alternatesFor(page)} label={b.ui.langSwitch.label} />
          <ThemeToggle labels={b.ui.theme} />
        </div>
      </header>

      <main className="subpage">{BODIES[page](b)}</main>

      <footer className="foot foot--sub">
        <p>
          <span className="mono">SL&#8209;2026</span> — <a href={home}>{b.ui.subpage.footerBack}</a>
        </p>
      </footer>
    </>
  );
}

const BODIES: Record<PageKey, (b: Bundle) => React.ReactNode> = {
  security: SecurityBody,
};

function SecurityBody({ security: s, ui }: Bundle) {
  return (
    <section className="section" aria-labelledby="security-title">
      <header className="sec-head">
        <div>
          <p className="sec-head__eyebrow mono">{s.eyebrow}</p>
          <h1 id="security-title">{s.title}</h1>
        </div>
        <p>{s.intro}</p>
      </header>

      <ol className="legend legend--single" aria-label={ui.securityUi.controls}>
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

      <h2 className="subpage__h">{ui.securityUi.limitations}</h2>
      <ul className="subpage__list">
        {s.limitations.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      <h2 className="subpage__h">{ui.securityUi.report}</h2>
      <p className="subpage__p">{s.reportLine}</p>
      <p className="subpage__p">
        <a href={s.securityMd} target="_blank" rel="noopener noreferrer">
          {ui.securityUi.threatModel} ↗
        </a>
      </p>
    </section>
  );
}
