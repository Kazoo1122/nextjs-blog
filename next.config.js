const isProd = process.env.NODE_ENV === 'production';
const server = isProd ? 'https://experienced.work' : 'http://localhost:8000';
const domain = isProd ? 'experienced.work' : 'localhost';

module.exports = {
  reactStrictMode: true,
  env: {
    server: server,
  },
  images: {
    domains: [domain],
    authorization: {
      token: process.env.NEXT_PUBLIC_JWT,
    },
  },
};
