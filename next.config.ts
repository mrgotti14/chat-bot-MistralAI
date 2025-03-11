import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "mongodb-client-encryption": false,
      "aws4": false,
    };
    return config;
  },
  experimental: {
    turbo: {
      resolveAlias: {
        'mongodb-client-encryption': require.resolve('path'),
        'aws4': require.resolve('path')
      },
      moduleIdStrategy: 'deterministic',
      resolveExtensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    }
  },
  images: {
    domains: [
      'lh3.googleusercontent.com', // For Google avatars
      'avatars.githubusercontent.com', // For GitHub avatars
    ],
  },
};

export default nextConfig;
