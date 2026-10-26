import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.ppltracker.web.id',
          },
        ],
        destination: 'https://ppltracker.web.id/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
