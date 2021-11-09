import mysql from 'serverless-mysql';

export const db = mysql({
  config: {
    host: process.env.NEXT_PUBLIC_MYSQL_HOST,
    port: Number(process.env.NEXT_PUBLIC_MYSQL_PORT),
    database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
    user: process.env.NEXT_PUBLIC_MYSQL_USER,
    password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
  },
});

export const query = async (query: string) => {
  try {
    const results = await db.query(query);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
};
