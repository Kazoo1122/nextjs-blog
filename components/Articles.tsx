import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/articles.module.scss';
import { PostProps } from '../pages/posts/[id]';

type ArticleProps = {
  articles: PostProps[];
};

const Articles = (props: ArticleProps) => {
  const CHAR_LIMIT = 128;
  const { articles } = props;
  const idUrl = '/posts/[id]';
  return (
    <>
      {articles.map((post: PostProps) => (
        <article key={post.id} className={styles.articles_area}>
          <div className={styles.thumbnail_area}>
            <Link href={idUrl} as={`/posts/${post.id}`}>
              <a>
                <Image src={post.thumbnail} layout={'fill'} objectFit={'cover'} alt='thumbnail' />
              </a>
            </Link>
          </div>
          <div className={styles.summary_area}>
            <div className={styles.articles_title_area}>
              <Link href={idUrl} as={`/posts/${post.id}`}>
                <a className={styles.articles_title_text}>{post.title}</a>
              </Link>
            </div>
            <div className={styles.attribute_area}>
              <div className={styles.tags_area}>
                {post.attachedTag.map((tag) => (
                  <span key={tag.toString()} className='tags'>
                    <Link href={{ pathname: '/', query: { tag: tag } }}>
                      <a>{tag}</a>
                    </Link>
                  </span>
                ))}
              </div>
              <div className={styles.date_area}>
                <p className='date_text'>
                  作成日時：{post.created_at}
                  <br />
                  更新日時：{post.updated_at}
                </p>
              </div>
            </div>
            <Link href={idUrl} as={`/posts/${post.id}`}>
              <a className={styles.body_area}>
                {post.content.length > CHAR_LIMIT
                  ? post.content.slice(0, CHAR_LIMIT - 1) + '…'
                  : post.content}
              </a>
            </Link>
          </div>
        </article>
      ))}
    </>
  );
};

export { Articles };
