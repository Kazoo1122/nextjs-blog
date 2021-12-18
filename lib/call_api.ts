import { FormValues } from '../pages/contact';
import { PostValues } from '../pages/admin/resistration_form';
import { DatabaseQuery } from '../pages';

const token = process.env.NEXT_PUBLIC_JWT as string;

export const mailAPI = async (data: FormValues) => {
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

export const dbAPI = () => {
  const getDbData = async (query: DatabaseQuery, params?: number[]) => {
    const httpHeaders = {
      Authorization: token,
      Accept: 'application/json',
    };
    const headers = new Headers(httpHeaders);
    let url = process.env.server + `/api/articles?query=${query}`;
    if (params) {
      params.map((param) => {
        url = url + `&params=${param}`;
      });
    }
    const res = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    return await res.json();
  };
  /*
  const postDbData = async (data: PostValues) => {
    const httpHeaders = {
      Authorization: token,
      Accept: 'application/json',
      'Content-type': 'application/json',
    };
    const headers = new Headers(httpHeaders);
    const url = process.env.server + '/aaa/articles';
    const body = JSON.stringify(data);
    return await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });
  };
*/
  return { getDbData };
};
