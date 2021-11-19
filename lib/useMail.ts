import { FormValues } from '../pages/contact';

export const useMail = () => {
  const send = async (data: FormValues) => {
    await fetch('/api/mail', {
      method: 'POST',
      body: `
      ご氏名：${data.name}
      メールアドレス：${data.email}
      お問い合わせ内容：${data.message}
      `,
    });
  };

  return { send };
};
