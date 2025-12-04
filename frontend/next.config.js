/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  // Disable static optimization to prevent hydration errors
  experimental: {
    optimizeCss: false,
  },
  // تجاهل warnings من browser extensions
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // إخفاء hydration warnings من browser extensions
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
}

module.exports = nextConfig
