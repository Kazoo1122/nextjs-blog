import { FormValues } from '../pages/contact';
import { PostValues } from '../pages/admin';

const httpHeaders = { Authorization: process.env.JWT as string };
const headers = new Headers(httpHeaders);

export const postMailApi = async (data: FormValues) => {
  return await fetch('/api/mail', {
    method: 'POST',
    headers: headers,
    body: `
      ご氏名：${data.name}
      メールアドレス：${data.email}
      お問い合わせ内容：${data.message}
      `,
  });
};

export function getDbApi() {
  const getDbData = async (sql: string) => {
    const url = process.env.server + `/api/${sql}`;
    console.log(url);
    return await fetch(url, {
      method: 'GET',
      headers: headers,
    });
  };
  return { getDbData };
}

export const postDbApi = async (data: PostValues) => {
  return await fetch('/api/db', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
