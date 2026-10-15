import localFont from "next/font/local";
import { site } from "@/content/site";

/* Shared by every root document: app/[locale]/layout.tsx and
   app/global-not-found.tsx (which bypasses the layout). */

/* Fonts are self-hosted from app/fonts (SIL OFL 1.1, licenses alongside):
   the latin subset of each variable font, as Google Fonts serves it, so
   builds never reach out to a third party. Latin covers EN/FR/PT; any other
   glyph falls back to the system stack. Next requires font-loader options
   to be literals, hence the repeated latin unicode-range below.

   font-display: Inter and JetBrains Mono use "optional" — a late font is
   never swapped in after first paint, because their swaps rewrap the hero
   role line and the title block (CLS 0.021 when fonts arrive late). All
   three are preloaded, so normal loads still get them; a very slow first
   view keeps the size-matched fallback and the next view has the cached
   font. Fraunces keeps "swap": its fallback metrics match (no shift). */
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
  display: "optional",
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
  adjustFontFallback: "Arial",
});

const jetbrains = localFont({
  src: "./fonts/jetbrains-mono-latin.woff2",
  weight: "400 500",
  style: "normal",
  variable: "--font-jetbrains",
  display: "optional",
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
  adjustFontFallback: false, // monospace: keep the plain fallback stack
});

export const fontClasses = `${fraunces.variable} ${inter.variable} ${jetbrains.variable}`;

/** Theme without a flash + the once-per-session draw-in flag. */
export function ThemeHead() {
  return (
    <>
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
    </>
  );
}
