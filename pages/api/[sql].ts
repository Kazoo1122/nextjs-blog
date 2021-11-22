import mysql from 'serverless-mysql';
import handler from '../../lib/handler';

const db = mysql({
  config: {
    host: process.env.NEXT_PUBLIC_MYSQL_HOST,
    port: Number(process.env.NEXT_PUBLIC_MYSQL_PORT),
    database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
    user: process.env.NEXT_PUBLIC_MYSQL_USER,
    password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
  },
});

export default handler
  .get(async (req, res) => {
    console.log(req.query.sql, 'before sql');
    const sql = decodeURI(req.query.sql as string);
    console.log(sql, 'after sql');
    const result = (await db.query(sql)) as any;
    await db.end();
    res.status(200).json(result);
  })
  .post(async (req, res) => {
    const query = req.body;
    const { lastID } = await db.query(query);
    await db.end();
    res.status(201).json({ ...req.body, id: lastID });
  });

/*
export const dbQuery = async (sql: string) => {
  try {
    const results = (await db.query(sql)) as any;
    await db.end();
    return results;
  } catch (error) {
    return { error }; // TODO: エラー時の例外処理が必要
  }
};
*/
