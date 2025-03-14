/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is a monorepo, the actual Next.js app is in apps/web
  // This config file helps Vercel identify the project structure
  distDir: "apps/web/.next",
  basePath: "",
  reactStrictMode: true,
};

module.exports = nextConfig;
