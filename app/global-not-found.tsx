import type { Metadata } from "next";
import NotFoundCopy from "@/components/NotFoundCopy";
import SheetFrame from "@/components/SheetFrame";
import { getBundle } from "@/content/i18n";
import { locales, pathFor } from "@/content/i18n/routes";
import { fontClasses, ThemeHead } from "./document";
import "./globals.css";

/* Every unmatched URL (the root layout sits under the dynamic [locale]
   segment, so there is no single layout to build a 404 from). It gets no
   params, so NotFoundCopy picks the language from the URL; only the 404
   strings of each locale are sent. */
export const metadata: Metadata = { title: "404", robots: { index: false } };

export default function GlobalNotFound() {
  const copy = Object.fromEntries(
    locales.map((l) => [l, { ...getBundle(l).ui.notFound, lang: getBundle(l).ui.meta.htmlLang, href: pathFor(l) }]),
  );
  return (
    <html lang={getBundle(locales[0]).ui.meta.htmlLang} className={fontClasses}>
      <head>
        <ThemeHead />
      </head>
      <body>
        <SheetFrame />
        <main className="subpage">
          <section className="section">
            <NotFoundCopy copy={copy} />
          </section>
        </main>
      </body>
    </html>
  );
}
