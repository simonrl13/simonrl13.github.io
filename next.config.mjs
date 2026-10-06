/* Security headers on every route. 'unsafe-inline' for scripts is a known, accepted limitation:
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [{ source: "/:path*", headers: securityHeaders }],
  poweredByHeader: false,
  // images are pre-sized and compressed by hand; no optimizer needed
  images: { unoptimized: true },
  // kept from the static-export days so existing URLs don't change; the chat
  // client fetches /api/chat/ to avoid a 308 hop
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
