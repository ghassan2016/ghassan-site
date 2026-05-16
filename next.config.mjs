/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The vendored gemini-reversed CJS package is loaded at runtime via
  // createRequire(process.cwd()) so webpack never sees the require path
  // statically — no externals/transpile config needed.
};

export default nextConfig;
