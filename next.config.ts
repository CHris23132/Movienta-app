import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure image domains for Firebase Storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/connect-now-16778.firebasestorage.app/o/**',
      },
    ],
  },
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
