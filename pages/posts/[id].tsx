import { Layout } from '../../components/Layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getPostsDetail } from '../../lib/content';
import { useGetBreadCrumbs } from '../../context/context';
import { BreadCrumbs } from '../../components/BreadCrumbs';
import styles from '../../styles/post.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CircularProgress } from '@mui/material';
import { dbApi } from '../../lib/call_api';
import { DATABASE_QUERY } from '../api/db/query';

/**
 * idのみが格納された型 getStaticPathsで使用する
 */
type PostUrl = {
  id: string;
};

/**
 * 記事データが全て入った型(idのみ任意)
 */
export type PostProps = {
  id?: string;
  title: string;
  content: string;
  thumbnail: string;
  created_at: Date;
  updated_at: Date;
  attachedTag: Array<string>;
};

/**
 * 記事詳細をレンダリングする
 */
const Post = (post: PostProps) => {
  const pageTitle = post.title;
  const restItems = useGetBreadCrumbs();
  const items = [...restItems, { title: pageTitle, path: `/posts/${post.id}` }];
  const router = useRouter();
  if (router.isFallback) {
    return (
      <Layout pageTitle={pageTitle}>
        <BreadCrumbs items={items} />
        <h2 className='page_title'>{pageTitle}</h2>
        <p>
          <CircularProgress />
          Now loading...
        </p>
        <div className='bottom_breadcrumbs_area'>
          <BreadCrumbs items={items} />
        </div>
      </Layout>
    );
  }
  return (
    <Layout pageTitle={pageTitle}>
      <BreadCrumbs items={items} />
      <h2 className='page_title'>{pageTitle}</h2>
      <div className={styles.post_wrapper}>
        <div className='contents_area'>
          <div className={styles.attribute_area}>
            <div className={styles.tags_area}>
              {Object.prototype.hasOwnProperty.call(post, 'attachedTag')
                ? post.attachedTag.map((tag) => (
                    <span className='tags' key={tag.toString()}>
                      <Link href={{ pathname: '/', query: { tag: tag } }}>
                        <a>{tag}</a>
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
      <div className='bottom_breadcrumbs_area'>
        <BreadCrumbs items={items} />
      </div>
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
  const post = await getPostsDetail(id);
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
  const { getDbData } = dbApi();
  // const sql = 'SELECT id FROM articles';
  const posts = (await getDbData(DATABASE_QUERY.ALL_ARTICLES_ID)) as any;
  const paths = posts.map((post: PostUrl) => {
    return { params: { id: post.id.toString() } };
  });
  return {
    paths,
    fallback: true,
  };
};
export default Post;
