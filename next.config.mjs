/** @type {import('next').NextConfig} */
const nextConfig = {
  // One build serves both Vercel and GitHub Pages (static export).
  output: "export",
  // Static export cannot use the Next image optimizer; screenshots are
  // pre-sized and compressed by hand instead.
  images: { unoptimized: true },
  // GitHub Pages serves from a subpath-free apex (simonrl13.github.io) but
  // is happier with trailing-slash directory URLs.
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
