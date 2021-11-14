import { GetStaticProps } from 'next';

//Reactモジュール
import { useState } from 'react';

//自作モジュール
import { Layout } from '../components/Layout';
import { Articles } from '../components/Articles';
import { getAllPosts } from '../lib/content';
import { getAllTags } from '../lib/tag';
import { PostProps, TagProps } from '../pages/posts/[id]';
import styles from '../styles/Index.module.scss';
import { LoadMore } from '../components/LoadMore';
import { TagList } from '../components/TagList';

/**
 * ブログ記事一覧用
 */
export type BlogGalleryProps = {
  posts: PostProps[];
  tag: string;
  tags: TagProps[];
};

export const COUNT_PER_POSTS = 5;

const Index = (props: BlogGalleryProps) => {
  const [currentCount, setCount] = useState(COUNT_PER_POSTS);
  const { posts, tags } = props;
  const viewablePosts = posts.slice(0, currentCount);
  const postsLength = posts.length;
  return (
    <Layout pageTitle='BLOG'>
      <div className={styles.wrapper}>
        <TagList tags={tags} />
        <Articles articles={viewablePosts} />
        <LoadMore currentCount={currentCount} setCount={setCount} postsLength={postsLength} />
      </div>
    </Layout>
  );
};

/**
 * 値の読み込みを行う
 */
export const getStaticProps: GetStaticProps<BlogGalleryProps> = async () => {
  const posts = await getAllPosts();
  const tags = await getAllTags();
  return {
    props: {
      posts: posts,
      tag: '',
      tags: JSON.parse(JSON.stringify(tags)),
    },
  };
};

export default Index;
