/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@supply-chain-system/ui",
    "@supply-chain-system/shared",
    "@supply-chain-system/database"
  ],
  reactStrictMode: true,
}

module.exports = nextConfig 