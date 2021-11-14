import path from 'path';
import { dbQuery } from '../db';
import { formatDate, sortWithDate } from './date';
import { markdownToPlain, markdownToHtml } from '../lib/md_convert';
import { PostProps, TagProps } from '../pages/posts/[id]';

export async function getAllPosts() {
  const IMG_DIR_PATH = '/images';
  const NO_IMG_PATH = path.join(IMG_DIR_PATH, '/no_image.png');

  const queryAboutArticles = 'SELECT * FROM articles';
  const posts = await dbQuery(queryAboutArticles); //記事一覧をDBから取得
  const queryAboutTags =
    'SELECT articles_id, tag_name FROM tagging_articles INNER JOIN tags ON tagging_articles.tags_id = tags.id;';
  const tags = await dbQuery(queryAboutTags); //タグと記事との紐付け一覧をDBから取得

  //タグと紐づいている記事を探し、あれば配列として格納する
  tags.forEach((tag: TagProps) => {
    const taggedPost = posts.find((post: PostProps) => tag.articles_id === post.id);
    if (taggedPost.hasOwnProperty('attachedTag') === false) {
      taggedPost.attachedTag = [];
    }

    taggedPost.attachedTag.push(tag.tag_name);
  });

  const sortedPosts = posts.sort(sortWithDate('created_at', true));

  //各記事の日付と内容を整形
  const formattedPosts = sortedPosts.map((item: PostProps) => {
    return {
      id: item.id,
      title: item.title,
      content: markdownToPlain(item.content),
      created_at: formatDate(item.created_at),
      updated_at: formatDate(item.updated_at),
      thumbnail: item.thumbnail !== null ? path.join(IMG_DIR_PATH, item.thumbnail) : NO_IMG_PATH,
      attachedTag: item.hasOwnProperty('attachedTag') ? item.attachedTag : [],
    };
  });

  return formattedPosts;
}

export async function getPostsDetail(id: string) {
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

  return post;
}
