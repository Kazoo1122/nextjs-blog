//Next.jsモジュール
import { GetStaticProps, GetStaticPaths } from 'next';

//Reactモジュール
import { useState } from 'react';

//自作モジュール
import { Layout } from '../../components/Layout';
import { getAllPosts } from '../../lib/content';
import { BlogGalleryProps, COUNT_PER_POSTS } from '../';
import { LoadMore } from '../../components/LoadMore';
import { Articles } from '../../components/Articles';
import { getAllTags } from '../../lib/tag';

//CSS
import styles from '../../styles/Index.module.scss';
import { TagProps } from '../posts/[id]';
import { filterByTags } from '../../components/TagList';

type TagsUrl = {
  tag: string;
};
export default function Tag(props: BlogGalleryProps) {
  const [currentCount, setCount] = useState(COUNT_PER_POSTS);
  const { posts, tag } = props;
  const filteredPosts = filterByTags(posts, tag);
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
  const tags = await getAllTags();
  return {
    props: {
      posts: posts,
      tag: tag,
      tags: JSON.parse(JSON.stringify(tags)),
    },
  };
};

export const getStaticPaths: GetStaticPaths<TagsUrl> = async () => {
  const tags = await getAllTags();
  const paths = tags.map((tag: TagProps) => {
    return { params: { tag: tag.tag_name.toString() } };
  });
  return {
    paths,
    fallback: false,
  };
};
