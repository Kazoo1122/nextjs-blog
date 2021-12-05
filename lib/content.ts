import path from 'path';
import { formatDate, sortWithDate } from './date';
import { markdownToHtml, markdownToPlain } from './md_convert';
import { PostProps } from '../pages/posts/[id]';
import { dbAPI } from './call_api';
import { DATABASE_QUERY } from '../pages/api/db/query';

type LinkingTag = {
  tag_name: string;
  articles_id: string;
};
type Tag = {
  tag_name: string;
};

export const THUMBNAIL_IMG_DIR_PATH = '/images/thumbnail/';

export async function getAllPosts() {
  const NO_IMG_PATH = path.join(THUMBNAIL_IMG_DIR_PATH, 'no_image.png');
  const { getDbData } = dbAPI();
  const posts = (await getDbData(DATABASE_QUERY.ALL_ARTICLES)) as any; //記事一覧をDBから取得
  const tags = (await getDbData(DATABASE_QUERY.TAGS_FOR_ALL_ARTICLES)) as any; //タグと記事との紐付け一覧をDBから取得
  //タグと紐づいている記事を探し、あれば配列として格納する
  tags.forEach((tag: LinkingTag) => {
    const taggedPost = posts.find((post: PostProps) => tag.articles_id === post.id);
    if (Object.prototype.hasOwnProperty.call(taggedPost, 'attachedTag') === false) {
      taggedPost.attachedTag = [];
    }

    taggedPost.attachedTag.push(tag.tag_name);
  });

  const sortedPosts = posts.sort(sortWithDate('created_at', true));

  //各記事の日付と内容を整形
  return sortedPosts.map((item: PostProps) => {
    return {
      id: item.id,
      title: item.title,
      content: markdownToPlain(item.content),
      created_at: formatDate(item.created_at),
      updated_at: formatDate(item.updated_at),
      thumbnail:
        item.thumbnail !== null ? path.join(THUMBNAIL_IMG_DIR_PATH, item.thumbnail) : NO_IMG_PATH,
      attachedTag: Object.prototype.hasOwnProperty.call(item, 'attachedTag')
        ? item.attachedTag
        : [],
    };
  });
}

export async function getPostsDetail(id: string) {
  const { getDbData } = dbAPI();
  const posts = (await getDbData(DATABASE_QUERY.ONE_ARTICLE, id)) as any;
  const post = posts.pop(); //DBから取得した配列から記事データを抜き出す
  const tags = await getDbData(DATABASE_QUERY.TAGS_FOR_ONE_ARTICLE, id); //タグと記事との紐付け一覧をDBから取得
  const arrayTags: Tag[] = JSON.parse(JSON.stringify(tags));
  //タグと紐づいている記事を探し、あれば配列として格納する
  arrayTags.forEach((tag) => {
    if (Object.prototype.hasOwnProperty.call(post, 'attachedTag') === false) {
      post.attachedTag = [];
    }
    post.attachedTag.push(tag.tag_name);
  });

  post.content = await markdownToHtml(post.content);
  post.created_at = formatDate(post.created_at);
  post.updated_at = formatDate(post.updated_at);

  return post;
}
