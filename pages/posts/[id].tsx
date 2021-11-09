import { Layout } from '../../components/Layout';
import { formatDate } from '../../lib/format_date';
import { GetStaticPaths, GetStaticProps } from 'next';
import { markdownToHtml } from '../../lib/md_to_html';
const db = require('../../db');

type PostUrl = {
  id: string;
};

type PostProps = {
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
  let postData = (await db.query(sql)).pop(); //DBから取得した配列から記事データを抜き出す
  postData.created_at = formatDate(postData.created_at);
  postData.updated_at = formatDate(postData.updated_at);
  //postData.content = markdownToHtml(postData.content);
  postData = JSON.parse(JSON.stringify(postData));
  return {
    props: {
      ...postData,
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
