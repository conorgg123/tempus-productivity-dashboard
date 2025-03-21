/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // Prevent build issues
  swcMinify: false,
  // Valid options for output
  output: 'standalone',
  // Use unoptimized images for static export
  images: {
    loader: 'imgix',
    path: 'https://example.com/myaccount/',
    unoptimized: true,
    disableStaticImages: true
  },
  // Simple webpack config without problematic plugins
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // For Electron renderer
      config.target = 'electron-renderer';
      
      // Valid node configuration using approved properties only
      config.node = {
        __dirname: false,
        __filename: false,
        global: true
      };
    }
    return config;
  },
  // Disable linting and type checking
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
}; 