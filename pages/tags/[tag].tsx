//Next.jsモジュール
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps, GetStaticPaths } from 'next';

//Reactモジュール
import React, { useState } from 'react';

//自作モジュール
import { Layout } from '../../components/Layout';
import { getAllPosts } from '../../lib/content';
import { BlogGalleryProps, settings } from '../index';
import { dbQuery } from '../../db';

//CSS
import styles from '../styles/Index.module.scss';

type TagsUrl = {
  tag: string;
};
const Tag = (props: BlogGalleryProps) => {
  const [currentCount, setCurrentCount] = useState(settings.COUNT_PER_POSTS);
  const { posts, tag } = props;
  const filteredPosts = posts.filter((post) => {
    const attachedTag = post.attachedTag;
    attachedTag.map((item) => (item.tag_name === tag ? true : false));
  });
  const viewablePosts = filteredPosts.slice(0, currentCount);
  return (
    <Layout pageTitle={'TAG:' + tag}>
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
                      <a>{tag}</a>
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

export const getStaticProps: GetStaticProps<BlogGalleryProps> = async ({ params }) => {
  const { tag } = params as TagsUrl;
  const posts = await getAllPosts();
  return {
    props: {
      posts: posts,
      tag: tag,
    },
  };
};

export const getStaticPaths: GetStaticPaths<TagsUrl> = async () => {
  const queryAboutTag = `SELECT tag_name FROM tags`;
  const tags = await dbQuery(queryAboutTag);
  const paths = tags.map((tag: TagsUrl) => {
    return { params: { tag: tag.toString() } };
  });
  return {
    paths,
    fallback: false,
  };
};

export default Tag;
