/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
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
      
      // Replace node modules
      config.node = {
        fs: 'empty',
        path: 'empty',
        os: 'empty'
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