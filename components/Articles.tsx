import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Index.module.scss';
import { PostProps } from '../pages/posts/[id]';

type ArticleProps = {
  articles: PostProps[];
};

const Articles = (props: ArticleProps) => {
  const CHAR_LIMIT = 128;
  const { articles } = props;
  return (
    <>
      {articles.map((post: PostProps) => (
        <article key={post.id} className={styles.posts_list}>
          <div className={styles.image_area}>
            <Link href='/posts/[id]' as={`/posts/${post.id}`} passHref>
              <>
                <Image src={post.thumbnail} layout={'fill'} objectFit={'cover'} alt='thumbnail' />
              </>
            </Link>
          </div>
          <div className={styles.detail_area}>
            <h3>
              <Link href='/posts/[id]' as={`/posts/${post.id}`} passHref>
                <a>{post.title}</a>
              </Link>
            </h3>
            <div className={styles.attribute_area}>
              <div className={styles.tag_area}>
                {post.attachedTag.map((tag) => (
                  <span key={tag.toString()} className='tags'>
                    <Link href='/tags/[tag]' as={`/tags/${tag}`} passHref>
                      <a>{tag}</a>
                    </Link>
                  </span>
                ))}
              </div>
              <div className={styles.date_area}>
                <p className={styles.date}>
                  作成日時：{post.created_at}
                  <br />
                  更新日時：{post.updated_at}
                </p>
              </div>
            </div>
            <Link href='/posts/[id]' as={`/posts/${post.id}`} passHref>
              <p className={styles.content}>
                <a>
                  {post.content.length > CHAR_LIMIT
                    ? post.content.slice(0, CHAR_LIMIT - 1) + '…'
                    : post.content}
                </a>
              </p>
            </Link>
          </div>
        </article>
      ))}
    </>
  );
};

export { Articles };
