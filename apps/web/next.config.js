/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@supply-chain-system/ui',
    '@supply-chain-system/shared',
    '@supply-chain-system/database',
  ],
  reactStrictMode: true,
  // TypeScript checking is enabled for proper type safety
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    //ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
