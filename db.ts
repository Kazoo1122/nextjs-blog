import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.NEXT_PUBLIC_MYSQL_HOST,
    port: Number(process.env.NEXT_PUBLIC_MYSQL_PORT),
    database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
    user: process.env.NEXT_PUBLIC_MYSQL_USER,
    password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
  },
});

export const dbQuery = async (sql: string) => {
  try {
    const results = (await db.query(sql)) as any;
    await db.end();
    return results;
  } catch (error) {
    return { error }; // TODO: エラー時の例外処理が必要
  }
};
