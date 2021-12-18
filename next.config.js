const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  reactStrictMode: true,
  env: {
    server: isProd ? 'https://experienced.work' : 'http://localhost:8000',
  },
};
