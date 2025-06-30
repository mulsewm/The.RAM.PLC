/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  // External packages that should be bundled with the server
  serverExternalPackages: ['@prisma/client'],
  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable React strict mode
  reactStrictMode: true,
};

module.exports = nextConfig;
