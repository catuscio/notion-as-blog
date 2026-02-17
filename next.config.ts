import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
