/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  experimental: {
    optimizeCss: false,
  },
};

module.exports = nextConfig;
