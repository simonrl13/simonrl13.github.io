/* Localized URLs. English (the default locale) lives at the unprefixed URLs
   (next.config rewrites them to /en internally); every other locale lives
   under /<locale>. Adding a language = a slug per page here + its copy. */

import cfg from "../locales.json";

export const locales = cfg.locales as readonly string[];
export const defaultLocale = cfg.defaultLocale;

/** Sub-pages (the home page is ""). Each needs a slug in every locale. */
export const pageSlugs = {
  security: { en: "security", pt: "seguranca" },
  services: { en: "services", pt: "empresas" },
} as const satisfies Record<string, Record<string, string>>;

export type PageKey = keyof typeof pageSlugs;

/** Public path for a page in a locale, with the trailing slash the site uses. */
export function pathFor(locale: string, page?: PageKey): string {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  if (!page) return `${prefix}/`;
  const slug = (pageSlugs[page] as Record<string, string>)[locale];
  return `${prefix}/${slug}/`;
}

/** The page key a slug belongs to in a locale, if any. */
export function pageForSlug(locale: string, slug: string): PageKey | undefined {
  return (Object.keys(pageSlugs) as PageKey[]).find(
    (key) => (pageSlugs[key] as Record<string, string>)[locale] === slug,
  );
}
