//Next.jsモジュール
import { GetStaticProps, GetStaticPaths } from 'next';

//Reactモジュール
import { useState } from 'react';

//自作モジュール
import { Layout } from '../../components/Layout';
import { getAllPosts } from '../../lib/content';
import { BlogGalleryProps, COUNT_PER_POSTS } from '../';
import { dbQuery } from '../../db';
import { LoadMore } from '../../components/LoadMore';
import { Articles } from '../../components/Articles';

//CSS
import styles from '../../styles/Index.module.scss';
import { TagProps } from '../posts/[id]';

type TagsUrl = {
  tag: string;
};
export default function Tag(props: BlogGalleryProps) {
  const [currentCount, setCount] = useState(COUNT_PER_POSTS);
  const { posts, tag } = props;
  const filteredPosts = posts.filter((post) => {
    const attachedTag = post.attachedTag;
    console.log(attachedTag, 'attachedTag');
    return attachedTag.includes(tag);
  });
  const postsLength = filteredPosts.length;
  const viewablePosts = filteredPosts.slice(0, currentCount);
  return (
    <Layout pageTitle={'Tag:' + tag}>
      <div className={styles.wrapper}>
        <Articles articles={viewablePosts} />
        <LoadMore currentCount={currentCount} setCount={setCount} postsLength={postsLength} />
      </div>
    </Layout>
  );
}

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
  const paths = tags.map((tag: TagProps) => {
    return { params: { tag: tag.tag_name.toString() } };
  });
  return {
    paths,
    fallback: false,
  };
};
