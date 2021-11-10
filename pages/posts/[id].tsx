import { Layout } from '../../components/Layout';
import { formatDate } from '../../lib/format_date';
import { GetStaticPaths, GetStaticProps } from 'next';
import { markdownToHtml } from '../../lib/md_to_html';
import { dbQuery } from '../../db';

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
  created_at: Date;
  updated_at: Date;
};

/**
 * 記事詳細をレンダリングする
 * @param params
 * @returns JSX
 */
export default function Post(params: PostProps) {
  return (
    <Layout pageTitle={params.title}>
      <div className='post-meta'>
        <span>投稿日：{params.created_at}</span>
        <br />
        <span>更新日：{params.updated_at}</span>
      </div>
      <div className='post-body' dangerouslySetInnerHTML={{ __html: params.content }} />
    </Layout>
  );
}

/**
 * 記事内容をIDを元に取得し返却する
 * @param {params}
 * @returns props:{...article}
 */
export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  const { id } = params as PostUrl; //PostUrlであることを明示しないとTSが判断できないためasを使用
  const sql = `SELECT * FROM articles WHERE id=${id}`;
  const postInArray = await dbQuery(sql); //DBから取得した配列から記事データを抜き出す
  const content = await markdownToHtml(postInArray[0].content);
  const post = postInArray.map((item: PostProps) => {
    return {
      id: item.id,
      title: item.title,
      content: content,
      created_at: formatDate(item.created_at),
      updated_at: formatDate(item.updated_at),
    };
  });
  return {
    props: {
      ...post.pop(),
    },
  };
};

/**
 * ルーティングのために記事の一覧をDBから取得する
 * @returns paths 中身はparams{id}の一覧
 */
export const getStaticPaths: GetStaticPaths<PostUrl> = async () => {
  const sql = `SELECT id FROM articles`;
  const posts = await dbQuery(sql);
  const paths = posts.map((post: PostUrl) => {
    return { params: { id: post.id.toString() } };
  });
  return {
    paths,
    fallback: false,
  };
};
