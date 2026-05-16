/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The vendored gemini-reversed CJS package is loaded at runtime via
  // eval('require') so webpack never sees it statically. That means
  // Next's serverless tracer also doesn't trace its internal requires,
  // so on Vercel the subdirectory files (clients/, auth/, types/, etc.)
  // get stripped. Force-include the whole tree for the chat route.
  experimental: {
    outputFileTracingIncludes: {
      "/api/chat": ["./lib/gemini-reversed/**/*"],
      "/api/chat/route": ["./lib/gemini-reversed/**/*"],
    },
  },
};

export default nextConfig;
