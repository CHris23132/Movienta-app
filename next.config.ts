import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude Firebase Functions from build
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'firebase-functions': 'commonjs firebase-functions',
      });
    }
    return config;
  },
  // Exclude firebase-admin from bundling (use system version)
  serverExternalPackages: ['firebase-admin'],
};

export default nextConfig;
