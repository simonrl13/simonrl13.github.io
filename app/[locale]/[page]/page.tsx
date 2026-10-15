import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import LangSwitch from "@/components/LangSwitch";
import SheetFrame from "@/components/SheetFrame";
import ContactForm from "@/components/ContactForm";
import { alternatesFor, fill, getBundle, languageAlternates, type Bundle } from "@/content/i18n";
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
  services: ServicesBody,
};

function ServicesBody({ services: s, locale }: Bundle) {
  return (
    <section className="section" aria-labelledby="services-title">
      <header className="sec-head">
        <div>
          <p className="sec-head__eyebrow mono">{s.eyebrow}</p>
          <h1 id="services-title">{s.title}</h1>
        </div>
        <p>{s.intro}</p>
      </header>

      <p className="subpage__p offers__pilot">
        <strong>{s.labels.pilot}:</strong> {s.pilot}
      </p>

      <div className="offers">
        {s.offers.map((offer) => (
          <article className="offer" key={offer.id} aria-labelledby={`offer-${offer.id}`}>
            <p className="offer__kicker mono">{offer.kicker}</p>
            {offer.badge && <p className="offer__badge mono">{offer.badge}</p>}
            <h2 id={`offer-${offer.id}`}>{offer.outcome}</h2>
            <p className="offer__audience">
              <strong>{s.labels.audience}:</strong> {offer.audience}
            </p>
            <h3 className="offer__sub">{s.labels.included}</h3>
            <ul className="offer__list">
              {offer.included.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <dl className="offer__terms">
              <div>
                <dt>{s.labels.timeline}</dt>
                <dd className="mono">{offer.timeline}</dd>
              </div>
              <div>
                <dt>{s.labels.price}</dt>
                <dd className="mono">
                  <a href="#contact-form">{offer.price} →</a>
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <aside className="offer-other" aria-labelledby="offer-other">
        <h2 id="offer-other">{s.other.title}</h2>
        <p>{s.other.body}</p>
        <a href="#contact-form">{s.other.cta} <span aria-hidden="true">→</span></a>
      </aside>

      <h2 className="subpage__h" id="data">{s.data.title}</h2>
      <p className="subpage__p">{s.data.intro}</p>
      <ol className="legend legend--single" aria-labelledby="data">
        {s.data.items.map((item, i) => (
          <li className="legend__row" key={item.title}>
            <span className="legend__key mono" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="legend__def">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="subpage__h" id="contact-form">{s.form.title}</h2>
      <p className="subpage__p">{s.form.intro}</p>
      <p className="subpage__p cform__privacy">{s.form.privacy}</p>
      <ContactForm copy={{ ...s.form, failed: fill(s.form.failed) }} locale={locale} />
    </section>
  );
}

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
