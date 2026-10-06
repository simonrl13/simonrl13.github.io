import type { Metadata } from "next";
import localFont from "next/font/local";
import { site } from "@/content/site";
import "./globals.css";

/* Fonts are self-hosted from app/fonts (SIL OFL 1.1, licenses alongside):
   the latin subset of each variable font, as Google Fonts serves it, so
   builds never reach out to a third party. Latin covers EN/FR/PT; any other
   glyph falls back to the system stack. Next requires font-loader options
   to be literals, hence the repeated latin unicode-range below. */
const fraunces = localFont({
  src: "./fonts/fraunces-latin.woff2", // opsz 9–144 + wght axes
  weight: "100 900",
  style: "normal",
  variable: "--font-fraunces",
  display: "swap",
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
  adjustFontFallback: "Times New Roman",
});

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "400 600",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
  adjustFontFallback: "Arial",
});

const jetbrains = localFont({
  src: "./fonts/jetbrains-mono-latin.woff2",
  weight: "400 500",
  style: "normal",
  variable: "--font-jetbrains",
  display: "swap",
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
  adjustFontFallback: false, // monospace: keep the plain fallback stack
});

export const metadata: Metadata = {
  metadataBase: new URL(site.canonical),
  title: {
    default: site.title,
    template: "%s — Simon Laborde",
  },
  description: site.description,
  alternates: { canonical: "/" },
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
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Simon Laborde — Backend & AI/LLM Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <head>
        <meta name="color-scheme" content="dark light" />
        {/* must precede the script below, which retints it for whiteprint */}
        <meta name="theme-color" content={site.themeColor.dark} />
        <script
          dangerouslySetInnerHTML={{
            // theme (no flash) + the load draw-in plays once per tab session:
            // later loads in the same tab get data-drawn and render finished
            __html: `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name=theme-color]');if(m&&t==='light')m.content='${site.themeColor.light}'}catch(e){}try{if(sessionStorage.getItem('drawn'))document.documentElement.dataset.drawn='';else sessionStorage.setItem('drawn','1')}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
