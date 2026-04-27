import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    domains: ['cdn.dummyjson.com'],
      
  },
    output: 'export',
};

export default nextConfig;
