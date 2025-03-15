const server = 'http://localhost:6348';

module.exports = {
  trailingSlash: true,
  reactStrictMode: true,
  env: {
    server: server,
  },
  images: {
    domains: ['www.interest-tree.com', 'localhost'],
    authorization: {
      token: process.env.JWT,
    },
  },
};
