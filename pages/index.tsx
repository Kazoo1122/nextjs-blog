import { GetStaticProps } from 'next';
import useSWRInfinite from 'swr/infinite';
import React, { useContext, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Articles } from '../components/Articles';
import { getPosts, THUMBNAIL_IMG_DIR_PATH } from '../lib/content';
import { PostProps } from './posts/[id]';
import styles from '../styles/module/pages/index.module.scss';
import { filterByTags, TagList } from '../components/TagList';
import { BreadCrumbContext } from '../context/context';
import { BreadCrumbItem } from '../components/BreadCrumbs';
import { useRouter } from 'next/dist/client/router';
import { dbAPI } from '../lib/call_api';
import { Button } from '@mui/material';
import axios from 'axios';
import { formatDate, sortWithDate } from '../lib/date';
import { markdownToPlain } from '../lib/md_convert';
import path from 'path';

/**
 * ブログ記事一覧用
 */
export type BlogGalleryProps = {
  // posts: PostProps[];
  tags: TagNames[];
};

type TagNames = {
  tag_name: string;
};

export const DATABASE_QUERY = {
  ARTICLES: 0,
  TAGS_FOR_ARTICLES: 1,
  ONE_ARTICLE: 2,
  TAGS_FOR_ONE_ARTICLE: 3,
  ALL_TAGS_ID_AND_NAME: 4,
  ALL_TAGS: 5,
  ALL_ARTICLES_ID: 6,
} as const;
export type DatabaseQuery = typeof DATABASE_QUERY[keyof typeof DATABASE_QUERY];

const token = process.env.NEXT_PUBLIC_JWT as string;

export const COUNT_PER_POSTS = 5;

const Index = (props: BlogGalleryProps) => {
  const router = useRouter();
  const tag = router.query.tag as string;
  const { tags } = props;

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

  const getKey = (pageIndex: number, previousPageData: PostProps[]) => {
    if (previousPageData && !previousPageData.length) return null;
    console.log(pageIndex, 'getKeys pageIndex');
    return (
      process.env.server + `/api/articles?query=0&params=${pageIndex}&params=${COUNT_PER_POSTS}`
    );
    // return [pageIndex];
  };

  const fetcher = async (url: string) => {
    console.log(url, 'url');
    return await axios.get(url, { headers: { Authorization: token } }).then((res) => res.data);
  };

  const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher);
  console.log(data, 'data');
  console.log(size, 'size');
  const loadMorePosts = () => {
    return setSize(size + 1);
  };
  const posts = data ? [].concat(...data) : [];
  console.log(posts, 'posts');
  const filteredPosts = tag === undefined ? posts : filterByTags(posts, tag);

  const isLoadingInitialData = !data && !error;
  console.log(isLoadingInitialData, 'isLoadingInitialData');
  const isLoadingMore =
    isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
  // const isEmpty = data?.[0]?.length === 0;
  // const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < COUNT_PER_POSTS);
  return (
    <Layout pageTitle={pageTitle}>
      <h2 className='page_title'>{pageTitle}</h2>
      <div className={styles.index_wrapper}>
        <div className='contents_area'>
          <Articles articles={filteredPosts} />
          {/*{isReachingEnd ? (*/}
          <div className={styles.button_area}>
            <Button
              variant='contained'
              className='button'
              onClick={loadMorePosts}
              // disabled={isLoadingMore}
            >
              <div className={styles.load_more}>
                {!isLoadingMore ? 'LORD MORE' : 'Now Loading...'}
              </div>
            </Button>
          </div>
          {/*) : (*/}
          {/*  ''*/}
          {/*)}*/}
        </div>
        <div className='side_area'>
          <TagList tags={tags} />
        </div>
      </div>
    </Layout>
  );
};

/**
 * 値の読み込みを行う
 */
export const getStaticProps: GetStaticProps<BlogGalleryProps> = async () => {
  const { getDbData } = dbAPI();
  // const posts = await getPosts();
  const tags = await getDbData(DATABASE_QUERY.ALL_TAGS);
  return {
    props: {
      // posts: posts,
      tags: JSON.parse(JSON.stringify(tags)),
    },
  };
};

export default Index;
