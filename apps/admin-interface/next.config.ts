import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
    incomingRequests: true
  }
  /* config options here */
};

export default nextConfig;
