import Layout from '../../components/Layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import path from 'path';
const db = require('../../db');

type PathParams = {
  id: number;
};

type PageProps = {
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
};

export default function Post(params: any) {
  return (
    <Layout pageTitle={params.title}>
      <div className='post-meta'>
        <span>{params.published}</span>
      </div>
      <div className='post-body' dangerouslySetInnerHTML={{ __html: params.content }} />
    </Layout>
  );
}

export async function getStaticProps(id: number) {
  const sql = `SELECT * FROM articles WHERE id=${id}`;
  const articles = await db.query(sql);
  const article = articles[0];
  return {
    props: {
      article,
    },
  };
}

export async function getStaticPaths() {
  const sql = `SELECT id FROM articles`;
  const idList = db.query(sql);
  idList.forEach((postId) => {
    id = postId.id;
  });
  return {
    paths: idList[0],
    fallback: false,
  };
}
