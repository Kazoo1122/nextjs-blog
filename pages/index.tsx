import Layout from '../components/Layout';
import Link from 'next/link';
import { GetStaticProps } from 'next';
const db = require('../db');

export default function Home(props: any) {
  const { posts } = props;
  return (
    <Layout pageTitle='BLOG'>
      {posts.map((post: any) => (
        <div key={post.id} className='post-teaser'>
          <h3>
            <Link href='/posts/[id]' as={`/posts/${post.id}`}>
              <a>{post.title}</a>
            </Link>
          </h3>
          <div>
            <span>{post.created_at}</span>
          </div>
        </div>
      ))}
    </Layout>
  );
}

/**
 * 値の読み込みを行う
 */
export const getStaticProps: GetStaticProps = async (context) => {
  const MAX_COUNT = 5;
  const sql = `SELECT * FROM articles`;
  const data = await db.query(sql);
  const posts = JSON.parse(JSON.stringify(data));
  return {
    props: {
      posts: posts.slice(0, MAX_COUNT),
    },
  };
};
