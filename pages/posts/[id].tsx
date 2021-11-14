import { Layout } from '../../components/Layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import { dbQuery } from '../../db';
import { getPostsDetail } from '../../lib/content';

/**
 * idのみが格納された型 getStaticPathsで使用する
 */
type PostUrl = {
  id: string;
};

export type TagProps = {
  articles_id: string;
  tag_name: string;
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
 * @param params
 * @returns JSX
 */
export default function Post(post: PostProps) {
  return (
    <Layout pageTitle={post.title}>
      <div className='post-meta'>
        <span>投稿日：{post.created_at}</span>
        <br />
        <span>更新日：{post.updated_at}</span>
      </div>
      {post.hasOwnProperty('attachedTag')
        ? post.attachedTag.map((tag) => (
            <span className='tags' key={tag.toString()}>
              {tag}
            </span>
          ))
        : ''}
      <div className='post-body' dangerouslySetInnerHTML={{ __html: post.content }} />
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
  const queryAboutId = `SELECT id FROM articles`;
  const posts = await dbQuery(queryAboutId);
  const paths = posts.map((post: PostUrl) => {
    return { params: { id: post.id.toString() } };
  });
  return {
    paths,
    fallback: false,
  };
};
