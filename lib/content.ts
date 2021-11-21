import path from 'path';
import { formatDate, sortWithDate } from './date';
import { markdownToHtml, markdownToPlain } from './md_convert';
import { PostProps } from '../pages/posts/[id]';
import { getDbApi } from './call_api';

type LinkingTag = {
  tag_name: string;
  articles_id: string;
};

export async function getAllPosts() {
  const IMG_DIR_PATH = '/images';
  const NO_IMG_PATH = path.join(IMG_DIR_PATH, '/no_image.png');
  const { getDbData } = getDbApi();

  const sqlAboutArticles = 'SELECT * FROM articles';
  const encodedSql = encodeURI(sqlAboutArticles);
  const posts = (await getDbData(encodedSql)) as any; //記事一覧をDBから取得
  const postsToJSON = await posts.json();
  const sqlAboutTags =
    'SELECT articles_id, tag_name FROM tagging_articles INNER JOIN tags ON tagging_articles.tags_id = tags.id;';
  const tags = (await getDbData(encodeURI(sqlAboutTags))) as any; //タグと記事との紐付け一覧をDBから取得
  const tagsToJSON = await tags.json();
  //タグと紐づいている記事を探し、あれば配列として格納する
  tagsToJSON.forEach((tag: LinkingTag) => {
    const taggedPost = postsToJSON.find((post: PostProps) => tag.articles_id === post.id);
    if (Object.prototype.hasOwnProperty.call(taggedPost, 'attachedTag') === false) {
      taggedPost.attachedTag = [];
    }

    taggedPost.attachedTag.push(tag.tag_name);
  });

  const sortedPosts = postsToJSON.sort(sortWithDate('created_at', true));

  //各記事の日付と内容を整形
  return sortedPosts.map((item: PostProps) => {
    return {
      id: item.id,
      title: item.title,
      content: markdownToPlain(item.content),
      created_at: formatDate(item.created_at),
      updated_at: formatDate(item.updated_at),
      thumbnail: item.thumbnail !== null ? path.join(IMG_DIR_PATH, item.thumbnail) : NO_IMG_PATH,
      attachedTag: Object.prototype.hasOwnProperty.call(item, 'attachedTag')
        ? item.attachedTag
        : [],
    };
  });
}

export async function getPostsDetail(id: string) {
  const { getDbData } = getDbApi();
  const sqlAboutArticle = `SELECT * FROM articles WHERE id=${id}`;
  const post = ((await getDbData(encodeURI(sqlAboutArticle))) as any).pop(); //DBから取得した配列から記事データを抜き出す

  const sqlAboutTags = `SELECT tag_name FROM tagging_articles INNER JOIN tags ON tagging_articles.tags_id = tags.id WHERE tagging_articles.articles_id=${id};`;
  const tags = await getDbData(encodeURI(sqlAboutTags)); //タグと記事との紐付け一覧をDBから取得
  const arrayTags: string[] = JSON.parse(JSON.stringify(tags));
  //タグと紐づいている記事を探し、あれば配列として格納する
  arrayTags.forEach((tag) => {
    if (Object.prototype.hasOwnProperty.call(post, 'attachedTag') === false) {
      post.attachedTag = [];
    }
    post.attachedTag.push(tag);
  });

  post.content = await markdownToHtml(post.content);
  post.created_at = formatDate(post.created_at);
  post.updated_at = formatDate(post.updated_at);

  return post;
}
