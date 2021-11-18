import { GetStaticProps } from 'next';

//Reactモジュール
import { useState } from 'react';

//自作モジュール
import { Layout } from '../components/Layout';
import { Articles } from '../components/Articles';
import { getAllPosts } from '../lib/content';
import { getAllTags } from '../lib/tag';
import { PostProps, TagProps } from './posts/[id]';
import styles from '../styles/index.module.scss';
import { LoadMore } from '../components/LoadMore';
import { filterByTags, TagList } from '../components/TagList';
import { useSetBreadCrumbs } from '../context/context';
import { BreadCrumbItem, BreadCrumbs } from '../components/BreadCrumbs';
import { useRouter } from 'next/dist/client/router';

/**
 * ブログ記事一覧用
 */
export type BlogGalleryProps = {
  posts: PostProps[];
  tag: string;
  tags: TagProps[];
};

export const COUNT_PER_POSTS = 5;

export default function Index(props: BlogGalleryProps) {
  const router = useRouter();
  const tag = router.query.tag as string;
  const [currentCount, setCount] = useState(COUNT_PER_POSTS);
  const { posts, tags } = props;
  const filteredPosts = tag === undefined ? posts : filterByTags(posts, tag);
  const viewablePosts = filteredPosts.slice(0, currentCount);
  const postsLength = filteredPosts.length;
  const pageTitle = tag === undefined ? 'BLOG' : 'Tags:' + tag;
  const items: BreadCrumbItem[] = [{ title: 'HOME', path: '/' }];
  tag !== undefined
    ? items.push({
        title: pageTitle,
        path: { pathname: '/', query: { tag: tag } },
      })
    : '';
  useSetBreadCrumbs(items);
  return (
    <Layout pageTitle={pageTitle}>
      <BreadCrumbs items={items} />
      <h2 className='page_title'>{pageTitle}</h2>
      <div className={styles.index_wrapper}>
        <div className='contents_area'>
          <Articles articles={viewablePosts} />
          <LoadMore currentCount={currentCount} setCount={setCount} postsLength={postsLength} />
        </div>
        <div className='side_area'>
          <TagList tags={tags} posts={posts} tag='' />
        </div>
      </div>
      <div className='bottom_breadcrumbs_area'>
        <BreadCrumbs items={items} />
      </div>
    </Layout>
  );
}

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
