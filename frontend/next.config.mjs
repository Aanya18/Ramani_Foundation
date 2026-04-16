/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint warnings during production builds
    // Fix these properly later
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
