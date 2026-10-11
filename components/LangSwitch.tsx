"use client";

export type Alternate = { locale: string; lang: string; href: string; name: string };

/* Language switcher. Plain links to the same page in the other language; the
   choice is remembered in localStorage but NEVER used to redirect — the URL
   always wins (shared /pt links must open in Portuguese for everyone). */

export default function LangSwitch({
  current,
  alternates,
  label,
}: {
  current: string;
  alternates: Alternate[];
  label: string;
}) {
  const remember = (locale: string) => {
    try {
      localStorage.setItem("lang", locale);
    } catch {
      /* private mode — nothing to remember */
    }
  };

  return (
    <nav className="lang-switch lang-switch--nav" aria-label={label}>
      {alternates.map((alt) => (
        <a
          key={alt.locale}
          href={alt.href}
          hrefLang={alt.lang}
          lang={alt.lang}
          aria-current={alt.locale === current ? "page" : undefined}
          title={alt.name}
          onClick={() => remember(alt.locale)}
        >
          {alt.locale.toUpperCase()}
        </a>
      ))}
    </nav>
  );
}
