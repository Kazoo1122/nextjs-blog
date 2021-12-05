import mysql from 'serverless-mysql';
import handler from '../../../lib/handler';
import fs from 'fs';
import path from 'path';
import { TagProps } from '../../admin/resistration_form';
import { THUMBNAIL_IMG_DIR_PATH } from '../../../lib/content';
import { OkPacket, packetCallback } from 'mysql';

const db = mysql({
  config: {
    host: process.env.NEXT_PUBLIC_MYSQL_HOST,
    port: Number(process.env.NEXT_PUBLIC_MYSQL_PORT),
    database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
    user: process.env.NEXT_PUBLIC_MYSQL_USER,
    password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
  },
});

export const DATABASE_QUERY = {
  ALL_ARTICLES: 0,
  TAGS_FOR_ALL_ARTICLES: 1,
  ONE_ARTICLE: 2,
  TAGS_FOR_ONE_ARTICLE: 3,
  ALL_TAGS_ID_AND_NAME: 4,
  ALL_TAGS: 5,
  ALL_ARTICLES_ID: 6,
} as const;

export type DatabaseQuery = typeof DATABASE_QUERY[keyof typeof DATABASE_QUERY];

export default handler
  .get(async (req, res) => {
    const query = req.query.params[0];
    const id = req.query.params[1];
    let sql;
    switch (Number(query)) {
      case DATABASE_QUERY.ALL_ARTICLES:
        sql = 'SELECT * FROM articles';
        break;
      case DATABASE_QUERY.TAGS_FOR_ALL_ARTICLES:
        sql =
          'SELECT articles_id, tag_name FROM tagging_articles INNER JOIN tags ON tagging_articles.tags_id = tags.id;';
        break;
      case DATABASE_QUERY.ONE_ARTICLE:
        sql = `SELECT * FROM articles WHERE id=${id}`;
        break;
      case DATABASE_QUERY.TAGS_FOR_ONE_ARTICLE:
        sql = `SELECT tag_name FROM tagging_articles INNER JOIN tags ON tagging_articles.tags_id = tags.id WHERE tagging_articles.articles_id=${id};`;
        break;
      case DATABASE_QUERY.ALL_TAGS_ID_AND_NAME:
        sql = 'SELECT id, tag_name FROM tags';
        break;
      case DATABASE_QUERY.ALL_TAGS:
        sql = 'SELECT tag_name FROM tags';
        break;
      case DATABASE_QUERY.ALL_ARTICLES_ID:
        sql = 'SELECT id FROM articles';
        break;
      default:
        throw new Error('The given query is incorrect.');
    }
    const result = (await db.query(sql)) as Array<object>;
    await db.end();
    res.status(200).json(result);
  })
  .post(async (req, res) => {
    const THUMBNAIL_IMG_DIR_FULL_PATH = path.join(process.cwd(), 'public', THUMBNAIL_IMG_DIR_PATH);
    const data = req.body;
    const { title, tags, content, thumbnail_name, thumbnail_data } = data;
    if (thumbnail_name !== '') {
      const imgPath = path.join(THUMBNAIL_IMG_DIR_FULL_PATH, thumbnail_name);
      const buffer = new Buffer(thumbnail_data, 'base64');
      fs.writeFile(imgPath, buffer, (err) => {
        if (!err) {
          console.log('Writing completed.');
        } else {
          console.log('Writing is failed.' + err);
          throw err;
        }
      });
    }
    const now = new Date();
    let sql =
      'INSERT INTO articles(title, content, thumbnail, created_at, updated_at) VALUES(?, ?, ?, ?, ?)';
    let values = [title, content, thumbnail_name, now, now];
    try {
      const articleResult: OkPacket = await db.query(sql, values);
      const lastID = articleResult.insertId;
      console.log('article result is:', articleResult);
      const tagsResult: OkPacket[] = [];
      await tags.map(async (tag: TagProps) => {
        sql = 'INSERT INTO tagging_articles(articles_id, tags_id) VALUES(?, ?)';
        values = [lastID, tag.id];
        const result: OkPacket = await db.query(sql, values);
        console.log(result);
        tagsResult.push(result);
      });
      console.log('tags result is:', tagsResult);
      res.status(201).json({ ...data, id: lastID });
    } catch (err) {
      console.log(err, 'databases error.');
    } finally {
      await db.end();
    }
  });
