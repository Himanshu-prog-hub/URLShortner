/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // BACKEND_URL is set in Vercel project settings for production;
    // locally it falls back to the Spring Boot dev server.
    const backend = process.env.BACKEND_URL || "http://localhost:8081";
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/:path*`,
      },
    ];
  },
};

export default nextConfig;
