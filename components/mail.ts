import { createTransport } from 'nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { MAIL_USER, MAIL_PASS, MAIL_FROM, MAIL_TO } = process.env;
  const transporter = createTransport({
    host: 'experienced.work',
    port: 587,
    secure: false,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: MAIL_FROM,
    to: MAIL_TO,
    subject: 'HPにお問い合わせがありました',
    text: req.body,
  });

  res.status(200).json({
    success: true,
  });
};
