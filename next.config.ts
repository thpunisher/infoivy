import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Performance optimizations
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // Modern configuration for Next.js 15
  experimental: {
    // Enable Turbopack for development
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Server actions configuration
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000']
    } as const,  // Use const assertion to match the expected type
  },

  // Security headers
  headers: async () => {
    if (process.env.NODE_ENV === 'development') {
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
      ];
    }
    return [];
  },

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Disable source maps in development for faster builds
    if (dev && !isServer) {
      config.devtool = false;
    }
    return config;
  },

  // Image optimization
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Disable React Strict Mode in development for better performance
  reactStrictMode: process.env.NODE_ENV !== 'development',

  // Production optimizations
  productionBrowserSourceMaps: false,
  compress: true,
  swcMinify: true,
};

export default nextConfig;
