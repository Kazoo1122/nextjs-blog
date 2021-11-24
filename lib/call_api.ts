import { FormValues } from '../pages/contact';
import { PostValues } from '../pages/admin';
import { DatabaseQuery } from '../pages/api/db/query';

const token = process.env.NEXT_PUBLIC_JWT as string;

export const mailApi = async (data: FormValues) => {
  const httpHeaders = {
    Authorization: token,
    Accept: 'application/json',
    'Content-Type': 'text/plain',
  };
  const headers = new Headers(httpHeaders);
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

export const dbApi = () => {
  const getDbData = async (query: DatabaseQuery, id?: string) => {
    const httpHeaders = {
      Authorization: token,
      Accept: 'application/json',
    };
    const headers = new Headers(httpHeaders);
    const url = process.env.server + `/api/db/query?params=${query}&params=${id ?? 'none'}`;
    console.log(url);
    const res = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    return await res.json();
  };

  const postDbData = async (data: PostValues) => {
    const httpHeaders = {
      Authorization: token,
      Accept: 'application/json',
      'Content-type': 'application/json',
    };
    const headers = new Headers(httpHeaders);
    const url = process.env.server + '/api/db/query';
    const body = JSON.stringify(data);
    const res = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });
    return await res.json();
  };

  return { getDbData, postDbData };
};
