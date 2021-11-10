import { Layout } from '../components/Layout';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { dbQuery } from '../db';
import { PostProps } from '../pages/posts/[id]';
import { formatDate } from '../lib/format_date';
import React, { useState } from 'react';

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
  const COUNT_PER_POSTS = 5;
  const [currentCount, setCurrentCount] = useState(COUNT_PER_POSTS);
  const { posts } = props;
  const viewablePosts = posts.slice(0, currentCount);
  return (
    <Layout pageTitle='BLOG'>
      {viewablePosts.map((post) => (
        <div key={post.id} className='post-teaser'>
          <h3>
            <Link href='/posts/[id]' as={`/posts/${post.id}`}>
              <a>{post.title}</a>
            </Link>
          </h3>
          <div>
            <span>{post.updated_at}</span>
          </div>
        </div>
      ))}
      {posts.length > currentCount ? (
        <button onClick={() => setCurrentCount(currentCount + COUNT_PER_POSTS)}>LOAD MORE</button>
      ) : (
        ''
      )}
    </Layout>
  );
};

/**
 * 値の読み込みを行う
 */
export const getStaticProps: GetStaticProps<BlogGalleryProps> = async () => {
  const sql = `SELECT * FROM articles`;
  const posts = await dbQuery(sql);
  const sortedPosts = posts.sort(sortWithProps('updated_at', true));

  const formattedPosts = sortedPosts.map((item: PostProps) => {
    return {
      id: item.id,
      title: item.title,
      content: item.content,
      created_at: formatDate(item.created_at),
      updated_at: formatDate(item.updated_at),
    };
  });

  return {
    props: {
      posts: formattedPosts,
    },
  };
};

/**
 * sort関数のために大小を比較する
 * @param sortedName
 * @param reversed
 * @returns 1 or -1
 */
const sortWithProps = (sortedName: string, reversed: boolean) => (a: PostItems, b: PostItems) => {
  if (reversed) {
    return a[sortedName] < b[sortedName] ? 1 : -1;
  } else {
    return a[sortedName] > b[sortedName] ? -1 : 1;
  }
};

export default Home;
