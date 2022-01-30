import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import type { NextApiRequest, NextApiResponse } from 'next';

type Credentials = {
  email: string;
  password: string;
};

/**
 * 管理ページ用の認証
 * @param credentials
 */
const authAdmin = (credentials: Credentials) => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
    return { authenticated: true };
  } else {
    return null;
  }
};

const options = {
  providers: [
    Providers.Credentials({
      name: 'Email',
      credentials: {
        email: { label: 'E-MAIL', type: 'email' },
        password: { label: 'PASSWORD', type: 'password' },
      },

      authorize: async (credentials) => {
        const authenticated = authAdmin(credentials);
        if (authenticated) {
          return Promise.resolve(authenticated);
        } else {
          return Promise.reject(new Error('authentication failed.'));
        }
      },
    }),
  ],
};
const authentication = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
export default authentication;
