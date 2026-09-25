import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
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
