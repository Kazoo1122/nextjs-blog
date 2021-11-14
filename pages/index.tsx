//Next.jsモジュール
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';

//Reactモジュール
import React, { useState } from 'react';

//自作モジュール
import { Layout } from '../components/Layout';
import { getAllPosts } from '../lib/content';
import { PostProps } from '../pages/posts/[id]';

//CSS
import styles from '../styles/Index.module.scss';

/**
 * ブログ記事一覧用
 */
export type BlogGalleryProps = {
  posts: PostProps[];
  tag?: string;
};

type ReadOnlySettings = {
  readonly COUNT_PER_POSTS: number;
  readonly CHAR_LIMIT: number;
};

export const settings: ReadOnlySettings = {
  COUNT_PER_POSTS: 5,
  CHAR_LIMIT: 128,
};

const Index = (props: BlogGalleryProps) => {
  const [currentCount, setCurrentCount] = useState(settings.COUNT_PER_POSTS);
  const { posts } = props;
  const viewablePosts = posts.slice(0, currentCount);
  return (
    <Layout pageTitle='BLOG'>
      <div className={styles.wrapper}>
        {viewablePosts.map((post) => (
          <article key={post.id} className={styles.posts_list}>
            <div className={styles.image_area}>
              <Link href='/posts/[id]' as={`/posts/${post.id}`} passHref>
                <Image src={post.thumbnail} layout={'fill'} objectFit={'cover'} alt='thumbnail' />
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
                    <span key={tag.toString()} className={styles.tags}>
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
                    {post.content.length > settings.CHAR_LIMIT
                      ? post.content.slice(0, settings.CHAR_LIMIT - 1) + '…'
                      : post.content}
                  </a>
                </p>
              </Link>
            </div>
          </article>
        ))}
        <div className={styles.button_area}>
          {posts.length > currentCount ? (
            <button
              className={styles.load_more}
              onClick={() => setCurrentCount(currentCount + settings.COUNT_PER_POSTS)}
            >
              LOAD MORE
            </button>
          ) : (
            ''
          )}
        </div>
      </div>
    </Layout>
  );
};

/**
 * 値の読み込みを行う
 */
export const getStaticProps: GetStaticProps<BlogGalleryProps> = async () => {
  const posts = await getAllPosts();
  return {
    props: {
      posts: posts,
    },
  };
};

export default Index;
