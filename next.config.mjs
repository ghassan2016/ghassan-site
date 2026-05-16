/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The vendored gemini-reversed CJS package is loaded via a static
  // require() in lib/gemini.server.ts — webpack bundles the entire tree
  // into the API route's serverless function. No tracing config needed.
};

export default nextConfig;
