import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  async headers() {
    const securityHeaders = [
      {
        key: "X-DNS-Prefetch-Control",
        value: "on",
      },
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "origin-when-cross-origin",
      },
      {
        key: "X-Robots-Tag",
        value: "index, follow",
      },
    ];

    const staticCacheHeaders = [
      {
        key: "Cache-Control",
        value: "public, max-age=3600, must-revalidate",
      },
    ];

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/",
        headers: staticCacheHeaders,
      },
      {
        source: "/about",
        headers: staticCacheHeaders,
      },
      {
        source: "/contact",
        headers: staticCacheHeaders,
      },
      {
        source: "/privacy-policy",
        headers: staticCacheHeaders,
      },
      {
        source: "/terms-conditions",
        headers: staticCacheHeaders,
      },
      {
        source: "/disclaimer",
        headers: staticCacheHeaders,
      },
      {
        source: "/ipl-winners",
        headers: staticCacheHeaders,
      },
      {
        source: "/top-10-expensive-ipl-players",
        headers: staticCacheHeaders,
      },
      {
        source: "/best-ipl-bowlers",
        headers: staticCacheHeaders,
      },
      {
        source: "/ipl-auction-strategy",
        headers: staticCacheHeaders,
      },
      {
        source: "/auction",
        headers: staticCacheHeaders,
      },
      {
        source: "/predictions",
        headers: staticCacheHeaders,
      },
      {
        source: "/widgets",
        headers: staticCacheHeaders,
      },
      {
        source: "/widgets/:path*",
        headers: staticCacheHeaders,
      },
      {
        source: "/players",
        headers: staticCacheHeaders,
      },
      {
        source: "/players/:path*",
        headers: staticCacheHeaders,
      },
      {
        source: "/teams",
        headers: staticCacheHeaders,
      },
      {
        source: "/teams/:path*",
        headers: staticCacheHeaders,
      },
      {
        source: "/standings",
        headers: staticCacheHeaders,
      },
    ];
  },
};

export default nextConfig;
