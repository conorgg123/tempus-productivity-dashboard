/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  experimental: {
    forceSwcTransforms: false
  },
  images: {
    unoptimized: true
  },
  output: 'export',
  distDir: 'out',
}

module.exports = nextConfig 