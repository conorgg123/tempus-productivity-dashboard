/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    unoptimized: true
  },
  output: 'export',
  distDir: 'out'
} 