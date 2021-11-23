import { NextApiRequest, NextApiResponse } from 'next';
import { verify, VerifyErrors } from 'jsonwebtoken';
import nextConnect from 'next-connect';

export default nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `The request cannot be out by the web server. ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} Not Allowed.` });
  },
}).use(async (req, res, next) => {
  let secretKey = process.env.JWT_SECRET_KEY as string;
  secretKey = secretKey.replace(/\\n/g, '\n');
  const token = req.headers.authorization;

  //authorizationキーがない場合
  if (!token) {
    res.end('error');

    return;
  }

  await verify(token, secretKey, (err: VerifyErrors | null, decoded: object | undefined) => {
    if (err === null && decoded !== undefined) {
      console.log('verified!');
      next();
    } else {
      res.status(401).json({ message: 'Authentication failed.' });
      return;
    }
  });
});
