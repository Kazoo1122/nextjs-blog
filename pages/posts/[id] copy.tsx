import Layout from '../../components/Layout';
import { GetStaticPaths, GetStaticProps } from 'next';
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

export async function getStaticProps({ params }: any) {
  const sql = `SELECT * FROM articles WHERE id=${params.id}`;
  const articles = await db.query(sql);
  const article = articles[0];
  return {
    props: {
      ...article,
    },
  };
}

export async function getStaticPaths() {
  const sql = `SELECT id FROM articles`;
  const paths = db.query(sql).map((post: any) => {
    params: {
      id: post.id;
    }
  });
  return {
    props: paths,
    fallback: false,
  };
}
