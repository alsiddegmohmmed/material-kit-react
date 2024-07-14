/** @type {import('next').NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  distDir: '.next',
  basePath: '/dashboard',
};

module.exports = config;
