import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/module/components/articles.module.scss';
import { PostProps } from '../pages/posts/[id]';
import { useMediaQuery } from '@mui/material';

type ArticleProps = {
  articles: PostProps[];
};

export const CHAR_LIMIT = 128;

const Articles = (props: ArticleProps) => {
  const { articles } = props;
  const idUrl = '/posts/[id]';
  const { sm } = styles;
  const isSmSize = useMediaQuery(`(min-width: ${sm})`);
  return (
    <>
      {articles.map((post: PostProps) => (
        <article key={post.id} className={styles.articles_area}>
          {isSmSize ? (
            <Link href={idUrl} as={`/posts/${post.id}`}>
              <a>
                <div className={styles.thumbnail_area}>
                  <Image
                    src={post.thumbnail}
                    layout={'fill'}
                    objectFit={'cover'}
                    alt='thumbnail'
                    priority={true}
                  />
                </div>
              </a>
            </Link>
          ) : (
            ''
          )}
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
                      <a className='tag_text'>{tag}</a>
                    </Link>
                  </span>
                ))}
              </div>
              <div className={styles.date_area}>
                <p className='date_text'>
                  投稿：{post.created_at}
                  <br />
                  更新：{post.updated_at}
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
