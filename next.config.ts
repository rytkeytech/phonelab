import type { NextConfig } from "next";

// Sent with every response. Vercel already adds HTTPS-only (HSTS).
const securityHeaders = [
  // Don't let other sites embed PhoneLab in a frame (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  // Browsers must trust the declared file type (blocks MIME sniffing).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Share only the site origin with other sites, never full URLs.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // PhoneLab doesn't use these device features.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
