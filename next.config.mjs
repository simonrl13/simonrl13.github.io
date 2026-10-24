/* Security headers on every route. 'unsafe-inline' for scripts is a known, accepted limitation:
   statically rendered Next.js pages carry inline bootstrap scripts, and
   nonces would force every page to render per request. See SECURITY.md. */
import i18n from "./content/locales.json" with { type: "json" };

const isDev = process.env.NODE_ENV === "development";

/* Locale routing. The default locale (English) is served at the unprefixed
   URLs: they are rewritten internally to app/[locale] as /en/…, and the
   explicit /en/… URLs redirect back so each page has one address. Other
   locales live under /<locale>/. Nothing redirects by browser language or
   stored choice — the URL always decides the language. */
const { locales, defaultLocale } = i18n;
const localeRewrites = [
  { source: "/", destination: `/${defaultLocale}/` },
  // anything not already under a locale prefix (files, /api and /_next match before these)
  { source: `/:path((?!(?:${locales.join("|")})(?:/|$)).+)`, destination: `/${defaultLocale}/:path` },
];
const localeRedirects = [
  { source: `/${defaultLocale}`, destination: "/", permanent: true },
  { source: `/${defaultLocale}/:path+`, destination: "/:path+/", permanent: true },
];

const csp = [
  "default-src 'self'",
  // dev only: React Refresh needs eval
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  // project videos: the player loads only after a click (WorkCarousel VideoFacade)
  "frame-src https://www.youtube-nocookie.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [{ source: "/:path*", headers: securityHeaders }],
  rewrites: async () => ({ afterFiles: localeRewrites }),
  redirects: async () => localeRedirects,
  poweredByHeader: false,
  // images are pre-sized and compressed by hand; no optimizer needed
  images: { unoptimized: true },
  // kept from the static-export days so existing URLs don't change; the chat
  // client fetches /api/chat/ to avoid a 308 hop
  trailingSlash: true,
  reactStrictMode: true,
  // app/global-not-found.tsx: the root layout is under [locale], so unmatched URLs need their own document
  experimental: { globalNotFound: true },
};

export default nextConfig;
