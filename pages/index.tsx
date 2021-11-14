import { GetStaticProps } from 'next';

//Reactモジュール
import React, { useState } from 'react';

//自作モジュール
import { Layout } from '../components/Layout';
import { Articles } from '../components/Articles';
import { getAllPosts } from '../lib/content';
import { PostProps } from '../pages/posts/[id]';
import styles from '../styles/Index.module.scss';
import { LoadMore } from '../components/LoadMore';

/**
 * ブログ記事一覧用
 */
export type BlogGalleryProps = {
  posts: PostProps[];
  tag: string;
};

export const COUNT_PER_POSTS = 5;

const Index = (props: BlogGalleryProps) => {
  const [currentCount, setCount] = useState(COUNT_PER_POSTS);
  const { posts } = props;
  const viewablePosts = posts.slice(0, currentCount);
  const postsLength = posts.length;
  return (
    <Layout pageTitle='BLOG'>
      <div className={styles.wrapper}>
        <Articles articles={viewablePosts} />
        <LoadMore
          currentCount={currentCount}
          setCount={setCount}
          posts={posts}
          postsLength={postsLength}
        />
      </div>
    </Layout>
  );
};

/**
 * 値の読み込みを行う
 */
export const getStaticProps: GetStaticProps<BlogGalleryProps> = async () => {
  const posts = await getAllPosts();
  return {
    props: {
      posts: posts,
      tag: '',
    },
  };
};

export default Index;
