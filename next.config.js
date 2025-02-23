/** @type {import('next').NextConfig} */
const nextConfig = {
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
  }
};

module.exports = nextConfig; 