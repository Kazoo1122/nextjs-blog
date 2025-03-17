module.exports = {
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    domains: ['www.interest-tree.com', 'localhost'],
    authorization: {
      token: process.env.NEXT_PUBLIC_JWT,
    },
  },
};
