import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Performance optimizations
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // Modern configuration for Next.js 15
  experimental: {
    // Server actions configuration
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000']
    } as const,
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

  // Turbopack configuration
  turbopack: {},

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Disable React Strict Mode in development for better performance
  reactStrictMode: process.env.NODE_ENV !== 'development',

  // Production optimizations
  productionBrowserSourceMaps: false,
  compress: true,
};

export default nextConfig;
