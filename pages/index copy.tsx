import { Layout } from '../components/Layout';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { dbQuery } from '../db';
import { PostProps } from '../pages/posts/[id]';
import { formatDate } from '../lib/format_date';

/**
 * JSON形式で文字列を格納した型
 */
type PostItems = {
  [key: string]: string;
};

/**
 * ブログ記事一覧用
 */
type BlogGalleryProps = {
  posts: PostItems[];
};

const Home = (props: BlogGalleryProps) => {
  const { posts } = props;
  return (
    <Layout pageTitle='BLOG'>
      {posts.map((post) => (
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
};

/**
 * 値の読み込みを行う
 */
export const getStaticProps: GetStaticProps<BlogGalleryProps> = async () => {
  const MAX_COUNT = 5;
  const sql = `SELECT * FROM articles`;
  const postsInArray = await dbQuery(sql);
  const sortedPosts = postsInArray.sort(sortWithProps('created_at', true));

  const posts = sortedPosts.map((item: PostProps) => {
    return {
      id: item.id,
      title: item.title,
      content: item.content,
      created_at: formatDate(item.created_at),
      updated_at: formatDate(item.updated_at),
    };
  });
  //const jsonArray = JSON.parse(JSON.stringify(posts));
  return {
    props: {
      posts: posts.slice(0, MAX_COUNT),
    },
  };
};

const sortWithProps = (sortedName: string, reversed: boolean) => (a: any, b: any) => {
  if (reversed) {
    return a.sortedName < b.sortedName ? 1 : -1;
  } else {
    return a.sortedName < b.sortedName ? -1 : 1;
  }
};

export default Home;
