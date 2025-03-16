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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
