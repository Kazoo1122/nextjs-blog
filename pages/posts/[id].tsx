import Layout from '../../components/Layout';
import { GetStaticPaths, GetStaticProps } from 'next';
const db = require('../../db');

export default function Post(params: any) {
  return (
    <Layout pageTitle={params.title}>
      <div className='post-meta'>
        <span>投稿日：{params.created_at}</span>
        <span>更新日：{params.updated_at}</span>
        <span>{params.title}</span>
      </div>
      <div className='post-body' dangerouslySetInnerHTML={{ __html: params.content }} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const { id } = context.params as PathParams;
  const sql = `SELECT * FROM articles WHERE id=${id}`;
  const data = await db.query(sql);
  const articles = JSON.parse(JSON.stringify(data));
  const article = articles[0];
  return {
    props: {
      ...article,
    },
  };
};

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const sql = `SELECT id FROM articles`;
  const posts = await db.query(sql);
  console.log(posts);
  const paths = posts.map((post: any) => {
    return { params: { id: post.id.toString() } };
  });
  console.log(paths);
  return {
    paths,
    fallback: false,
  };
};
