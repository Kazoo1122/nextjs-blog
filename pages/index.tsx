import { GetStaticProps } from 'next';
import useSWRInfinite from 'swr/infinite';
import React, { useContext, useEffect } from 'react';
import styles from '../styles/module/pages/index.module.scss';
import { Layout } from '../components/Layout';
import { Articles } from '../components/Articles';
import { TagList } from '../components/TagList';
import { BreadCrumbItem } from '../components/BreadCrumbs';
import { BreadCrumbContext } from '../context/context';
import { PostProps } from './posts/[id]';
import { useRouter } from 'next/dist/client/router';
import { Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useStyles } from './_app';

export type TagProps = {
  id?: number;
  tag_name: string;
  count?: number;
};

// APIへGETリクエストを投げる際に使用
export const getApi = async (url: string) => {
  const TOKEN = process.env.NEXT_PUBLIC_JWT as string;
  return await axios.get(url, { headers: { Authorization: TOKEN } }).then((res) => {
    return res.data ? res.data : [];
  });
};

// 一回あたりの記事表示件数
export const COUNT_PER_POSTS = 5;

// トップページのコンポーネント
const Index = (props: { tags: TagProps[] }) => {
  const classes = useStyles();
  const router = useRouter();
  const tag = router.query.tag as string;
  const { tags } = props;

  const pageTitle = tag === undefined ? 'BLOG' : 'Tags:' + tag;
  //contextのセッター(useSetBreadCrumbs)はcontext.tsに用意しているが、
  // indexページはtagの値が変更されたら発火するようにしたいため、直接useContextを使用している
  const context = useContext(BreadCrumbContext);
  useEffect(
    () => {
      const items: BreadCrumbItem[] = [{ title: 'HOME', path: '/' }];
      if (tag !== undefined) {
        items.push({
          title: pageTitle,
          path: { pathname: '/', query: { tag: tag } },
        });
      }
      context.setItems(items);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // データフェッチのためのキーを取得する useSWRInfiniteで使用
  const getKey = (pageIndex: number, previousPageData: PostProps[]) => {
    if (previousPageData && !previousPageData.length) return null;
    const offset = pageIndex * COUNT_PER_POSTS;
    let url = process.env.server + `/api/posts-list?offset=${offset}&limit=${COUNT_PER_POSTS}`;
    url = tag === undefined ? url : url + `&tag=${tag}`;
    return url;
  };

  // 実際にデータフェッチする関数 useSWRInfiniteで使用
  const fetcher = async (url: string) => {
    return await getApi(url);
  };

  // 無限読み込みのための関数
  const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher);

  const loadMorePosts = () => {
    return setSize(size + 1);
  };

  const posts = data ? [].concat(...data) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < COUNT_PER_POSTS);

  return (
    <Layout pageTitle={pageTitle}>
      <h2 className='page_title'>{pageTitle}</h2>
      <div className='wrapper'>
        <div className='contents_area'>
          <Articles articles={posts} />
          {!isReachingEnd ? (
            <div className={styles.button_area}>
              <Button
                variant='contained'
                className={classes.button}
                onClick={loadMorePosts}
                disabled={isLoadingMore}
                sx={{
                  marginTop: '32px',
                  fontWeight: '800',
                  fontSize: '16px',
                  fontFamily: 'Spartan, sans-serif',
                  borderRadius: '18px',
                  lineHeight: '250%',
                }}
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
          ) : (
            ''
          )}
        </div>
        <div className='side_area'>
          <TagList tags={tags} />
        </div>
      </div>
    </Layout>
  );
};

// タグ一覧のデータを取得
export const getStaticProps: GetStaticProps<{ tags: TagProps[] }> = async () => {
  const url = process.env.server + `/api/tags-list`;
  const tags = await getApi(url);
  return {
    props: {
      tags: JSON.parse(JSON.stringify(tags)),
    },
  };
};

export default Index;
