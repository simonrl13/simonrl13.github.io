/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel (canonical, hosts /api/chat) gets a normal Next.js build.
  // GitHub Pages is static-only and can't run the API route, so its CI job
  // sets STATIC_EXPORT=true (after stripping app/api — see the workflow) to
  // produce a pure export. Same source, two build shapes.
  ...(process.env.STATIC_EXPORT === "true" ? { output: "export" } : {}),
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
