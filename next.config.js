/** @type {import('next').NextConfig} */
const dotenv = require('dotenv');
dotenv.config(".env");
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  experimental: { webpackBuildWorker: true},
  eslint: {
    ignoreDuringBuilds: true,
  },
    images: {
        domains: ['res.cloudinary.com',"cdn.hammerandbell.shop","localhost","images.unsplash.com"],
        minimumCacheTTL: 3600,
    },
    webpack: (config) => {
      config.resolve.alias.canvas = false;
      return config;
    },

}

module.exports = nextConfig
