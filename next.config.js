/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Ensure output is static for Electron
  output: 'export',
  // Fix for Electron static export
  assetPrefix: './',
  // Ensure we don't try to use server features in static export
  trailingSlash: true,
  // Remove invalid experimental option
  experimental: {},
  // Add webpack config to handle global polyfills
  webpack: (config, { isServer }) => {
    // Prevents conflicts between Electron and Next.js
    if (!isServer) {
      config.target = 'electron-renderer';
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
      
      // Fix for global polyfill - simplified approach
      config.output.globalObject = 'this';
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig; 