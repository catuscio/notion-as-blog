import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  headers: async () => [
    { source: "/(.*)", headers: securityHeaders },
  ],
  images: {
    remotePatterns: [
      { hostname: "www.notion.so" },
      { hostname: "images.unsplash.com" },
      { hostname: "s3-us-west-2.amazonaws.com" },
      { hostname: "s3.us-west-2.amazonaws.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
    ],
  },
};

export default nextConfig;
