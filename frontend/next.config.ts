import { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: null,
  allowedDevOrigins: ['*'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'zhblog.ru',
        port: '',
        pathname: '/api/v1/file/photo/**',
        search: '',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  /* config options here */
};

export default nextConfig;
