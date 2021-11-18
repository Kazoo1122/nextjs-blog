import { useState } from 'react';

export const useMail = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const send = async () => {
    await fetch('/api/mail', {
      method: 'POST',
      body: `
      ご氏名：${name}
      メールアドレス：${email}
      お問い合わせ内容：${message}
      `,
    });
  };

  return {
    setName,
    setEmail,
    setMessage,
    send,
  };
};
