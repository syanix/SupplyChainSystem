/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@supply-chain-system/ui',
    '@supply-chain-system/shared',
    '@supply-chain-system/database',
  ],
  reactStrictMode: true,
  // Temporarily disable TypeScript checking during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
