import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations for faster dev server
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Allow cross-origin requests for mobile testing
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
  // Configure allowed dev origins for mobile testing
  allowedDevOrigins: ['192.168.68.101'],
  // Reduce bundle analysis overhead
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Disable source maps in development for faster builds
      config.devtool = false;
    }
    return config;
  },
  // Optimize images
  images: {
    domains: ['localhost'],
    unoptimized: true, // Faster dev builds
  },
  // Reduce TypeScript checking overhead
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
