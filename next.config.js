const isProd = process.env.NODE_ENV === 'production';
const server = isProd ? 'https://experienced.work' : 'http://localhost:8000';

module.exports = {
  reactStrictMode: true,
  env: {
    server: server,
  },
  images: {
    domains: ['experienced.work', 'dev-learning.net', 'localhost'],
    authorization: {
      token: process.env.NEXT_PUBLIC_JWT,
    },
  },
};
