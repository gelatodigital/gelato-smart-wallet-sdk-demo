import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    minimumCacheTTL: 31536000,
    domains: ["lh3.googleusercontent.com"],
  },
};

export default nextConfig;
