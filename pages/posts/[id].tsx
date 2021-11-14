import { Layout } from '../../components/Layout';
import { formatDate } from '../../lib/format_date';
import { GetStaticPaths, GetStaticProps } from 'next';
import { markdownToHtml } from '../../lib/md_convert';
import { dbQuery } from '../../db';

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
  attachedTag: Array<TagProps>;
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
            // eslint-disable-next-line react/jsx-key
            <span className='tags'>{tag}</span>
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
  const queryAboutArticle = `SELECT * FROM articles WHERE id=${id}`;
  const post = (await dbQuery(queryAboutArticle)).pop(); //DBから取得した配列から記事データを抜き出す

  const queryAboutTags = `SELECT tag_name FROM tagging_articles INNER JOIN tags ON tagging_articles.tags_id = tags.id WHERE tagging_articles.articles_id=${id};`;
  const tags = await dbQuery(queryAboutTags); //タグと記事との紐付け一覧をDBから取得
  console.log(tags, ':tags');
  //タグと紐づいている記事を探し、あれば配列として格納する
  tags.forEach((tag: TagProps) => {
    if (post.hasOwnProperty('attachedTag') === false) {
      post.attachedTag = [];
    }
    post.attachedTag.push(tag.tag_name);
  });

  post.content = await markdownToHtml(post.content);
  post.created_at = formatDate(post.created_at);
  post.updated_at = formatDate(post.updated_at);

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
