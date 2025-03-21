/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Ensure output is static for Electron
  output: 'export',
  // Disable server components since we're exporting a static site
  experimental: {
    appDir: false,
  },
  // Fix for Electron static export
  assetPrefix: './',
  // Ensure we don't try to use server features in static export
  trailingSlash: true,
  // Prevents conflicts between Electron and Next.js
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer';
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
      
      // Add global polyfill
      config.plugins.push(
        new config.webpack.ProvidePlugin({
          global: ['window'],
        })
      );
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig; 