import { GetStaticProps } from 'next';
import useSWRInfinite from 'swr/infinite';
import React, { useContext, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Articles } from '../components/Articles';
import { PostProps } from './posts/[id]';
import styles from '../styles/module/pages/index.module.scss';
import { TagList } from '../components/TagList';
import { BreadCrumbContext } from '../context/context';
import { BreadCrumbItem } from '../components/BreadCrumbs';
import { useRouter } from 'next/dist/client/router';
import { Button, CircularProgress } from '@mui/material';
import axios from 'axios';

/**
 * ブログ記事一覧用
 */
export type BlogGalleryProps = {
  tags: TagProps[];
};

type TagProps = {
  tag_name: string;
  count: number;
};

export const getApi = async (url: string) => {
  const TOKEN = process.env.NEXT_PUBLIC_JWT as string;
  return await axios.get(url, { headers: { Authorization: TOKEN } }).then((res) => {
    return res.data ? res.data : [];
  });
};
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
    const offset = pageIndex * COUNT_PER_POSTS;
    console.log(offset, 'getKeys pageIndex');
    let url = process.env.server + `/api/posts-list?offset=${offset}&limit=${COUNT_PER_POSTS}`;
    url = tag === undefined ? url : url + `&tag=${tag}`;
    return url;
  };

  const fetcher = async (url: string) => {
    return await getApi(url);
  };

  const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher);
  console.log(data, 'data');
  console.log(size, 'size');
  const loadMorePosts = () => {
    console.log(size, 'size');
    return setSize(size + 1);
  };
  const posts = data ? [].concat(...data) : [];
  console.log(posts, 'posts');
  const isLoadingInitialData = !data && !error;
  console.log(isLoadingInitialData, 'isLoadingInitialData');
  const isLoadingMore =
    isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < COUNT_PER_POSTS);
  return (
    <Layout pageTitle={pageTitle}>
      <h2 className='page_title'>{pageTitle}</h2>
      <div className={styles.index_wrapper}>
        <div className='contents_area'>
          <Articles articles={posts} />
          {isReachingEnd ? (
            <>
              <div className={styles.no_more}>no more post.</div>
            </>
          ) : (
            <div className={styles.button_area}>
              <Button
                variant='contained'
                className='button'
                onClick={loadMorePosts}
                disabled={isLoadingMore}
              >
                <div className={styles.load_more}>
                  {!isLoadingMore ? (
                    'LORD MORE'
                  ) : (
                    <>
                      <CircularProgress />
                      <span>Loading...</span>
                    </>
                  )}
                </div>
              </Button>
            </div>
          )}
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
  const url = process.env.server + `/api/tags-list`;
  const tags = await getApi(url);
  return {
    props: {
      tags: JSON.parse(JSON.stringify(tags)),
    },
  };
};

export default Index;
