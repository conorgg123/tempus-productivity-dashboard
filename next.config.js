/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    images: {
      unoptimized: true,
    },
  },
}

module.exports = nextConfig 