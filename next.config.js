/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add experimental features if needed
  experimental: {
    serverActions: true,
    // Enable if you're using React 18
    // reactRoot: true,
  },
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Add any necessary webpack configurations
  webpack: (config, { isServer }) => {
    // Important: return the modified config
    return config;
  },
  // Add output configuration for static export if needed
  // output: 'export', // Uncomment if you're doing static export
};

module.exports = nextConfig;
