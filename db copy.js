import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.NEXT_PUBLIC_MYSQL_HOST,
    port: process.env.NEXT_PUBLIC_MYSQL_PORT,
    database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
    user: process.env.NEXT_PUBLIC_MYSQL_USER,
    password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
  },
});

export async function query(query) {
  try {
    const results = await db.query(query);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}

const test = async () => {
  const result = await db.query(`
  select * from articles
  `);
  return result;
};
test();
