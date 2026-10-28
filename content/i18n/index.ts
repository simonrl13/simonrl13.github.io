/* Per-locale content bundles. English is assembled from the existing English
   sources; every other locale provides the same shape (TypeScript enforces
   it). A locale = content/i18n/<locale>.ts + one line in `bundles` + its code
   in content/locales.json + a slug per page in routes.ts — no component code.

   What is NOT translated: profile facts (names, links, numbers, cert names),
   the chat assistant's context (it answers in the visitor's language from
   the English profile) and, in Portuguese, the project dialogs (English case
   studies, with a note). French translates the dialogs (ProjectCopy.detail).
   scripts/i18n-check.test.mjs fails if a translation's numbers or dates
   differ from the English. */

import { site, journey, arsenal, type JourneyItem, type ArsenalRow } from "../site";
import { projects, type Project } from "../projects";
import { pipeline } from "../pipeline";
import { securityPage } from "../security";
import { servicesPage } from "../services";
import { enUi } from "./en";
import { pt } from "./pt";
import { fr } from "./fr";
import { defaultLocale, hasPage, locales, pathFor, type PageKey } from "./routes";

/** Recursively widens literal types so another locale can supply its strings. */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : T extends object
          ? { -readonly [K in keyof T]: Widen<T[K]> }
          : T;

export type SiteCopy = Widen<
  Pick<
    typeof site,
    | "role" | "title" | "description" | "roleLine" | "thesis" | "status"
    | "workRights" | "contactIntro" | "chatLauncher" | "chatSuggestions" | "chatNotice"
  >
> & { titleBlock: { dt: string; dd: string; mono: boolean; stamp?: boolean; sign?: boolean }[] };

type SkinText = Partial<{
  vitals: { dt: string; value: string; unit?: string }[];
  readings: { dt: string; value: string; unit?: string }[];
  xpMeta: string;
  xpAmount: string;
  board: { pos: string; name: string; pts: string; you?: boolean }[];
  placeholder: string;
  caption: string;
}>;

/** Card copy per project; the dialog stays English unless `detail` is given. */
export type ProjectCopy = {
  tag: string;
  title?: string;
  dialogTitle?: string;
  detail?: Project["detail"];
  lead: string;
  layers: string[];
  status?: string;
  /** labels and notes for the project's links, same order and hrefs */
  links?: Project["links"];
  skin?: SkinText;
};

export type Bundle = {
  locale: string;
  ui: Widen<typeof enUi>;
  site: SiteCopy;
  journey: JourneyItem[];
  arsenal: ArsenalRow[];
  /** course names stay English; the dates follow the locale */
  training: readonly string[];
  pipeline: Widen<typeof pipeline>;
  projects: Record<(typeof projects)[number]["id"], ProjectCopy>;
  security: Widen<typeof securityPage>;
  services: Widen<typeof servicesPage>;
};

/* ---------- English: built from the existing sources ---------- */

const en: Bundle = {
  locale: "en",
  ui: enUi,
  site: {
    role: site.role,
    title: site.title,
    description: site.description,
    roleLine: site.roleLine,
    thesis: site.thesis,
    status: { ...site.status },
    workRights: site.workRights,
    contactIntro: site.contactIntro,
    chatLauncher: { ...site.chatLauncher },
    chatSuggestions: [...site.chatSuggestions],
    chatNotice: { ...site.chatNotice },
    titleBlock: site.titleBlock.map((row) => ({ ...row, stamp: row.dt === "Revision", sign: row.dt === "Drawn by" })),
  },
  journey,
  arsenal,
  training: site.training,
  pipeline,
  projects: Object.fromEntries(
    projects.map((p) => [p.id, { tag: p.tag, title: p.title, lead: p.lead, layers: p.layers, status: p.status }]),
  ),
  security: securityPage,
  services: servicesPage,
};

const bundles: Record<string, Bundle> = { en, pt, fr };

// every locale listed in content/locales.json must have a bundle
for (const l of locales) {
  if (!bundles[l]) throw new Error(`content/i18n: no bundle for locale "${l}"`);
}

export function getBundle(locale: string): Bundle {
  // validated first: a raw lookup would hand back Object.prototype for "__proto__"
  return isLocale(locale) ? bundles[locale] : en;
}

export function isLocale(value: unknown): value is string {
  return typeof value === "string" && locales.includes(value);
}

/** Replaces {email} placeholders in UI strings. */
export function fill(text: string): string {
  return text.replaceAll("{email}", site.links.email);
}

/** Projects with this locale's card copy applied, and its dialog if translated. */
export function localizedProjects(bundle: Bundle): Project[] {
  return projects.map((p) => {
    const c = bundle.projects[p.id];
    if (!c) return p;
    return {
      ...p,
      tag: c.tag,
      title: c.title ?? p.title,
      // an untranslated dialog stays English, title included
      dialogTitle: c.detail ? (c.dialogTitle ?? c.title ?? p.dialogTitle ?? p.title) : (p.dialogTitle ?? p.title),
      detail: c.detail ?? p.detail,
      detailLang: c.detail ? bundle.ui.meta.htmlLang : "en",
      lead: c.lead,
      layers: c.layers,
      status: c.status ?? p.status,
      links: c.links ?? p.links,
      skin: { ...p.skin, ...(c.skin ?? {}) } as Project["skin"],
    };
  });
}

/** The same page in every locale, for the language switcher. */
export function alternatesFor(page?: PageKey) {
  return locales.map((l) => ({
    locale: l,
    lang: bundles[l].ui.meta.htmlLang,
    href: pathFor(l, page),
    name: bundles[l].ui.meta.languageName,
  }));
}

/** canonical + hreflang links for a page (x-default = the default locale);
    only the locales the page exists in. */
export function languageAlternates(locale: string, page?: PageKey) {
  return {
    canonical: pathFor(locale, page),
    languages: {
      ...Object.fromEntries(
        locales.filter((l) => hasPage(l, page)).map((l) => [bundles[l].ui.meta.htmlLang, pathFor(l, page)]),
      ),
      "x-default": pathFor(defaultLocale, page),
    },
  };
}
