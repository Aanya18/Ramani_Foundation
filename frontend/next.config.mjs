/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint warnings during production builds
    // Fix these properly later
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    const backendOrigin = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")
      .replace(/\/+$/, "")
      .replace(/\/api\/v1$/, "");

    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
