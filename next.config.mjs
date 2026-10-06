/* Security headers (Vercel / `next start` only — a static export can't send
   headers). 'unsafe-inline' for scripts is a known, accepted limitation:
   statically rendered Next.js pages carry inline bootstrap scripts, and
   nonces would force every page to render per request. See SECURITY.md. */
const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  // dev only: React Refresh needs eval
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
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

const staticExport = process.env.STATIC_EXPORT === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel (canonical, hosts /api/chat) gets a normal Next.js build.
  // GitHub Pages is static-only and can't run the API route, so its CI job
  // sets STATIC_EXPORT=true (after stripping app/api — see the workflow) to
  // produce a pure export. Same source, two build shapes.
  ...(staticExport
    ? { output: "export" }
    : { headers: async () => [{ source: "/:path*", headers: securityHeaders }] }),
  poweredByHeader: false,
  // Static export cannot use the Next image optimizer; screenshots are
  // pre-sized and compressed by hand instead. Kept off on both builds so
  // the two stay visually identical.
  images: { unoptimized: true },
  // GitHub Pages serves from a subpath-free apex (simonrl13.github.io) but
  // is happier with trailing-slash directory URLs; harmless on Vercel too.
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
