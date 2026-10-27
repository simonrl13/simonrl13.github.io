import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { languageAlternates } from "@/content/i18n";
import { hasPage, locales, pageSlugs, type PageKey } from "@/content/i18n/routes";

export const dynamic = "force-static";

/** Every page in every locale it exists in, each listing its translations (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: (PageKey | undefined)[] = [undefined, ...(Object.keys(pageSlugs) as PageKey[])];
  const abs = (path: string) => `${site.canonical}${path}`;
  return pages.flatMap((page) =>
    locales.filter((locale) => hasPage(locale, page)).map((locale) => {
      const { canonical, languages } = languageAlternates(locale, page);
      return {
        url: abs(canonical),
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: page ? 0.5 : 1,
        alternates: {
          languages: Object.fromEntries(Object.entries(languages).map(([k, v]) => [k, abs(v)])),
        },
      };
    }),
  );
}
