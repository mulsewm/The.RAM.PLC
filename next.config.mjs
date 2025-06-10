/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Enable server actions with larger body size
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // External packages for server components
  serverExternalPackages: ['@prisma/client'],
  
  // Enable source maps in development
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development',
  
  // CORS headers configuration
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  
  // Image configuration
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  
  // TypeScript and ESLint configuration
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Important: return the modified config
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error on build:
      // Module not found: Can't resolve 'fs'
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;