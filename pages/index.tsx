import { GetStaticProps } from 'next';

//Reactモジュール
import { useContext, useEffect, useState } from 'react';

//自作モジュール
import { Layout } from '../components/Layout';
import { Articles } from '../components/Articles';
import { getAllPosts } from '../lib/content';
import { PostProps } from './posts/[id]';
import styles from '../styles/module/pages/index.module.scss';
import { LoadMore } from '../components/LoadMore';
import { filterByTags, TagList } from '../components/TagList';
import { BreadCrumbContext } from '../context/context';
import { BreadCrumbItem } from '../components/BreadCrumbs';
import { useRouter } from 'next/dist/client/router';
import { dbApi } from '../lib/call_api';
import { DATABASE_QUERY } from './api/db/query';

/**
 * ブログ記事一覧用
 */
export type BlogGalleryProps = {
  posts: PostProps[];
  tags: TagNames[];
};

type TagNames = {
  tag_name: string;
};

export const COUNT_PER_POSTS = 5;

const Index = (props: BlogGalleryProps) => {
  const router = useRouter();
  const tag = router.query.tag as string;
  const [currentCount, setCount] = useState(COUNT_PER_POSTS);
  const { posts, tags } = props;
  const filteredPosts = tag === undefined ? posts : filterByTags(posts, tag);
  const viewablePosts = filteredPosts.slice(0, currentCount);
  const postsLength = filteredPosts.length;
  const pageTitle = tag === undefined ? 'BLOG' : 'Tags:' + tag;
  const items: BreadCrumbItem[] = [{ title: 'HOME', path: '/' }];
  if (tag !== undefined) {
    items.push({
      title: pageTitle,
      path: { pathname: '/', query: { tag: tag } },
    });
  }
  //contextのセッター(useSetBreadCrumbs)はcontext.tsに用意しているが、
  // indexページはtagの値が変更されたら発火するようにしたいため、直接useContextを使用している
  const context = useContext(BreadCrumbContext);
  useEffect(() => {
    context.setItems(items);
  }, [tag]);

  return (
    <Layout pageTitle={pageTitle}>
      <h2 className='page_title'>{pageTitle}</h2>
      <div className={styles.index_wrapper}>
        <div className='contents_area'>
          <Articles articles={viewablePosts} />
          <LoadMore currentCount={currentCount} setCount={setCount} postsLength={postsLength} />
        </div>
        <div className='side_area'>
          <TagList tags={tags} posts={posts} />
        </div>
      </div>
    </Layout>
  );
};

/**
 * 値の読み込みを行う
 */
export const getStaticProps: GetStaticProps<BlogGalleryProps> = async () => {
  const { getDbData } = dbApi();
  const posts = await getAllPosts();
  // const sql = 'SELECT tag_name FROM tags';
  const tags = await getDbData(DATABASE_QUERY.ALL_TAGS);
  return {
    props: {
      posts: posts,
      tags: JSON.parse(JSON.stringify(tags)),
    },
  };
};

export default Index;
