import styles from '../styles/tag_list.module.scss';
import Link from 'next/link';
import { PostProps } from '../pages/posts/[id]';
import { BlogGalleryProps } from '../pages';

const TagList = (props: BlogGalleryProps) => {
  const { tags, posts } = props;
  return (
    <div className={styles.tag_list_area}>
      <h3 className={styles.tag_list_title}>
        <span>Tag List</span>
      </h3>
      <div className={styles.tags_box}>
        {tags.map((tag) => (
          <span key={tag} className='tags'>
            <Link href={{ pathname: '/', query: { tag: tag } }} passHref>
              <a>
                {tag} ( {filterByTags(posts, tag).length} )
              </a>
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
};

export function filterByTags(posts: PostProps[], tag: string) {
  return posts.filter((post) => {
    const attachedTag = post.attachedTag;
    return attachedTag.includes(tag);
  });
}

export { TagList };
