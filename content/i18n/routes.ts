/* Localized URLs. English (the default locale) lives at the unprefixed URLs
   (next.config rewrites them to /en internally); every other locale lives
   under /<locale>. Adding a language = a slug per page here + its copy. A
   page with no slug in a locale doesn't exist there (the services offers are
   for Brazilian businesses: no French version). */

import cfg from "../locales.json";

export const locales = cfg.locales as readonly string[];
export const defaultLocale = cfg.defaultLocale;

/** Sub-pages (the home page is ""). */
export const pageSlugs = {
  security: { en: "security", pt: "seguranca", fr: "securite" },
  services: { en: "services", pt: "empresas" },
} as const satisfies Record<string, Record<string, string>>;

export type PageKey = keyof typeof pageSlugs;

/** Whether a page exists in a locale (the home page always does). */
export function hasPage(locale: string, page?: PageKey): boolean {
  return !page || locale in pageSlugs[page];
}

/** Public path for a page in a locale, with the trailing slash the site uses.
    A page the locale lacks resolves to that locale's home. */
export function pathFor(locale: string, page?: PageKey): string {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  if (!page || !hasPage(locale, page)) return `${prefix}/`;
  return `${prefix}/${(pageSlugs[page] as Record<string, string>)[locale]}/`;
}

/** The page key a slug belongs to in a locale, if any. */
export function pageForSlug(locale: string, slug: string): PageKey | undefined {
  return (Object.keys(pageSlugs) as PageKey[]).find(
    (key) => (pageSlugs[key] as Record<string, string>)[locale] === slug,
  );
}
