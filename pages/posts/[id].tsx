import { Layout } from '../../components/Layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useGetBreadCrumbs, useSetBreadCrumbs } from '../../context/context';
import styles from '../../styles/module/pages/post.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CircularProgress } from '@mui/material';
import { getApi } from '../index';

// idのみが格納された型 getStaticPathsで使用する
export type PostUrl = {
  id: string;
};

// 記事データが全て入った型(idのみ任意)
export type PostProps = {
  id?: string;
  title: string;
  content: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
  attachedTag: Array<string>;
};

/**
 * 記事詳細をレンダリングするコンポーネント
 */
const Post = (post: PostProps) => {
  const pageTitle = post.title;
  const restItems = useGetBreadCrumbs();
  const items = [...restItems, { title: pageTitle, path: `/posts/${post.id}` }];
  useSetBreadCrumbs(items);

  //記事が無かった時に取得している間読み込み画面表示
  const router = useRouter();
  if (router.isFallback) {
    return (
      <Layout pageTitle={pageTitle}>
        <h2 className='page_title'>{pageTitle}</h2>
        <p style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <CircularProgress />
          Now loading...
        </p>
      </Layout>
    );
  }
  return (
    <Layout pageTitle={pageTitle}>
      <h2 className='page_title'>{pageTitle}</h2>
      <div className={styles.post_wrapper}>
        <div className='contents_area'>
          <div className={styles.attribute_area}>
            <div className={styles.tags_area}>
              {Object.prototype.hasOwnProperty.call(post, 'attachedTag')
                ? post.attachedTag.map((tag) => (
                    <span className='tags' key={tag.toString()}>
                      <Link href={{ pathname: '/', query: { tag: tag } }}>
                        <a className='tag_text'>{tag}</a>
                      </Link>
                    </span>
                  ))
                : ''}
            </div>
            <div className={styles.date_area}>
              <p className='date_text'>
                <span>投稿日：{post.created_at}</span>
                <br />
                <span>更新日：{post.updated_at}</span>
              </p>
            </div>
          </div>
          <article className='markdown-body'>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        </div>
      </div>
      <div className='bottom_breadcrumbs_area' />
    </Layout>
  );
};

/**
 * 記事内容をIDを元に取得し返却する
 * @param {params}
 * @returns props:{...article}
 */
export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  const { id } = params as PostUrl; //PostUrlであることを明示しないとTSが判断できないためasを使用
  const url = process.env.server + `/api/post-detail?params=${id}`;
  const post = await getApi(url);
  return {
    props: {
      ...post,
    },
  };
};

/**
 * ルーティングのために記事の一覧をDBから取得する
 * @returns paths 中身はparams{id}の一覧
 */
export const getStaticPaths: GetStaticPaths<PostUrl> = async () => {
  const url = process.env.server + `/api/post-ids`;
  const posts = await getApi(url);
  const paths = posts.map((post: PostUrl) => {
    return { params: { id: post.id.toString() } };
  });
  return {
    paths,
    fallback: true,
  };
};
export default Post;
