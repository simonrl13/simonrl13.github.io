import type { Metadata } from "next";
import { site } from "@/content/site";
import { getBundle } from "@/content/i18n";
import { locales } from "@/content/i18n/routes";
import { fontClasses, ThemeHead } from "../document";
import "../globals.css";

/* One root layout per locale. English is served at the unprefixed URLs
   (next.config rewrites them here as /en); other locales live under /<locale>.
   Unknown locales 404. Pages set their own canonical + hreflang. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { site: copy, ui } = getBundle((await params).locale);
  return {
    metadataBase: new URL(site.canonical),
    title: {
      default: copy.title,
      template: "%s — Simon Laborde",
    },
    description: copy.description,
    authors: [{ name: site.name, url: site.canonical }],
    creator: site.name,
    keywords: [
      "Simon Laborde",
      "backend engineer",
      "full-stack engineer",
      "AI engineer",
      "LLM engineer",
      "MCP",
      "Next.js",
      "portfolio",
      "Campina Grande",
      "Brazil",
    ],
    openGraph: {
      type: "website",
      siteName: site.name,
      title: copy.title,
      description: copy.description,
      locale: ui.meta.ogLocale,
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: copy.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: ["/og.png"],
    },
    robots: { index: true, follow: true },
  };
}

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.canonical,
  jobTitle: "Backend & AI/LLM Engineer",
  email: `mailto:${site.links.email}`,
  sameAs: [site.links.github, site.links.linkedin],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "UNIFACISA",
  },
  knowsLanguage: ["pt", "en", "fr", "es"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Campina Grande",
    addressCountry: "BR",
  },
};

export default async function RootLayout({ children, params }: Props) {
  const { ui } = getBundle((await params).locale);
  return (
    <html
      lang={ui.meta.htmlLang}
      className={fontClasses}
    >
      <head>
        <ThemeHead />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
