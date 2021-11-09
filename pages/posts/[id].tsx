import Layout from '../../components/Layout';
import { GetStaticPaths, GetStaticProps } from 'next';
const db = require('../../db');

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
 * @param context
 * @returns props:{...article}
 */
export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  const { id } = params as PostUrl; //PostUrlであることを明示しないとTSが判断できないためasを使用
  const sql = `SELECT * FROM articles WHERE id=${id}`;
  const data = await db.query(sql);
  console.log(data[0].created_at);
  data[0].created_at = formatDate(data[0].created_at);
  data[0].updated_at = formatDate(data[0].updated_at);
  const articles = JSON.parse(JSON.stringify(data));
  const article = articles[0];
  return {
    props: {
      ...article,
    },
  };
};

/**
 * ルーティングのために記事の一覧をDBから取得する
 * @returns paths 中身はparams{id}の一覧
 */
export const getStaticPaths: GetStaticPaths<PostUrl> = async () => {
  const sql = `SELECT id FROM articles`;
  const posts = await db.query(sql);
  const paths = posts.map((post: PostUrl) => {
    return { params: { id: post.id.toString() } };
  });
  return {
    paths,
    fallback: false,
  };
};

/**
 * 日時を整形する
 * @param date
 * @returns string
 */
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = zeroFill(date.getHours(), false);
  const minute = zeroFill(date.getMinutes(), false);
  return `${year}年${month}月${day}日 ${hour}:${minute}`;
};

/**
 * 10未満の数値を0埋めする
 * @param checkedNum
 * @param isMonth 月の場合は1加算
 * @returns
 */
const zeroFill = (checkedNum: number, isMonth: boolean) => {
  let threshold;
  isMonth === true ? (threshold = 9) : (threshold = 10);
  return (checkedNum < threshold ? '0' : '') + checkedNum;
};
