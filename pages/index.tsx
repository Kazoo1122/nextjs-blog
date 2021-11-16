import { GetStaticProps } from 'next';

//Reactモジュール
import { useContext, useEffect, useState } from 'react';

//自作モジュール
import { Layout } from '../components/Layout';
import { Articles } from '../components/Articles';
import { getAllPosts } from '../lib/content';
import { getAllTags } from '../lib/tag';
import { PostProps, TagProps } from '../pages/posts/[id]';
import styles from '../styles/Index.module.scss';
import { LoadMore } from '../components/LoadMore';
import { TagList } from '../components/TagList';
import { BreadCrumbContext } from '../context/context';
import { BreadCrumbs } from '../components/BreadCrumbs';

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
  const pageTitle = 'BLOG';
  const items = [{ title: 'HOME', path: '/' }];
  const context = useContext(BreadCrumbContext);
  useEffect(() => {
    context.setItems([]);
    context.setItems(items);
  });
  return (
    <Layout pageTitle={pageTitle}>
      <BreadCrumbs items={context.items} />
      <h2 className='page_title'>{pageTitle}</h2>
      <div className={styles.wrapper}>
        <div className={styles.main_area}>
          <Articles articles={viewablePosts} />
          <LoadMore currentCount={currentCount} setCount={setCount} postsLength={postsLength} />
        </div>
        <div className={styles.side_area}>
          <TagList tags={tags} posts={posts} tag='' />
        </div>
      </div>
      <BreadCrumbs items={context.items} />
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
